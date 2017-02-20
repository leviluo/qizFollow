local dbOpt = require("database/db_mysql")
local publicMethod = require("./public/publicMethod")

function printInfo(key, value)
	local Msg = "{\"id\":"..key..",\"msg\":\""..value.."\"}";
	ngx.say(Msg);
end;
	
ngx.req.read_body();
local value = ngx.req.get_post_args();

function AccountData()

	if (value['operateType'] == nil or value['Account'] == nil or value['Status'] == nil or value['Password'] == nil or value['accountName'] == nil or value['AccountType'] == nil or value['FuturesID'] == nil or value['Remark'] == nil) then
		printInfo(-12, "缺少参数");
		return;
	end;

	if value['AccountID'] == nil then
		value['AccountID'] = 0;
	end

	local result = publicMethod.getOnedata_nil("select * from Account where Account = '"..value['Account'].."' and AccountID != "..value['AccountID'].."");
	if (next(result) == nil) then

		if value['operateType'] == 'ADD' then
			publicMethod.operateOnedata("insert into Account(`Account`,`Status`,`Password`,`accountName`,`AccountType`,`FuturesID`,`Remark`,`updatetime`) values('"..value['Account'].."','"..value['Status'].."','"..value['Password'].."','"..value['accountName'].."','"..value['AccountType'].."',"..value['FuturesID']..",'"..value['Remark'].."',now());","添加成功")
		elseif value['operateType'] == 'MODIFY' then
			local result = publicMethod.getOnedata_nil("select * from Account where AccountID = "..value['AccountID'].." and AccountType = '"..value['AccountType'].."';")
			if next(result) == nil then
				local result = publicMethod.getOnedata_nil("select * from AccountFollow where HostAccountID = "..value['AccountID'].." or FollowAccountID = "..value['AccountID'].."");
				if(next(result) == nil) then
					publicMethod.operateOnedata("update Account set Account='"..value['Account'].."',Status='"..value['Status'].."',Password='"..value['Password'].."',accountName='"..value['accountName'].."',AccountType='"..value['AccountType'].."',Remark='"..value['Remark'].."',updatetime=now(),FuturesID="..value['FuturesID'].." where AccountID = "..value['AccountID']..";","修改成功")
					return
				end 
				printInfo(-13, "该账户存在关联关系,请先删除此关系");
			else 
				publicMethod.operateOnedata("update Account set Account='"..value['Account'].."',Status='"..value['Status'].."',Password='"..value['Password'].."',accountName='"..value['accountName'].."',Remark='"..value['Remark'].."',updatetime=now(),FuturesID="..value['FuturesID'].." where AccountID = "..value['AccountID']..";","修改成功")
			end
		end

	else
	printInfo(-11, "账户名重复");
	end;
end


function FuturesAddrData()

	if (value['FuturesID'] == nil or value['IP'] == nil or value['Port'] == nil or value['AddressFlag'] == nil) then
		printInfo(-12, "缺少参数");
		return;
	end;

	local result = publicMethod.getOnedata_nil("select * from Futures where FuturesID = "..value['FuturesID'].."");
	if (next(result) ~= nil) then
		if value['operateType'] == 'ADD' then
		publicMethod.operateOnedata("insert into FuturesAddress(`FuturesID`,`IP`,`Port`,`AddressFlag`) values("..value['FuturesID']..",'"..value['IP'].."',"..value['Port']..",'"..value['AddressFlag'].."');","添加成功")
		elseif value['operateType'] == 'MODIFY' then
		publicMethod.operateOnedata("update FuturesAddress set IP='"..value['IP'].."',Port="..value['Port']..",AddressFlag='"..value['AddressFlag'].."' where id = "..value['id']..";","修改成功")
		end
	else
	printInfo(-11, "不存在此交易系统");
	end;

end;

