<?php 

   // 1 = get game wide zone info list

   include("com/database.php");
   include("search.php");

   $p = file_get_contents('php://input');
   $po = json_decode($p);
  
   if (isset($po->m) == false) {echo "No Mode Set."; return; }
   
   $st = microtime(true);


   // get game wide zone info list
   if ($po->m == 1) {
      $return = $siteSearch->getZoneList();
   }

   if ($po->m == 2) {
      $return = $siteSearch->fullItemSearch($po->filters);
   }

   if ($po->m == 3) {
      $return = $siteSearch->getItemSourceDetails($po->itemIDs);
   }

   // filtered item search
   if ($po->m == 4) {
      $return = $siteSearch->itemSearch($po->filterData);
   }

   // get all spawn information about $po->npc_name
   if ($po->m == 5) {
      $return = $siteSearch->getSpawnInfo($po->npc_name);
   }


   $et = microtime(true);
   $return["duration"] = ($et-$st);

   echo json_encode($return);

   
?>


