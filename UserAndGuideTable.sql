/*
SQLyog Enterprise - MySQL GUI v5.17
Host - 5.0.95 : Database - CAJA
*********************************************************************
Server version : 5.0.95
*/

SET NAMES utf8;

SET SQL_MODE='';

create database if not exists `CAJA`;

USE `CAJA`;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

/*Table structure for table `guides` */

CREATE TABLE `guides` (
  `gid` bigint(20) NOT NULL auto_increment,
  `title` varchar(200) default NULL,
  `filename` varchar(200) default NULL,
  `editoruid` bigint(20) default NULL,
  `created` timestamp NULL default NULL,
  `CALIcode` varchar(20) default NULL,
  `CALIowned` tinyint(1) default NULL,
  `isFree` tinyint(1) default NULL,
  `isPublic` tinyint(1) default NULL,
  `clonedfromgid` bigint(20) default NULL,
  `owner` varchar(20) default NULL,
  `notes` text,
  `alias` varchar(200) default NULL,
  `CALIid` bigint(20) default NULL,
  `deleted` tinyint(1) default NULL,
  PRIMARY KEY  (`gid`),
  KEY `created` (`created`),
  KEY `title` (`title`)
) ENGINE=MyISAM AUTO_INCREMENT=173 DEFAULT CHARSET=utf8;

/*Data for the table `guides` */

insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (1,'Test 1','nothing.xml',0,'2012-10-05 00:00:00','',1,0,0,0,NULL,'First entry for testing',NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (3,'CALI Author Page Types','dev/CAPageTypes/CBK_CAPAGETYPES_jqBookData.xml',7,'2012-10-05 00:00:00','CAJA_CAPAGETYPES',0,1,1,0,NULL,'CALI Author Page Type Test Lesson',NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (4,'A2J Author Field Types','dev/A2JFieldTypes/A2J_FieldTypesTest_Interview.xml',7,'2012-10-05 00:00:00',NULL,0,1,1,0,NULL,'A2J Author Demo',NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (5,'A2J Mobile Online Interview','A2J//Samples/A2J_MobileOnlineInterview_Interview.xml',6,'2012-10-05 00:00:00',NULL,0,1,1,0,NULL,'A2J Real Mobile Interview',NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (111,'Are You My Partner? Is This a Partnership?','CCALI/BA/BA08/BA08.xml',2,'2012-10-12 15:01:22','BA08',1,0,1,0,'2','CALI Lesson','http://www.cali.org/lessons/web/ba08/',373,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (119,'Character Evidence Under Federal Rules','CCALI/EVD/EVD04/EVD04.xml',2,'2012-10-12 15:01:22','EVD04',1,0,1,0,'2','CALI Lesson','http://www.cali.org/lessons/web/evd04/',528,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (131,'An Overview of Relevance and Hearsay: A Nine Step Analytical Guide','CCALI/EVD/EVD16/EVD16.xml',2,'2012-10-12 15:01:22','EVD16',1,0,1,0,'2','CALI Lesson','http://www.cali.org/lessons/web/evd16/',1057,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (132,'Survey of EvidenceJames Edgar Hervey Professor of Law','demo/EVD03/EVD03.xml',5,NULL,NULL,NULL,NULL,NULL,118,NULL,NULL,NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (133,'Mobile Volunteer Lawyers Program online interview','demo/A2J_MobileOnlineInterview_Interview/A2J_MobileOnlineInterview_Interview.xml',5,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (134,'NYS Surrogate\\\'s Small Estate Settlement','A2J/Samples/A2J_NYSample_interview.xml',5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (135,'Utah Legal Services Online Intake','A2J/Samples/A2J_ULSOnlineIntake081611_Interview.xml',5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (136,'New Interview Title: Field Characters Test (Eç§á»Ð´Ã© - <\\\'&\\\">)','demo/CharTest/Field Characters Test.a2j',5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (166,'testing a guide My guide','demo/Guide166/Guide.xml',5,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (167,'My guide','demo/Guide167/Guide.xml',5,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (168,'My guide','demo/Guide168/Guide.xml',5,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (169,'My guide','demo/Guide169/Guide.xml',5,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (170,'My guide','demo/Guide170/Guide.xml',5,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (171,'My guide','demo/Guide171/Guide.xml',5,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL);
insert into `guides` (`gid`,`title`,`filename`,`editoruid`,`created`,`CALIcode`,`CALIowned`,`isFree`,`isPublic`,`clonedfromgid`,`owner`,`notes`,`alias`,`CALIid`,`deleted`) values (172,'','0/Guide172/Guide.xml',0,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL);

/*Table structure for table `usersbeta` */

CREATE TABLE `usersbeta` (
  `uid` int(11) NOT NULL auto_increment,
  `username` varchar(8) NOT NULL,
  `plainpass` varchar(8) default NULL,
  `perms` varchar(25) default NULL,
  `nickname` varchar(25) default NULL,
  `folder` varchar(20) default NULL,
  `notes` varchar(30) default NULL,
  PRIMARY KEY  (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

/*Data for the table `usersbeta` */

insert into `usersbeta` (`uid`,`username`,`plainpass`,`perms`,`nickname`,`folder`,`notes`) values (1,'admin','admin123','cali;a2j','admin','admin','reserved');
insert into `usersbeta` (`uid`,`username`,`plainpass`,`perms`,`nickname`,`folder`,`notes`) values (2,'cali','cali123','cali;a2j','CALI Staff','CCALI','owner of CALI lessons');
insert into `usersbeta` (`uid`,`username`,`plainpass`,`perms`,`nickname`,`folder`,`notes`) values (3,'prof','prof123','cali','Productive Professor','prof','CALI professor');
insert into `usersbeta` (`uid`,`username`,`plainpass`,`perms`,`nickname`,`folder`,`notes`) values (4,'read','read123',NULL,'Ready Reader','reader','no author capable');
insert into `usersbeta` (`uid`,`username`,`plainpass`,`perms`,`nickname`,`folder`,`notes`) values (5,'demo','demo123','cali;a2j','Demo Dude','demo','demo to run');
insert into `usersbeta` (`uid`,`username`,`plainpass`,`perms`,`nickname`,`folder`,`notes`) values (6,'a2j','a2j123','a2j','A2J Staff','A2J','owner of A2J samples');
insert into `usersbeta` (`uid`,`username`,`plainpass`,`perms`,`nickname`,`folder`,`notes`) values (7,'dev','dev123','cali;a2j','CAJA Developer','dev','sam\'s CAJA developer');

SET SQL_MODE=@OLD_SQL_MODE;