function FuturesData()

	if (value['FuturesName'] == nil or value['BrokerID'] == nil or value['ApiType'] == nil or value['AuthCode'] == nil or value['AuthType'] == nil) then
		printInfo(-12, "缺少参数");
		return;
	end;

	if value['FuturesID'] == nil then 
		value['FuturesID'] = 0;
	end

	local result = publicMethod.getOnedata_nil("select * from Futures where FuturesName = '"..value['FuturesName'].."' and FuturesID != "..value['FuturesID'].."");
	if (next(result) == nil) then
		if value['operateType'] == 'ADD' then
		publicMethod.operateOnedata("insert into Futures(`FuturesName`,`BrokerID`,`ApiType`,`AuthCode`,`AuthType`) values('"..value['FuturesName'].."','"..value['BrokerID'].."',"..value['ApiType']..",'"..value['AuthCode'].."','"..value['AuthType'].."');","添加成功")
		elseif value['operateType'] == 'MODIFY' then
		publicMethod.operateOnedata("update Futures set AuthCode='"..value['AuthCode'].."',AuthType='"..value['AuthType'].."',FuturesName='"..value['FuturesName'].."',BrokerID='"..value['BrokerID'].."',ApiType="..value['ApiType'].." where FuturesID = "..value['FuturesID']..";","修改成功")
		end
	else
	printInfo(-11, "交易系统名重复");
	end;

end;

function GetAccountData()
	publicMethod.getAlldata("select a.*,f.FuturesName from Account as a left join Futures as f on a.FuturesID = f.FuturesID order by a.AccountID;")
end;

function GetAccounts()
	publicMethod.getAlldata("select Account.AccountID as id,Account.Account as value,Account.AccountType, Futures.FuturesName from Account left join Futures on Futures.FuturesID=Account.FuturesID")
end;

function GetFuturesNames()
	publicMethod.getAlldata("select FuturesID as id,FuturesName as value from Futures order by FuturesID")
end;

function GetFuturesAddrs()
	if (value['FuturesID']==nil) then
		printInfo(-12, "缺少参数");
		return;
	end;
	publicMethod.getAlldata("select * from FuturesAddress where FuturesID = "..value['FuturesID'].."","没有任何地址信息记录")
end;

function GetFuturesData()
	publicMethod.getAlldata("select * from Futures order by FuturesID")
end;


function GetHostFutures()
	publicMethod.getAlldata("select distinct(f.FuturesID),f.FuturesName as value from Futures as f left join Account as a on a.FuturesID = f.FuturesID where a.AccountType=0;")
end;

function GetFollowFutures()
	publicMethod.getAlldata("select distinct(f.FuturesID),f.FuturesName as value from Futures as f left join Account as a on a.FuturesID = f.FuturesID where a.AccountType=1;")
end;

function GetConfigsData()
	publicMethod.getAlldata("select KeyName,KeyValue from Config")
end;

function Configs()
	local result = publicMethod.getOnedata_nil("select KeyValue from Config where KeyName='OpenPriceTick'")
	local OpenPriceTick = result[1]['KeyValue'];

	local result = publicMethod.getOnedata_nil("select KeyValue from Config where KeyName='ClosePriceTick'")
	local ClosePriceTick = result[1]['KeyValue'];

	local result = publicMethod.getOnedata_nil("select KeyValue from Config where KeyName='OrderLimitDelay'")
	local OrderLimitDelay = result[1]['KeyValue'];

	if (value['OpenPriceTick']~=nil) then 
		OpenPriceTick = value['OpenPriceTick']
	end

	if (value['ClosePriceTick']~=nil) then 
		ClosePriceTick = value['ClosePriceTick']
	end

	if (value['OrderLimitDelay']~=nil) then 
		OrderLimitDelay = value['OrderLimitDelay']
	end

	publicMethod.operateOnedata("update Config set KeyValue = case KeyName when 'OpenPriceTick' then '"..OpenPriceTick.."' when 'ClosePriceTick' then '"..ClosePriceTick.."' when 'OrderLimitDelay' then '"..OrderLimitDelay.."' end where KeyName in ('OpenPriceTick','OrderLimitDelay','ClosePriceTick')","更新成功")

end

function stringSplit(str, delimiter)
	if (str==nil or str=='' or delimiter==nil) then
		return nil
	end
    local result = {}
    for match in (str..delimiter):gmatch("(.-)"..delimiter) do
        table.insert(result, match)
    end
    return result
