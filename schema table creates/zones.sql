CREATE TABLE `zones` (
  `zoneID` smallint(6) NOT NULL default '0',
  `name` char(64) default NULL,
  `eraID` smallint(6) default NULL,
  `instance` smallint(6) default NULL,
  `keyed` smallint(6) default NULL,
  `env` smallint(6) default NULL,
  PRIMARY KEY  (`zoneID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1



CREATE TABLE `eraType` (
  `eraID` smallint(6) NOT NULL auto_increment,
  `descr` char(64) default NULL,
  PRIMARY KEY  (`eraID`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=latin1


CREATE TABLE `envType` (
  `envID` smallint(6) NOT NULL auto_increment,
  `descr` char(64) default NULL,
  PRIMARY KEY  (`envID`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;
INSERT INTO envType values (null, "City"), (null, "Indoor"), (null, "Outdoor");
