
 CREATE TABLE `spells` (
  `activated` int(11) default NULL,
  `aeduration` int(11) default NULL,
  `aerange` int(11) default NULL,
  `attack_open` int(11) default NULL,
  `attrib1` int(11) default NULL,
  `attrib10` int(11) default NULL,
  `attrib11` int(11) default NULL,
  `attrib12` int(11) default NULL,
  `attrib2` int(11) default NULL,
  `attrib3` int(11) default NULL,
  `attrib4` int(11) default NULL,
  `attrib5` int(11) default NULL,
  `attrib6` int(11) default NULL,
  `attrib7` int(11) default NULL,
  `attrib8` int(11) default NULL,
  `attrib9` int(11) default NULL,
  `autocast` int(11) default NULL,
  `autocasttext` char(128) default NULL,
  `base1` int(11) default NULL,
  `base10` int(11) default NULL,
  `base11` int(11) default NULL,
  `base12` int(11) default NULL,
  `base2` int(11) default NULL,
  `base2_1` int(11) default NULL,
  `base2_10` int(11) default NULL,
  `base2_11` int(11) default NULL,
  `base2_12` int(11) default NULL,
  `base2_2` int(11) default NULL,
  `base2_3` int(11) default NULL,
  `base2_4` int(11) default NULL,
  `base2_5` int(11) default NULL,
  `base2_6` int(11) default NULL,
  `base2_7` int(11) default NULL,
  `base2_8` int(11) default NULL,
  `base2_9` int(11) default NULL,
  `base3` int(11) default NULL,
  `base4` int(11) default NULL,
  `base5` int(11) default NULL,
  `base6` int(11) default NULL,
  `base7` int(11) default NULL,
  `base8` int(11) default NULL,
  `base9` int(11) default NULL,
  `berlevel` int(11) default NULL,
  `bonushate` int(11) default NULL,
  `bookicon` int(11) default NULL,
  `brdlevel` int(11) default NULL,
  `bstlevel` int(11) default NULL,
  `calc1` int(11) default NULL,
  `calc10` int(11) default NULL,
  `calc11` int(11) default NULL,
  `calc12` int(11) default NULL,
  `calc2` int(11) default NULL,
  `calc3` int(11) default NULL,
  `calc4` int(11) default NULL,
  `calc5` int(11) default NULL,
  `calc6` int(11) default NULL,
  `calc7` int(11) default NULL,
  `calc8` int(11) default NULL,
  `calc9` int(11) default NULL,
  `can_mgb` int(11) default NULL,
  `castinganim` int(11) default NULL,
  `castingtime` int(11) default NULL,
  `castmsg1` char(128) default NULL,
  `castmsg2` char(128) default NULL,
  `castmsg3` char(128) default NULL,
  `castmsg4` char(128) default NULL,
  `castmsg5` char(128) default NULL,
  `category` char(128) default NULL,
  `classes` char(128) default NULL,
  `clrlevel` int(11) default NULL,
  `defense_open` int(11) default NULL,
  `deities` char(128) default NULL,
  `deletable` int(11) default NULL,
  `desc1` char(128) default NULL,
  `desc10` char(128) default NULL,
  `desc11` char(128) default NULL,
  `desc12` char(128) default NULL,
  `desc2` char(128) default NULL,
  `desc3` char(128) default NULL,
  `desc4` char(128) default NULL,
  `desc5` char(128) default NULL,
  `desc6` char(128) default NULL,
  `desc7` char(128) default NULL,
  `desc8` char(128) default NULL,
  `desc9` char(128) default NULL,
  `descnum` int(11) default NULL,
  `dotstackingexempt` int(11) default NULL,
  `drulevel` int(11) default NULL,
  `duration` int(11) default NULL,
  `durationformula` int(11) default NULL,
  `durationtext` char(128) default NULL,
  `enclevel` int(11) default NULL,
  `enduranceupkeep` int(11) default NULL,
  `environment` int(11) default NULL,
  `error_open` int(11) default NULL,
  `extra` char(128) default NULL,
  `fizzleadj` int(11) default NULL,
  `fizzletime` int(11) default NULL,
  `foci` char(128) default NULL,
  `focus1` int(11) default NULL,
  `focus2` int(11) default NULL,
  `focus3` int(11) default NULL,
  `focus4` int(11) default NULL,
  `focusitems` char(128) default NULL,
  `gemicon` int(11) default NULL,
  `hateamount` int(11) default NULL,
  `id` int(11) default NULL,
  `lighttype` int(11) default NULL,
  `location` char(128) default NULL,
  `maglevel` int(11) default NULL,
  `manacost` int(11) default NULL,
  `max1` int(11) default NULL,
  `max10` int(11) default NULL,
  `max11` int(11) default NULL,
  `max12` int(11) default NULL,
  `max2` int(11) default NULL,
  `max3` int(11) default NULL,
  `max4` int(11) default NULL,
  `max5` int(11) default NULL,
  `max6` int(11) default NULL,
  `max7` int(11) default NULL,
  `max8` int(11) default NULL,
  `max9` int(11) default NULL,
  `maxduration` char(32) default NULL,
  `minduration` char(32) default NULL,
  `minlevel` int(11) default NULL,
  `mnklevel` int(11) default NULL,
  `name` char(128) default NULL,
  `neclevel` int(11) default NULL,
  `nodispell` int(11) default NULL,
  `npc_category` int(11) default NULL,
  `npc_usefulness` int(11) default NULL,
  `numhits` int(11) default NULL,
  `pallevel` int(11) default NULL,
  `pushback` int(11) default NULL,
  `pushup` int(11) default NULL,
  `pvpresistbase` int(11) default NULL,
  `pvpresistcalc` int(11) default NULL,
  `pvpresistcap` int(11) default NULL,
  `range` int(11) default NULL,
  `reagentcount1` int(11) default NULL,
  `reagentcount2` int(11) default NULL,
  `reagentcount3` int(11) default NULL,
  `reagentcount4` int(11) default NULL,
  `reagentid1` int(11) default NULL,
  `reagentid2` int(11) default NULL,
  `reagentid3` int(11) default NULL,
  `reagentid4` int(11) default NULL,
  `reagents` char(128) default NULL,
  `recasttime` int(11) default NULL,
  `resist` char(128) default NULL,
  `resistadj` int(11) default NULL,
  `rnglevel` int(11) default NULL,
  `roglevel` int(11) default NULL,
  `shdlevel` int(11) default NULL,
  `shmlevel` int(11) default NULL,
  `shortbuff` int(11) default NULL,
  `skill` char(128) default NULL,
  `skill_open` int(11) default NULL,
  `source` char(128) default NULL,
  `spaindex` int(11) default NULL,
  `spellanim` int(11) default NULL,
  `spellgroup` int(11) default NULL,
  `spellicon` int(11) default NULL,
  `spelltype` char(128) default NULL,
  `targetanim` int(11) default NULL,
  `targettype` char(128) default NULL,
  `targname` char(128) default NULL,
  `timeofday` char(128) default NULL,
  `timer` int(11) default NULL,
  `traveltype` int(11) default NULL,
  `uninterruptable` int(11) default NULL,
  `unknown112` int(11) default NULL,
  `unknown113` int(11) default NULL,
  `unknown129` int(11) default NULL,
  `unknown130` int(11) default NULL,
  `unknown131` int(11) default NULL,
  `unknown139` int(11) default NULL,
  `unknown140` int(11) default NULL,
  `unknown141` int(11) default NULL,
  `unknown144` int(11) default NULL,
  `unknown145` int(11) default NULL,
  `unknown146` int(11) default NULL,
  `unknown147` int(11) default NULL,
  `unknown148` int(11) default NULL,
  `unknown149` int(11) default NULL,
  `unknown151` int(11) default NULL,
  `unknown152` int(11) default NULL,
  `unknown153` int(11) default NULL,
  `unknown154` int(11) default NULL,
  `unknown156` int(11) default NULL,
  `unknown176` int(11) default NULL,
  `unknown182` int(11) default NULL,
  `unknown183` int(11) default NULL,
  `unknown184` int(11) default NULL,
  `unknown185` int(11) default NULL,
  `unknown190` int(11) default NULL,
  `unknown191` int(11) default NULL,
  `unknown192` int(11) default NULL,
  `unknown193` int(11) default NULL,
  `unknown194` int(11) default NULL,
  `unknown195` int(11) default NULL,
  `unknown196` int(11) default NULL,
  `unknown197` int(11) default NULL,
  `unknown198` int(11) default NULL,
  `unknown199` int(11) default NULL,
  `unknown200` int(11) default NULL,
  `unknown201` int(11) default NULL,
  `unknown202` int(11) default NULL,
  `unknown203` int(11) default NULL,
  `unknown204` int(11) default NULL,
  `unknown205` int(11) default NULL,
  `unknown206` int(11) default NULL,
  `unknown207` int(11) default NULL,
  `unknown209` int(11) default NULL,
  `unknown210` int(11) default NULL,
  `unknown211` int(11) default NULL,
  `unknown212` int(11) default NULL,
  `unknown213` int(11) default NULL,
  `unknown214` int(11) default NULL,
  `unknown215` int(11) default NULL,
  `unknown216` int(11) default NULL,
  `unknown217` int(11) default NULL,
  `unknown218` int(11) default NULL,
  `unknown219` int(11) default NULL,
  `unknown220` int(11) default NULL,
  `unknown221` int(11) default NULL,
  `unknown222` int(11) default NULL,
  `unknown223` int(11) default NULL,
  `unknown224` int(11) default NULL,
  `unknown225` int(11) default NULL,
  `unknown226` int(11) default NULL,
  `unknown227` int(11) default NULL,
  `unknown228` int(11) default NULL,
  `unknown229` int(11) default NULL,
  `unknown230` int(11) default NULL,
  `unknown231` int(11) default NULL,
  `unknown232` int(11) default NULL,
  `unknown233` int(11) default NULL,
  `unknown234` int(11) default NULL,
  `unknown235` int(11) default NULL,
  `unknown236` int(11) default NULL,
  `updated` char(128) default NULL,
  `warlevel` int(11) default NULL,
  `wizlevel` int(11) default NULL,
  KEY `a` (`berlevel`),
  KEY `b` (`brdlevel`),
  KEY `c` (`bstlevel`),
  KEY `d` (`clrlevel`),
  KEY `e` (`drulevel`),
  KEY `f` (`enclevel`),
  KEY `g` (`maglevel`),
  KEY `h` (`minlevel`),
  KEY `i` (`mnklevel`),
  KEY `j` (`neclevel`),
  KEY `k` (`pallevel`),
  KEY `l` (`rnglevel`),
  KEY `m` (`roglevel`),
  KEY `n` (`shdlevel`),
  KEY `o` (`shmlevel`),
  KEY `p` (`warlevel`),
  KEY `q` (`wizlevel`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