end

function delAccountData()

	if (value['AccountIDs']==nil) then
		printInfo(-12, "缺少参数");
		return;
	end;

	local ids = stringSplit(value['AccountIDs'],',')

    local nodelete = ''

	for k,v in pairs(ids) do
		local ok,result = publicMethod.operateOnedata_nil("delete from Account where AccountID = "..v.." and "..v.." not in (select HostAccountID from AccountFollow) and "..v.." not in (select FollowAccountID from AccountFollow)");
		if result['affected_rows'] == 0 then 
			local name = publicMethod.getOnedata_nil("select Account from Account where AccountID = "..v.."")
			nodelete = nodelete .. name[1]['Account'] .. ','
		end
	end
	if nodelete == '' then 
	printInfo(0, "删除成功");
	else 
	printInfo(0, "账户("..string.sub(nodelete,0,-2)..")存在关联关系,请先删除此关系");
	end 
end;

function delFuturesData()
	if (value['id']==nil) then
		printInfo(-12, "缺少参数");
		return;
	end;

	local result = publicMethod.getOnedata_nil("select * from AccountFollow where HostAccountID = (select AccountID from Account where FuturesID="..value['id'].." limit 1) or FollowAccountID = (select AccountID from Account where FuturesID="..value['id'].." limit 1)");
	local result1 = publicMethod.getOnedata_nil("select * from Account where FuturesID = "..value['id'].." and status = 0");
	if(next(result) == nil and next(result1)==nil) then
	publicMethod.operateOnedata("delete Futures.*,FuturesAddress.* from Futures left join FuturesAddress on FuturesAddress.FuturesID = Futures.FuturesID where Futures.FuturesID = "..value['id']..";","删除成功")
	else 
	printInfo(-13, "该系统下账户存在关联关系或者存在可用账户,请先删除此关系");
	end

end;

function delFuturesAddrData()
	if (value['id']==nil) then
		printInfo(-12, "缺少参数");
		return;
	end;
	publicMethod.operateOnedata("delete from FuturesAddress where id = "..value['id']..";","删除成功")
end;

function ModifyPass()
	if (value['newpassword']==nil or value['oldpassword']==nil or value['OperId'] ==nil) then
		printInfo(-12, "缺少参数");
		return;
	end;

	local result = publicMethod.getOnedata_nil("select * from Operator where OperName='"..value['OperId'].."' and OperPwd = '"..value['oldpassword'].."'");
	if (next(result) ~= nil) then
		publicMethod.operateOnedata("update Operator set OperPwd='"..value['newpassword'].."'","更新成功")
	else
		printInfo(-14, "旧密码错误");
	end
end

if (ngx.var.api_function == "GetAccountData") then
	GetAccountData();
elseif(ngx.var.api_function == "ModifyPass") then
	ModifyPass();
elseif(ngx.var.api_function == "GetFuturesData") then
	GetFuturesData();
elseif(ngx.var.api_function == "GetFuturesNames") then
	GetFuturesNames();
elseif(ngx.var.api_function == "GetFuturesAddrs") then
	GetFuturesAddrs();
elseif(ngx.var.api_function == "GetHostFutures") then
	GetHostFutures();
elseif(ngx.var.api_function == "GetFollowFutures") then
	GetFollowFutures();
elseif(ngx.var.api_function == "GetConfigsData") then
	GetConfigsData();
elseif(ngx.var.api_function == "AccountData") then
	AccountData();
elseif(ngx.var.api_function == "FuturesAddrData") then
	FuturesAddrData();
elseif(ngx.var.api_function == "FuturesData") then
	FuturesData();
elseif(ngx.var.api_function == "Configs") then
	Configs();
elseif(ngx.var.api_function == "delAccountData") then
	delAccountData();
elseif(ngx.var.api_function == "delFuturesData") then
	delFuturesData();
elseif(ngx.var.api_function == "delFuturesAddrData") then
	delFuturesAddrData();
elseif(ngx.var.api_function == "GetAccounts") then
	GetAccounts();
end;

