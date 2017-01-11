	local cjson = require("cjson")
    local publicMethod = require("./public/publicMethod")

    function printInfo(key, value)
        local Msg = "{\"id\":"..key..",\"msg\":\""..value.."\"}";
        ngx.say(Msg);
    end;

	-- local session = require "resty.session".open()
	-- ngx.log(ngx.ERR,session.data.userid);
	local  val_token = function(token)
    --对输入数据的判空操作
    if token == '' or token == nil then
     ngx.log(ngx.ERR, 'mssing csrf token')
	printInfo(-100,"认证错误")
	return
    end
	ngx.log(ngx.ERR,token)
	ngx.log(ngx.ERR,token == '')
	ngx.log(ngx.ERR,token == nil)

    --对token的msg部分，signature签名部分进行拆分。
    local msg, sig = token:match("^(.*)%.(.*)$")
    if not (msg) then
         ngx.log(ngx.ERR, "malformed csrf token")
	printInfo(-100,"认证错误")
	return
    end
	

    --对解包后msg，按照相同的加密key:"testkey"，重新进行sha256哈希，比对signature，
    --如果不一致，说明这个token中的数据有问题，无效的token。

    if not (sig == ngx.encode_base64(ngx.md5(msg..'leviluo'))) then
         ngx.log(ngx.ERR, "invalid csrf token(bad sig)")
	     printInfo(-100,"认证错误")
		 return
    end

    --对msg进行base64解码，判断其中的key和传入的key是否一致。
    --如果不一致说明token也是无效的。
	-- ngx.log(ngx.ERR,msg)
    msg =cjson.decode(ngx.decode_base64(msg))

	if(msg.role ~= ngx.var.api_role) then
	ngx.log(ngx.ERR, "not authentication")
	printInfo(-100,"认证错误")
	return
	end

    local result = publicMethod.getOnedata_nil("select * from Operator where OperName = '"..msg.key.."' and Role = '"..msg.role.."'")
    
    -- printInfo(-100,"认证错误")

    if result[1] == nil then
        ngx.log(ngx.ERR, "尚未登陆")
        printInfo(-100,"认证错误")
		return
    end

    if ( msg.expires==nil or tonumber(msg.expires) < ngx.time()) then
         ngx.log(ngx.ERR, "csrf token expired")
	     printInfo(-100,"认证错误")
		 return
    end
    
	end

	val_token(ngx.var.http_Authorization);