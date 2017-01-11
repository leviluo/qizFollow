--中控脚本
--
--部分应用预先生成
--部分应用实时生成，并且随机选择生成样式
--

----------------------------------------------------------------------------------------------
package.path = "/usr/local/openresty/lualib/?.lua;/usr/local/openresty/lualib/captcha/?.lua;"
package.cpath = "/usr/local/openresty/lualib/?.so;/usr/local/openresty/lualib/captcha/?.so;"
----------------------------------------------------------------------------------------------

--设置随机种子
local resty_uuid=require("resty.uuid")
math.randomseed(tonumber(resty_uuid.gennum20()))

-----------------------------------------------------------------------------------------
--
--[[ 预先生成 ]]
--
if math.random(1,99)<tonumber(ngx.var.percent) then
        
    --在redis的预先生成key中随机选择keyid
    local kid=math.random(1,ngx.var.pregencount)
        local res = ngx.location.capture('/redisGetImg',{ args = { key = kid } })
        
    if res.status==200 then
            local parser=require("redis.parser")
                local pic=parser.parse_reply(res.body)
                ngx.header.content_type="application/octet-stream"
        
        --在header中返回用于去redis中查找记录的key
                ngx.header.picgid=kid
        
        --在body中返回captcha
                ngx.say(pic)

                ngx.exit(200)
        end
end

-----------------------------------------------------------------------------------------
--
--[[ 实时生成 ]]
--

--随机选择captcha模式X
local mode=math.random(1,ngx.var.modecount)

--调用modeX.lua，生成captcha
local res = ngx.location.capture("/mode"..mode)
if res.status==200 then
    ngx.header.content_type="application/octet-stream"

    --在header中返回用于去redis中查找记录的key
    ngx.header.picgid=res.header.picgid
        
    --在body中返回captcha
    ngx.say(res.body)

        ngx.exit(200)
end