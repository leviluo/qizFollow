local dbOpt = require("database/db_mysql")
local publicMethod = require("./public/publicMethod")
local cjson = require "cjson"

function printInfo(key, value)
	local Msg = "{\"id\":"..key..",\"msg\":\""..value.."\"}";
	ngx.say(Msg);
end;
	
ngx.req.read_body();
local value = ngx.req.get_post_args();

function AccountFollowsData()
	if (value['HostAccountID'] == nil or value['OperId'] == nil or value['Status'] == nil or value['FollowAccountID'] == nil or value['FollowDirection'] == nil or value['FollowRatio'] == nil) then
		printInfo(-12, "缺少参数");
		return;
	end;

	if value['id'] == nil then 
		value['id'] = 0;
	end

	local result = publicMethod.getOnedata_nil("select * from AccountFollow where HostAccountID = '"..value['HostAccountID'].."' and FollowAccountID = '"..value['FollowAccountID'].."' and id != "..value['id'].."");
	if (next(result) == nil) then
		if value['operateType'] == 'ADD' then
		local bOK,result = publicMethod.operateOnedata_nil("insert into AccountFollow(`HostAccountID`,`Status`,`FollowAccountID`,`FollowDirection`,`FollowRatio`,`updatetime`,`OperID`,`Remark`) values("..value['HostAccountID']..",'"..value['Status'].."',"..value['FollowAccountID']..",'"..value['FollowDirection'].."','"..value['FollowRatio'].."',now(),(select OperID from Operator where OperName='"..value['OperId'].."'),'"..value['Remark'].."')")
		if bOK == true then 
			local result = publicMethod.getOnedata_nil("select * from AccountFollow where HostAccountID="..value['HostAccountID'].." and FollowAccountID="..value['FollowAccountID']..";")
			local groups = stringSplit(value['groups'],',')
			local str = ''
			ngx.log(ngx.ERR,result[1]['id'])
			for k,v in pairs(groups) do
				str = str.."("..v..","..result[1]['id'].."),"
			end
			publicMethod.operateOnedata("insert into RelationGroupMember(`GroupID`,`followid`) values "..string.sub(str,0,-2)..";","添加成功")
		end

		elseif value['operateType'] == 'MODIFY' then
		publicMethod.operateOnedata("update AccountFollow set HostAccountID="..value['HostAccountID']..",Status='"..value['Status'].."',FollowAccountID="..value['FollowAccountID']..",FollowDirection='"..value['FollowDirection'].."',FollowRatio='"..value['FollowRatio'].."',Remark='"..value['Remark'].."',updatetime=now(),OperId=(select OperID from Operator where OperName='"..value['OperId'].."') where id = "..value['id']..";","修改成功")
		end
	else
	printInfo(-11, "关系重复");
	end;
end

function GetAccountFollows()
	publicMethod.getAlldata("select af.id,(select count(*) from FollowFilter where FollowFilter.followid = af.id) as FilterNumber,(select count(*) from FollowConvert where FollowConvert.followid = af.id) as ConvertNumber,af.Status,af.FollowDirection,af.FollowRatio,af.updatetime,af.Remark,ahost.Account as HostAccount,ahost.AccountID as HostAccountID,ahost.accountName as hostaccountName,fhost.FuturesName as HostFuturesName,afollow.Account,afollow.AccountID as FollowAccountID,afollow.Account as FollowAccount,afollow.accountName as FollowaccountName,ffollow.FuturesName as FollowFuturesName,o.OperName from AccountFollow as af left join Operator as o on o.OperID = af.OperID left join Account as ahost on ahost.AccountID = af.HostAccountID left join Account as afollow on afollow.AccountID = af.FollowAccountID left join Futures as fhost on fhost.FuturesID = ahost.FuturesID left join Futures as ffollow on ffollow.FuturesID = afollow.FuturesID order by af.id;")
end;

function delAccountFollowData()
	if (value['id']==nil) then
		printInfo(-12, "缺少参数");
		return;
	end;
	publicMethod.operateOnedata("delete from AccountFollow where id = "..value['id']..";","删除成功")
end;

function getContractFilter()
	publicMethod.getAlldata("select contractid from followfilter where followid = "..value['followid']..";")
end

function modifyContractFilter()
	-- ngx.log(ngx.ERR,value['items'])
	local result = stringSplit(value['items'],',')
	local str = ''
	for k,v in pairs(result) do
		-- ngx.log(ngx.ERR,v)
		str = str.."('"..v.."',"..value['followid'].."),"
	end
	-- ngx.log(ngx.ERR,string.sub(str,0,-2))
	publicMethod.operateOnedata_nil("delete from followfilter where followid = "..value['followid']..";")
	publicMethod.operateOnedata("insert into followfilter(`contractid`,`followid`) values "..string.sub(str,0,-2)..";","修改成功")
end

function modifyContractConvert()
	local data = cjson.decode(value['items']);
	publicMethod.operateOnedata_nil("delete from FollowConvert where followid = "..value['followid']..";")
	local str = ''
	for k,v in pairs(data) do
		str = str.."('"..v['contractHost'].."','"..v['contractFollow'].."','"..v['FollowDirection'].."',"..v['ratio']..","..value['followid'].."),"
	end
	publicMethod.operateOnedata("insert into FollowConvert(`contractHost`,`contractFollow`,`FollowDirection`,`ratio`,`followid`) values "..string.sub(str,0,-2)..";","修改成功")
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

function getContractConvert()
	publicMethod.getAlldata("select contractFollow,FollowDirection,ratio,contractHost from followconvert where followid = "..value['followid']..";")
end

if(ngx.var.api_function == "GetAccountFollows") then
	GetAccountFollows();
elseif(ngx.var.api_function == "AccountFollowsData") then
	AccountFollowsData();
elseif(ngx.var.api_function == "delAccountFollowData") then
	delAccountFollowData();
elseif(ngx.var.api_function == "getContractFilter") then
	getContractFilter();
elseif(ngx.var.api_function == "modifyContractFilter") then
	modifyContractFilter();
elseif(ngx.var.api_function == "getContractConvert") then
	 getContractConvert();
elseif(ngx.var.api_function == "modifyContractConvert") then
	 modifyContractConvert();
end;

