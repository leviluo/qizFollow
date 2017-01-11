
local config = require "config"
local mysql = require "resty.mysql"

local db_mysql = {}

--[[
    先从连接池取连接,如果没有再建立连接.
    返回:
        false,出错信息.
        true,数据库连接
--]]
function db_mysql:get_connect()
    if ngx.ctx[db_mysql] then
        return true, ngx.ctx[db_mysql]
    end

    local client, errmsg = mysql:new();
    if not client then
        return false, "mysql.socket_failed: " .. (errmsg or "nil")
    end

	client:set_timeout(1000)
	local ok, err, errno, sqlStatus = client:connect{
		host = config.db_host,
		port = config.db_port,
		database = config.db_database,
		user = config.db_user,
		password = config.db_password,
		max_packet_size = config.db_max_packet_size}

    if not ok then
        return false, "mysql.cant connect: " .. (errmsg or "nil") .. ", errno:" .. (errno or "nil") ..
                ", sql_state:" .. (sqlstate or "nil")
    end
--[[
    local query = "SET NAMES " .. dbConfig.DEFAULT_CHARSET
    local result, errmsg, errno, sqlstate = client:query(query)
    if not result then
        return false, "mysql.query_failed: " .. (errmsg or "nil") .. ", errno:" .. (errno or "nil") ..
                ", sql_state:" .. (sqlstate or "nil")
    end
 --]]
    ngx.ctx[db_mysql] = client;
    return true, ngx.ctx[db_mysql];
end

--[[
    把连接返回到连接池
    用set_keepalive代替close() 将开启连接池特性,可以为每个nginx工作进程，指定连接最大空闲时间，和连接池最大连接数
 --]]
function db_mysql:close()
    if ngx.ctx[db_mysql] then
        ngx.ctx[db_mysql]:set_keepalive(60000, 1000)
        ngx.ctx[db_mysql] = nil
    end
end

--[[
    查询
    有结果数据集时返回结果数据集
    无数据数据集时返回查询影响
    返回:
        false,出错信息,sqlstate结构.
        true,结果集,sqlstate结构.
--]]
function db_mysql:query(sql)
    local ret, client = self:get_connect()
    if not ret then
        return false, client, nil
    end
    
    local result, errmsg, errno, sqlstate = client:query(sql)

    if not result then
        errmsg = "mysql.query_failed:"..errno.."msg: "..errmsg.."state: "..sqlstate;
        return false, errmsg, sqlstate
    end

    return true, result, sqlstate
end

return db_mysql