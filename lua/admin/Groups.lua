local dbOpt = require("database/db_mysql")
local publicMethod = require("./public/publicMethod")
local cjson = require "cjson"

function printInfo(key, value)
	local Msg = "{\"id\":"..key..",\"msg\":\""..value.."\"}";
	ngx.say(Msg);
end;
	
ngx.req.read_body();
local value = ngx.req.get_post_args();


function modifyGroups()
	local result = publicMethod.getOnedata_nil("select * from relationgroup where name = '"..value['name'].."'")
	if (next(result) == nil) then
		publicMethod.operateOnedata("update relationgroup set name='"..value['name'].."' where id="..value['id'].."","修改成功")
	else 
		printInfo(-1,"组名重复")
	end
end

function addGroups()
	local result = publicMethod.getOnedata_nil("select * from relationgroup where name = '"..value['name'].."'")
	if (next(result) == nil) then
		publicMethod.operateOnedata("insert into relationgroup(`name`) values('"..value['name'].."')","添加成功")
	else 
		printInfo(-1,"组名重复")
	end
end

function addNewRelations()
	local result = stringSplit(value['ids'],',')
	local str = ''
	for k,v in pairs(result) do
		-- ngx.log(ngx.ERR,v)
		str = str.."('"..v.."',"..value['groupid'].."),"
	end
	publicMethod.operateOnedata("insert into RelationGroupMember(`followid`,`GroupID`) values "..string.sub(str,0,-2)..";","添加成功")
end

function deleteGroupRelations()
	publicMethod.operateOnedata("delete from RelationGroupMember where find_in_set(id,'"..value['ids'].."') > 0","删除成功")
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

function deleteGroups()
	local result = publicMethod.getOnedata_nil("select * from RelationGroupMember where find_in_set(GroupID,'"..value['id'].."') > 0")
	if (next(result) == nil) then
		publicMethod.operateOnedata("delete from relationgroup where find_in_set(id,'"..value['id'].."') > 0","删除成功")
	else 
		printInfo(-1,"删除组之前,请先删除下属组关系")
	end
end

function GroupRelationsData()
		local str = ''
	if(value['GroupName'] ~= nil) then 
		str = "r.GroupID = "..value['GroupName'].." and "
	end
	if(value['HostAccount'] ~= nil) then 
		str = str.."af.HostAccountID = "..value['HostAccount'].." and "
	end
	if(value['FollowAccount'] ~= nil) then 
		str = str.."af.FollowAccountID = "..value['FollowAccount'].." and "
	end

	if str ~= '' then 
		str = ' where '..str
	end
	publicMethod.getAlldata("select r.id,g.name,af.status,af.FollowDirection,af.FollowRatio,ah.Account as HostAccount,fh.FuturesName as HostFuturesName,afollow.Account as FollowAccount,ff.FuturesName as FollowFuturesName from RelationGroupMember as r left join RelationGroup as g on g.id =r.GroupID left join AccountFollow as af on af.id =r.followid left join Account as ah on ah.AccountID = af.HostAccountID left join Futures as fh on fh.FuturesID = ah.FuturesID left join Account as afollow on afollow.AccountID = af.FollowAccountID left join Futures as ff on ff.FuturesID = afollow.FuturesID"..string.sub(str,0,-5)..";")

end

if(ngx.var.api_function == "GroupsData") then
	publicMethod.getAlldata("select * from relationgroup")
elseif(ngx.var.api_function == "modifyGroups") then
	modifyGroups();
elseif(ngx.var.api_function == "addGroups") then
	addGroups()
elseif(ngx.var.api_function == "deleteGroups")then
	deleteGroups()
elseif(ngx.var.api_function == "GroupRelationsData")then
	GroupRelationsData()
elseif(ngx.var.api_function == "addNewRelations")then
	addNewRelations()
elseif(ngx.var.api_function == "deleteGroupRelations")then
	deleteGroupRelations()
elseif(ngx.var.api_function == "GetAccountFollowsGroupAviable")then
	publicMethod.getAlldata("select ah.Account as HostAccount,af.id,afollow.Account as FollowAccount from AccountFollow as af left join Account as ah on ah.AccountID = af.HostAccountID left join Account as afollow on afollow.AccountID = af.FollowAccountID where af.id not in (select followid from RelationGroupMember where GroupID = "..value['groupid']..")")
elseif(ngx.var.api_function == "setStatus")then 
	publicMethod.operateOnedata("update AccountFollow set Status = '"..value['status'].."' where id in (select followid from RelationGroupMember where GroupID = "..value['groupid']..")","设置成功")
elseif(ngx.var.api_function == "setfollowdirections")then 
	publicMethod.operateOnedata("update AccountFollow set FollowDirection = '"..value['followdirections'].."' where id in (select followid from RelationGroupMember where GroupID = "..value['groupid']..")","设置成功")
elseif(ngx.var.api_function == "setRatio")then 
	publicMethod.operateOnedata("update AccountFollow set FollowRatio = '"..value['ratio'].."' where id in (select followid from RelationGroupMember where GroupID = "..value['groupid']..")","设置成功")
elseif(ngx.var.api_function == "setContractFilter")then 

	local followids = publicMethod.getOnedata_nil("select followid from RelationGroupMember where GroupID = "..value['groupid']..";")
	if followids[1] == nil then 
		printInfo(-1,"操作无效，此组下无跟单关系")
		return
	end

	local bOK,deletes = publicMethod.operateOnedata_nil("delete from followfilter where followid in (select followid from RelationGroupMember where GroupID = "..value['groupid']..");")

	local result = '';
	if(value['items'] == '') then
		if bOK == true then 
			printInfo(0,"修改成功")
		end
		return;
	else 
		result = stringSplit(value['items'],',')
	end
	
	local str = ''
	for k,v in pairs(result) do
		for kk,vv in pairs(followids) do
			str = str.."('"..v.."',"..vv['followid'].."),"
		end
	end
	if bOK == true then 
		publicMethod.operateOnedata("insert into followfilter(`contractid`,`followid`) values "..string.sub(str,0,-2)..";","修改成功")
	end
elseif(ngx.var.api_function == "setContractConvert")then
	local followids = publicMethod.getOnedata_nil("select followid from RelationGroupMember where GroupID = "..value['groupid']..";")
	if followids[1] == nil then 
		printInfo(-1,"操作无效，此组下无跟单关系")
		return
	end
	local bOK,deletes = publicMethod.operateOnedata_nil("delete from FollowConvert where followid in (select followid from RelationGroupMember where GroupID = "..value['groupid']..");")
	local data = cjson.decode(value['items']);
	
		local str = ''
	if(data[1] == nil) then
		if bOK == true then 
			printInfo(0,"修改成功")
		end
		return;
	else 
		for k,v in pairs(data) do
			for kk,vv in pairs(followids) do
				str = str.."('"..v['contractHost'].."','"..v['contractFollow'].."','"..v['FollowDirection'].."',"..v['ratio']..","..vv['followid'].."),"
			end
		end
	end
	if bOK == true then 
		publicMethod.operateOnedata("insert into FollowConvert(`contractHost`,`contractFollow`,`FollowDirection`,`ratio`,`followid`) values "..string.sub(str,0,-2)..";","修改成功")
	end
end;


