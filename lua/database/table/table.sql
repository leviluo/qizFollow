create database qizFollow default character set utf8 collate utf8_general_ci;
use qizFollow;

CREATE TABLE Account
( 
	AccountID            mediumint(8) unsigned auto_increment PRIMARY KEY,
	Account              varchar(16)  NULL 
		 DEFAULT  '',
	Status               char(1)  NOT NULL 
		 DEFAULT  '0',
	FuturesID            int  NULL 
		 DEFAULT  0,
	AccountType          char(1)  NULL
		 DEFAULT  '0',
	Password             varchar(32)  NULL 
		 DEFAULT  '',
	updatetime           datetime  NULL 
		 DEFAULT  NOW(),
	accountName            varchar(50)  NULL 
		 DEFAULT  '',
	Remark             varchar(50)  NULL 
		 DEFAULT  ''
) DEFAULT CHARSET=utf8;

 
CREATE TABLE AccountFollow
( 	
	id 				mediumint(8) unsigned auto_increment PRIMARY KEY,
	HostAccountID   int NOT NULL,
	Status               char(1)  NOT NULL 
		 DEFAULT  '0',
	FollowAccountID      integer  NOT NULL 
		 DEFAULT  0,
	FollowDirection      char(1)  NULL 
		 DEFAULT  '0',
	FollowRatio          numeric(5,2)  NULL 
		 DEFAULT  0.00,
	updatetime           datetime  NULL 
		 DEFAULT  NOW(),
	Remark             varchar(50)  NULL 
		 DEFAULT  '',
	OperID             mediumint(8) unsigned 
)DEFAULT CHARSET=utf8;

CREATE TABLE Config
( 
	KeyName              varchar(64)  NOT NULL 
		 DEFAULT  '',
	KeyValue             varchar(256)  NOT NULL 
		 DEFAULT  '',
	Description          varchar(256)  NULL 
		 DEFAULT  ''
)DEFAULT CHARSET=utf8;


ALTER TABLE Config
	ADD CONSTRAINT XPKConfig PRIMARY KEY  CLUSTERED (KeyName ASC)
;

CREATE TABLE Futures
( 
	FuturesID            mediumint(8) unsigned auto_increment PRIMARY KEY,
	FuturesName          varchar(64)  NULL 
		 DEFAULT  '',
	BrokerID             varchar(12)  NOT NULL 
		 DEFAULT  '',
	ApiType              int  NOT NULL 
		 DEFAULT  0,
	AuthType             char(1)  NOT NULL 
		 DEFAULT  '0',
	AuthCode             varchar(64)  NULL 
		 DEFAULT  ''
)DEFAULT CHARSET=utf8;


CREATE TABLE FuturesAddress
( 
	id            mediumint(8) unsigned auto_increment PRIMARY KEY,
	IP                   varchar(128)  NULL 
		 DEFAULT  '',
	AddressFlag          char(1)  NOT NULL 
		 DEFAULT  '0',
	FuturesID            int  NOT NULL 
		 DEFAULT  0,
	Port                 int  NULL 
)DEFAULT CHARSET=utf8;

CREATE TABLE Operator
( 
	OperID               mediumint(8) unsigned auto_increment PRIMARY KEY,
	OperName             varchar(64)  NOT NULL 
		 DEFAULT  '',
	OperPwd              varchar(64)  NOT NULL 
		 DEFAULT  '',
	Status               char(1)  NOT NULL 
		 DEFAULT  '0',
	UpdateDateTime datetime NOT NULL
		 DEFAULT NOW(),
	LastDateTime datetime NULL
		 DEFAULT NOW(),
	Remark               varchar(100)  NULL 
		 DEFAULT  '',
	Role               int  NOT NULL 
		 DEFAULT  0
)DEFAULT CHARSET=utf8;

CREATE TABLE SerialNo
( 
	SerialType           char(1)  NOT NULL 
		 DEFAULT  '0',
	BeginSerialNo        int  NULL 
		 DEFAULT  0,
	EndSerialNo          int  NULL 
		 DEFAULT  0,
	LastSerialNo         int  NULL 
		 DEFAULT  0
)DEFAULT CHARSET=utf8;

