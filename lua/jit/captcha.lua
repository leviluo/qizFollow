--�пؽű�
--
--����Ӧ��Ԥ������
--����Ӧ��ʵʱ���ɣ��������ѡ��������ʽ
--

----------------------------------------------------------------------------------------------
package.path = "/usr/local/openresty/lualib/?.lua;/usr/local/openresty/lualib/captcha/?.lua;"
package.cpath = "/usr/local/openresty/lualib/?.so;/usr/local/openresty/lualib/captcha/?.so;"
----------------------------------------------------------------------------------------------

--�����������
local resty_uuid=require("resty.uuid")
math.randomseed(tonumber(resty_uuid.gennum20()))

-----------------------------------------------------------------------------------------
--
--[[ Ԥ������ ]]
--
if math.random(1,99)<tonumber(ngx.var.percent) then
        
    --��redis��Ԥ������key�����ѡ��keyid
    local kid=math.random(1,ngx.var.pregencount)
        local res = ngx.location.capture('/redisGetImg',{ args = { key = kid } })
        
    if res.status==200 then
            local parser=require("redis.parser")
                local pic=parser.parse_reply(res.body)
                ngx.header.content_type="application/octet-stream"
        
        --��header�з�������ȥredis�в��Ҽ�¼��key
                ngx.header.picgid=kid
        
        --��body�з���captcha
                ngx.say(pic)

                ngx.exit(200)
        end
end

-----------------------------------------------------------------------------------------
--
--[[ ʵʱ���� ]]
--

--���ѡ��captchaģʽX
local mode=math.random(1,ngx.var.modecount)

--����modeX.lua������captcha
local res = ngx.location.capture("/mode"..mode)
if res.status==200 then
    ngx.header.content_type="application/octet-stream"

    --��header�з�������ȥredis�в��Ҽ�¼��key
    ngx.header.picgid=res.header.picgid
        
    --��body�з���captcha
    ngx.say(res.body)

        ngx.exit(200)
end