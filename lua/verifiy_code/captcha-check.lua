--[[captcha check]]

----------------------------------------------------------------------------------------------
-- package.path = "/usr/local/openresty/lualib/?.lua;/usr/local/openresty/lualib/captcha/?.lua;"
-- package.cpath = "/usr/local/openresty/lualib/?.so;/usr/local/openresty/lualib/captcha/?.so;"
----------------------------------------------------------------------------------------------

--获取请求中参数
local uriargs = ngx.req.get_uri_args()

local picgid = uriargs["image"]
local ustr=string.lower(uriargs["str"])

--查找redis中key为picgid的记录
local res = ngx.location.capture('/redisGetStr',{ args = { key = picgid } })
if res.status==200 then
    local parser=require("redis.parser")
    local reply=parser.parse_reply(res.body)
    local rstr=string.lower(reply)
    
    --匹配用户输入字符串与redis中记录的字符串，一致返回True，否则返回False
	-- ngx.log(ngx.ERR,rstr)
	-- ngx.log(ngx.ERR,ustr)
    ngx.header.content_type="text/plain"
    if ustr == rstr then
		ngx.exit(200)
        ngx.say("True")
    else
		ngx.exit(201)
        ngx.say("False")
    end
    
    --匹配操作后删除redis中该key记录
    local redis = require('redis')
    local client = redis.connect('127.0.0.1', 6379)
    client:del(picgid)
end