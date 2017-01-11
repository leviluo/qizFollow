-- local dbOpt = require("database/db_mysql")
local cjson = require("cjson")

local publicMethod = require("./public/publicMethod")

function printInfo(key, value)
	local Msg = "{\"id\":"..key..",\"msg\":\""..value.."\"}";
	ngx.say(Msg);
end;

ngx.req.read_body();
local value = ngx.req.get_post_args();

function gen_token(key,expires,role)
    if expires == nil then
     expires = ngx.time() + 18000;
    end

    local msg = ngx.encode_base64(
     cjson.encode({
         key = key,
		 role=role,
         expires = expires
     }))

    local signature = ngx.encode_base64(ngx.md5(msg..'leviluo'))

    return msg .. "." ..signature
end

function getLogin()

	if (value["operid"] == nil or value["password"] == nil) then
		printInfo(-12, "缺少参数");
		return;
	end;

	local operid = value["operid"];
	local password = value["password"];

	local result = publicMethod.getOnedata_nil("select * from Operator where OperName='"..operid.."' and OperPwd ='"..password.."';")

	local row = result[1];

	if (row == nil) then
		printInfo(-13, "用户名不存在或密码错误");
		return;
	end;

	expires = ngx.time() + 18000;
	
	local role = "";
	if (row["Role"] == 0) then
	role = "admin";
	else 
	role = "operator";
	end;

	token = gen_token(operid,expires,role);

	-- ngx.header["Set-Cookie"] = {"userid="..operid..";path=/;expires="..expires..""};
	local str= "{\"id\":\"0\",\"role\":\""..role.."\",\"token\":\""..token.."\"}";
	ngx.say(str);
end;


if (ngx.var.api_function == "getLogin") then
	getLogin();
elseif (ngx.var.api_function == "register") then
	register();
end

