local dbOpt = require("database/db_mysql")
local cjson = require("cjson")
local _M = {};

function printInfo(key, value)
	local Msg = "{\"id\":"..key..",\"msg\":\""..value.."\"}";
	ngx.say(Msg);
end;


function _M.getOnedata_nil(sqltext) 
	ngx.log(ngx.ERR,sqltext)
	local bOK, result, sqlstate = dbOpt:query(sqltext)
	if (bOK == false) then
		printInfo(-1, "系统数据库连接失败");
		return;
		end;

	return result;
end

function _M.getOnedata(sqltext,errorinfo) 

	local bOK, result, sqlstate = dbOpt:query(sqltext)
	if (bOK == false) then
		printInfo(-1, "系统数据库连接失败");
		return;
		end;
	if (next(result) == nil) then
		printInfo(-11, errorinfo);
		return nil;
	else
	    return result;	
	end 
end

function _M.getAlldata(sqltext,errorinfo) 
	ngx.log(ngx.ERR,sqltext)
	local errorinfo = errorinfo;

	if errorinfo == nil then
		errorinfo = "没有任何记录"
	end

	local bOK, result, sqlstate = dbOpt:query(sqltext)
	if (bOK == false) then
			printInfo(-1, "系统数据库连接失败");
			return;
		end;
	if (next(result) == nil) then
			printInfo(-11, errorinfo);
		  return;
	end;

	ngx.say(cjson.encode(result));
    
end

function _M.operateOnedata(sqltext,correctinfo)
	ngx.log(ngx.ERR,sqltext)

	local bOK, result, sqlstate = dbOpt:query(sqltext)
	if (bOK == false) then
		printInfo(-1, "系统数据库连接失败");
		return;
	end;

	printInfo(0, correctinfo);
    
end

function _M.operateOnedata_nil(sqltext) 
	ngx.log(ngx.ERR,sqltext)
	local bOK, result, sqlstate = dbOpt:query(sqltext)
	if (bOK == false) then
		printInfo(-1, "系统数据库连接失败");
		return;
	end;

	return bOK,result;
    
end

function _M.isTradeTime(systemname)
	local result = ''
	if systemname == nil then
	result = _M.getOnedata_nil("select apiurl from sub_system where primary_system = 1 limit 1") 
	else
	result = _M.getOnedata_nil("select apiurl from sub_system where name='"..systemname.."'limit 1") 
	end
		
	if result[1] == nil then
		printInfo(-11, "此系统尚未配置接口地址");
	    return;
	end

local url  = 'http://'..result[1]['apiurl']..'/managerapi/checkSystemTradingStatus';

    	local res = ngx.location.capture('/query_proxy',
        { 
		method = ngx.HTTP_POST,
		args = {url = url}}
        )

if(res.body == 0) then
	return false
else
	return true
end

end

return _M;