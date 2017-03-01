drop table if exists npc;
CREATE TABLE `npc` (
  `npcID` int not null auto_increment,
  `name` char(128) default NULL,
  `upperLevel` smallint(6) default NULL,
  `lowerLevel` smallint(6) default NULL,
  `hitpoints` int(11) default NULL,
  `descr` char(128) default NULL,
  `typeID` smallint(6) default NULL,
  `subTypeID` smallint(6) default NULL,
  `attackable` smallint(6) default NULL,
  PRIMARY KEY  (`npcID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



CREATE TABLE `npcType` (
  `typeID` smallint(6) not NULL auto_increment,
  `type` char(64) default NULL,
  PRIMARY KEY  (`typeID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


drop table if exists npcSubType;
create table npcSubType
(
`subTypeID` smallint default null,
`descr` char(64) default null
) ENGINE=MyISAM;



drop table if exists npcZone;
create table npcZone
(
`npcID` int(11) default null,
`inZoneID` smallint default null
) ENGINE=MyISAM;