ALTER TABLE SerialNo
	ADD CONSTRAINT XPKSerialNo PRIMARY KEY  CLUSTERED (SerialType ASC)
;



CREATE TABLE Signals
( 
	SignalID            mediumint(8) unsigned auto_increment PRIMARY KEY,
	SignalType          int  NOT NULL 
		 DEFAULT  0,
	SignalExplain       varchar(50)  NULL 
		 DEFAULT  '',
	Remark             	varchar(50)  NULL 
		 DEFAULT  ''
)DEFAULT CHARSET=utf8;


CREATE TABLE SignalAccountRelation
( 
	SignalID            int  NOT NULL 
		 DEFAULT  0,
	AccountID            int  NOT NULL 
		 DEFAULT  0
)DEFAULT CHARSET=utf8;

CREATE TABLE SignalUser
( 
	UserID       			varchar(50)  NOT NULL 
		 DEFAULT  '',
	UserName       			varchar(50)  NULL 
		 DEFAULT  '',
	Password       			varchar(50)  NULL 
		 DEFAULT  '',
	Status               char(1)  NOT NULL 
		 DEFAULT  '0',		 
	Remark             	varchar(50)  NULL 
		 DEFAULT  ''
)DEFAULT CHARSET=utf8;

ALTER TABLE SignalUser
	ADD CONSTRAINT XPKSignalUser PRIMARY KEY  CLUSTERED (UserID ASC)
;

CREATE TABLE SignalUserRelation
( 
	SignalID            mediumint(8) unsigned auto_increment PRIMARY KEY,
	UserID       			varchar(50)  NOT NULL 
		 DEFAULT  '',
	Status               char(1)  NOT NULL 
		 DEFAULT  '0'		 
)DEFAULT CHARSET=utf8;

CREATE TABLE MonitorOperLog
( 
    id    int unsigned auto_increment PRIMARY KEY,
	Date  varchar(9)  NOT NULL DEFAULT  '',
	Time  varchar(9)  NOT NULL DEFAULT  '',
	IpAddress  varchar(64)  NOT NULL DEFAULT  '0',
    Oper  varchar(256)  NOT NULL DEFAULT  '0'
) DEFAULT CHARSET=utf8;

CREATE TABLE RelationGroup
( 
	id    int auto_increment PRIMARY KEY,
	name  varchar(64)  NOT NULL
) DEFAULT CHARSET=utf8;

CREATE TABLE RelationGroupMember
( 
	`id` int(11) NOT NULL AUTO_INCREMENT,
	GroupID    int NOT NULL,
	followid   int NOT NULL COMMENT '该组包含的跟单关系',
	PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8;

-- 合约过滤
CREATE TABLE `FollowFilter` (
  `followid` int(11) NOT NULL,
  `contractid` varchar(64) NOT NULL COMMENT '过滤的合约',
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 合约转换
CREATE TABLE `FollowConvert` (
  `followid` int(11) NOT NULL,
  `contractHost` varchar(64) NOT NULL COMMENT '主账户下单的合约',
  `contractFollow` varchar(64) NOT NULL COMMENT '从账户要下单的合约',
  `ratio` decimal(5,2) DEFAULT '0.00' COMMENT '倍率',
  `FollowDirection` char(1) NOT NULL DEFAULT '0' COMMENT '方向',
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into Operator(`OperName`,`OperPwd`) values('admin','888888');
insert into Config(`KeyName`,`keyValue`) values('ClosePriceTick','0');
insert into Config(`KeyName`,`keyValue`) values('OpenPriceTick','0');
insert into Config(`KeyName`,`keyValue`) values('OrderLimitDelay','0');
insert into Config(`KeyName`,`keyValue`) values('NeedInstrumentStatus','1');
insert into Config(`KeyName`,`keyValue`) values('MarketPriceType','1');
