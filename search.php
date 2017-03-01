<?php

   class _siteSearch {

      function getZoneList() {
         global $database;
         $zonelist = $database->queryToObject("
            select jeqZoneSummary.*, jeqExpansionZones.expansion_name, zone.zone_exp_multiplier
            from jeqZoneSummary
            left join jeqExpansionZones on jeqZoneSummary.zoneID  = jeqExpansionZones.zoneID
            left join zone on jeqZoneSummary.zoneID = zone.zoneidnumber
            where zoneidnumber <= ".MAX_ZONE_ID."
            order by jeqZoneSummary.long_name
         ");

         // $res = $database->query("
         //    select jeqZoneSummary.*, jeqExpansionZones.expansion_name, zone.zone_exp_multiplier
         //    from jeqZoneSummary
         //    left join jeqExpansionZones on jeqZoneSummary.zoneID  = jeqExpansionZones.zoneID
         //    left join zone on jeqZoneSummary.zoneID = zone.zoneidnumber
         //    where jeqZoneSummary.zoneID <= ".MAX_ZONE_ID." order by jeqZoneSummary.long_name
         // ");

         //$zonelist = json_decode($database->json_encode_results($res));

         return array("zone_list"=>$zonelist);
      }

      // scans entire game (drops, merchants, quests) based on various filters
      // and returns the matching item.* information
      function fullItemSearch($filters) {
         global $database;

         syslog(LOG_INFO, "ff:".json_encode($filters));

         $hasZoneFilter = false;

         $merchantConditions = array();
         $dropConditions = array();
         $questConditions = array();
         $craftedConditions = array();

         for ($i=0;$i<sizeof($filters);$i++) {
            $f = $filters[$i];

            // var FILTER_ZONENAMES = 1;
            if ($f->type == 1) {
               $merchantConditions[] = " zone.short_name in (".join(",", $f->zoneNames).") ";  // ???
               $dropConditions[] = " jeqLoottableByZone.zone_short_name in (".join(",", $f->zoneNames).")"; 
               $questConditions[] = " jeqQuestRewards.zone_short_name in (".join(",", $f->zoneNames).")";
            }

            // var FILTER_ITEMIDS = 4;
            if ($f->type == 4) {
               $merchantConditions[] = " items.id in (".join(",", $f->itemIDs).") ";
               $dropConditions[] = " items.id in (".join(",", $f->itemIDs).") ";
               $questConditions[] = " jeqQuestRewards.itemID in (".join(",", $f->itemIDs).") ";
               $craftedConditions[] = " items.id in (".join(",", $f->itemIDs).") ";
            }

            // var FILTER_ZONEIDS = 6;
            if ($f->type == 6) {
               $hasZoneFilter = true;
               $merchantConditions[] = " zone.zoneidnumber in (".join(",", $f->zoneIDs).") ";
               $dropConditions[] = " jeqLoottableByZone.zoneID in (".join(",", $f->zoneIDs).")"; 
               $questConditions[] = " jeqQuestRewards.zoneID in (".join(",", $f->zoneIDs).")"; 
            }

         }


         $craftedConditions = implode(" and ", $craftedConditions);
         if (strlen($craftedConditions)>0) $craftedConditions = " where ".$craftedConditions;

         $merchantConditions = implode(" and ", $merchantConditions);
         if (strlen($merchantConditions)>0) $merchantConditions = " where ".$merchantConditions;

         $dropConditions = implode(" and ", $dropConditions);
         if (strlen($dropConditions)>0) $dropConditions = " where ".$dropConditions;

         $questConditions = implode(" and ", $questConditions);
         if (strlen($questConditions)>0) $questConditions = " where ".$questConditions;



         $inventory = array();

         $itemFields = "items.astr, items.adex, items.asta, items.acha, items.awis, items.aint,
            items.aagi, items.fr, items.dr, items.cr, items.mr, items.pr, items.hp, items.mana,
            items.weight, items.damage, items.delay, items.ac, items.size, items.itemtype,
            items.proceffect, items.magic, items.lore, items.nodrop,
            items.races, items.classes, items.slots, items.price, items.Name as name, items.range,
            items.bagtype, items.bagslots, items.bagwr, items.book, items.itemclass, 
            items.worneffect, items.wornlevel, items.itemtype,  items.focuseffect, items.casttime, items.clickeffect,
            (select name from spells_new where id = items.worneffect) as worneffect_name,
            (select name from spells_new where id = items.proceffect) as proceffect_name,
            (select name from spells_new where id = items.focuseffect) as focuseffect_name, 
            (select name from spells_new where id = items.clickeffect) as clickeffect_name ";

         // 1 = merchant
         // 2 = drop
         // 4 = quest
         $inventory = $database->queryToObject($qq = "
            select \"1\" as source, 
            $itemFields, merchantlist.item as itemID
            from merchantlist
            left join items on merchantlist.item = items.id
            left join npc_types on merchantlist.merchantid = npc_types.merchant_id
            left join spawnentry on npc_types.id = spawnentry.npcID
            left join spawn2 as spawn2 on spawnentry.spawngroupID = spawn2.spawngroupID
            left join zone on zone.short_name = spawn2.zone
            $merchantConditions
            and items.name IS NOT null 
            and zone.zoneidnumber <= ".MAX_ZONE_ID." 
            group by merchantlist.item

            union 

            select \"2\" as source,
            $itemFields, items.id as itemID
            from items
            left join lootdrop_entries on lootdrop_entries.item_id = items.id
            left join loottable_entries on loottable_entries.lootdrop_id = lootdrop_entries.lootdrop_id
            left join jeqLoottableByZone on jeqLoottableByZone.loottable_id = loottable_entries.loottable_id
            left join npc_types on npc_types.loottable_id = loottable_entries.loottable_id 
            $dropConditions
            and jeqLoottableByZone.zoneID is not NULL
            and jeqLoottableByZone.zoneID <= ".MAX_ZONE_ID." 

            union 

            select \"4\" as source,
            $itemFields, jeqQuestRewards.itemID 
            from jeqQuestRewards
            left join items on jeqQuestRewards.itemID = items.id
            $questConditions
            and jeqQuestRewards.zoneID <= ".MAX_ZONE_ID." 


            order by name, itemID
            "
         );

            // union 

            // select \"8\" as source,
            // $itemFields, items.id
            // from tradeskill_recipe
            // left join items on tradeskill_recipe.name = items.name
            // $craftedConditions

         
         file_put_contents("/tmp/tril.log", "================================\n".$qq."\n", FILE_APPEND);

            // ".($hasZoneFilter==false?"

            // union 

            // select \"4\" as source,
            // $itemFields, items.id as itemID
            // from items
            // left join lootdrop_entries on lootdrop_entries.item_id = items.id
            // $condition2result
            // and lootdrop_id is NULL
            // ":"")."


         return array("query"=> $qq, "inventory"=>$inventory);
      }

      // returns drop sources, merchant sell sources, and quest rewards npc sources from itemIDs
      function getItemSourceDetails($itemIDs) {
         global $database;
         
         $merchant_data = $database->queryToObject("
            select
            spawn2.zone as short_name,
            npc_types.merchant_id,
            npc_types.name,
            npc_types.id
            from merchantlist
            left join npc_types on npc_types.merchant_id = merchantlist.merchantid
            left join spawnentry on spawnentry.npcID = npc_types.id
            left join spawn2 on spawn2.spawngroupID = spawnentry.spawngroupID
            left join zone on zone.short_name = spawn2.zone
            where merchantlist.item in (".join(",",$itemIDs).")
            and zone.zoneidnumber <= ".MAX_ZONE_ID."
            order by npc_types.name;
         ");
         
         $drops = $database->queryToObject("
            select
            npc_types.id,
            npc_types.name,
            jeqLoottableByZone.zone_short_name as short_name,
            jeqLoottableByZone.zoneID as zoneID
            from items 
            left join lootdrop_entries on lootdrop_entries.item_id = items.id
            left join loottable_entries on loottable_entries.lootdrop_id = lootdrop_entries.lootdrop_id
            left join jeqLoottableByZone on jeqLoottableByZone.loottable_id = loottable_entries.loottable_id
            left join loottable on loottable.ID = jeqLoottableByZone.loottable_id
            left join npc_types on npc_types.loottable_id = loottable.id
            where items.id in (".join(",",$itemIDs).")
            and loottable.name is not NULL
            and jeqLoottableByZone.zoneID <= ".MAX_ZONE_ID."
            group by npc_types.name, jeqLoottableByZone.zone_short_name
            order by short_name;
         ");

         $questitems = $database->queryToObject("
            select
            npc_types.id,
            npc_types.name,            
            jeqQuestRewards.zone_short_name as short_name,
            jeqQuestRewards.zoneID
            from jeqQuestRewards 
            left join npc_types on jeqQuestRewards.npcID = npc_types.id 
            left join items on jeqQuestRewards.itemID = items.id
            where jeqQuestRewards.itemID in (".join(",",$itemIDs).")
            and jeqQuestRewards.zoneID <= ".MAX_ZONE_ID." 
            order by items.Name
         ");

         return array(
            "merchant_data"=>$merchant_data,
            "drop_data"=>$drops,
            "quest_rewards"=>$questitems
         );
      }


      function itemSearch($filters) {
         global $database;

         // add name condition
         if (isset($filters->name)==true) {
            $nameCondition = " items.name like \"".$filters->name."%\" ";
         }

         // build itemType conditions
         $itemtypeConditions = "";
         if (isset($filters->itemtype)==true) {
            $itemtypeConditions .= " itemType in (";

            for ($i=0;$i<sizeof($filters->itemtype);$i++) {
               $itemtypeConditions .= $filters->itemtype[$i]->ID;
               if ($i+1<sizeof($filters->itemtype)) $itemtypeConditions .= ",";
            }
            $itemtypeConditions .= ") ";
         }


         // build slots conditions
         $slotConditions = "";
         if (isset($filters->slots)==true) {
            $slotConditions .= "(";
            for ($i=0;$i<sizeof($filters->slots);$i++) {
               $slotConditions .= "slots&".$filters->slots[$i]->ID."=".$filters->slots[$i]->ID;
               if ($i+1<sizeof($filters->slots)) $slotConditions .= " or ";
            }
            $slotConditions .= ")";         
         }


         // build class conditions
         $classConditions = "";
         if (isset($filters->classes)==true) {
            $classConditions .= "(";
            for ($i=0;$i<sizeof($filters->classes);$i++) {
               $classConditions .= "classes&".$filters->classes[$i]->ID."=".$filters->classes[$i]->ID;
               if ($i+1<sizeof($filters->classes)) $classConditions .= " or ";
            }
            $classConditions .= ")";         
         }

         // build attributes
         $attribConditions = "";
         if (isset($filters->attributes)==true) {
            $attribConditions .= "(";
            for ($i=0;$i<sizeof($filters->attributes);$i++) {
               // empty value? assume >0 so it at least must be present
               if ($filters->attributes[$i]->value=="") $filters->attributes[$i]->value = ">0";

               // doesnt have a < or >?  assumg >=
               if (strpos($filters->attributes[$i]->value, "<")===false && strpos($filters->attributes[$i]->value, ">")===false) {
                  $filters->attributes[$i]->value = ">=".$filters->attributes[$i]->value;
               }
               
               // searching for less than a value? still needs to be present
               if (strpos($filters->attributes[$i]->value, "<") !== false) {
                  $filters->attributes[$i]->value = ">0 and ".$filters->attributes[$i]->ID." ".$filters->attributes[$i]->value.") ";
                  $filters->attributes[$i]->ID = "(".$filters->attributes[$i]->ID;

               }

               $attribConditions .= $filters->attributes[$i]->ID.$filters->attributes[$i]->value;
               if ($i+1<sizeof($filters->attributes)) $attribConditions .= " and ";
            }
            $attribConditions .= ")";         
         }

         $q = "select
            items.id as itemID,
            items.name
            from items";

            //left join zone on zone.short_name = jeqItemsByZone.zone_short_name";
            //jeqItemsByZone.zone_short_name
            //left join jeqItemsByZone on items.id = jeqItemsByZone.itemID

         $conditions = "";

         if ($nameCondition!=""||$itemtypeConditions!=""||$slotConditions!=""||$classConditions!="") $q .= " where ";

         if ($itemtypeConditions!="") {
            $q .= $itemtypeConditions;
            $conditions .= $itemtypeConditions;
         }

         if ($slotConditions!="") {
            if ($conditions!="") $q .= " and ";
            $q .= $slotConditions;
            $conditions .= $slotConditions;
         }

         if ($classConditions!="") {
            if ($conditions!="") $q .= " and ";
            $q .= $classConditions;
            $conditions .= $classConditions;
         }

         if ($nameCondition!="") {
            if ($conditions!="") $q .= " and ";
            $q .= $nameCondition;
            $conditions .= $nameCondition;
         }

         if ($attribConditions!="") {
            if ($conditions!="") $q .= " and ";
            $q .= $attribConditions;
         }


         //$q .= " and zone.zoneidnumber <= ".MAX_ZONE_ID;
         $q .= " group by itemID order by itemID asc limit 2000";
         //and jeqItemsByZone.zone_short_name IS NOT NULL

         file_put_contents("/tmp/tril.log", "================================\n".$q."\n", FILE_APPEND);

         $searchResults = $database->queryToObject($q);

         //$searchResults =  $database->queryToObject json_decode($database->json_encode_results($res));
         
         return array("query"=>$q, "searchResults"=>$searchResults);

      }

      function getSpawnInfo($npc_name) {
         global $database;

         $spawnInfo = $database->query("
            select
               spawn2.zone, spawnentry.spawngroupID, spawnentry.chance, spawn2.x, spawn2.y, spawn2.respawntime, npc_types.name, npc_types.level
               from spawnentry 
               left join npc_types on npc_types.id = spawnentry.npcID 
               left join spawn2 on spawn2.spawngroupID = spawnentry.spawngroupID 
               where zone is not NULL 
                  and npc_types.name=\"$npc_name\"
               order by spawn2.x, spawn2.y"
         );

         return array(
            "spawnInfo"=>json_decode($database->json_encode_results($spawnInfo))
         );

      }
   }

   $siteSearch = new _siteSearch;

?>