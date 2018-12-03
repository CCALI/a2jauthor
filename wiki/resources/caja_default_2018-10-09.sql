# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.38)
# Database: caja_default
# Generation Time: 2018-10-09 21:53:37 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table guides
# ------------------------------------------------------------

DROP TABLE IF EXISTS `guides`;

CREATE TABLE `guides` (
  `editoruid` bigint(20) DEFAULT NULL,
  `isPublic` tinyint(1) DEFAULT NULL,
  `isFree` tinyint(1) DEFAULT NULL,
  `gid` bigint(20) NOT NULL AUTO_INCREMENT,
  `filename` varchar(200) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CALIcode` varchar(20) DEFAULT NULL,
  `CALIowned` tinyint(1) DEFAULT NULL,
  `clonedfromgid` bigint(20) DEFAULT NULL,
  `owner` varchar(20) DEFAULT NULL,
  `notes` text,
  `alias` varchar(200) DEFAULT NULL,
  `CALIid` bigint(20) DEFAULT NULL,
  `archive` tinyint(1) unsigned zerofill NOT NULL,
  PRIMARY KEY (`gid`),
  UNIQUE KEY `filename` (`filename`),
  KEY `created` (`created`),
  KEY `title` (`title`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `guides` WRITE;
/*!40000 ALTER TABLE `guides` DISABLE KEYS */;

INSERT INTO `guides` (`editoruid`, `isPublic`, `isFree`, `gid`, `filename`, `title`, `created`, `CALIcode`, `CALIowned`, `clonedfromgid`, `owner`, `notes`, `alias`, `CALIid`, `archive`)
VALUES
	(1,1,1,5,'A2J/guides/A2J_MobileOnline/A2J_MobileOnlineInterview_Interview.xml','A2J Mobile Online Interview','2012-10-05 00:00:00',NULL,0,0,NULL,'A2J Real Mobile Interview',NULL,NULL,0),
	(1,1,1,134,'A2J/guides/A2J_NYSample/A2J_NYSample_Interview.xml','NYS Surrogate\'s Small Estate Settlement','2014-08-28 13:33:19',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0),
	(1,1,1,135,'A2J/guides/A2J_ULSOnlineIntake081611/A2J_ULSOnlineIntake081611_Interview.xml','Utah Legal Services Online Intake','2014-08-28 13:33:19',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0),
	(45,NULL,NULL,917,'dev/guides/Guide917/Guide.xml','A Basic PDF template','2018-09-21 12:15:07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0);

/*!40000 ALTER TABLE `guides` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `uid` int(11) DEFAULT NULL,
  `username` varchar(64) NOT NULL,
  `nickname` varchar(64) DEFAULT NULL,
  `folder` varchar(64) DEFAULT NULL,
  `notes` varchar(30) DEFAULT NULL,
  `pkuid` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`pkuid`),
  UNIQUE KEY `uid` (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`uid`, `username`, `nickname`, `folder`, `notes`, `pkuid`)
VALUES
	(116,'arabanal','Alex Rabanal','arabanal',NULL,34),
	(0,'admin','admin','admin','reserved',1),
	(26,'demo','Demo User','demo','demo to run',5),
	(1,'a2j','A2J Staff','A2J','owner of A2J samples',6),
	(45,'dev','Author Developer','dev','sam\'s CAJA developer',7),
	(12,'sam','Sam Goshorn','sam',NULL,9),
	(9,'jmayer','John Mayer','jmayer',NULL,10),
	(8,'emasters','Elmer Masters','emasters',NULL,11),
	(47,'a2jtester','Test Tester','a2jtester',NULL,13),
	(46,'LSC Demo','LSC DEMO','LSC Demo',NULL,14),
	(11,'Jessica Frank','Jessica Bolack Frank','Jessica Frank',NULL,15);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
