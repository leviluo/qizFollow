--静态图片

------------------------------------------------------------------------------------------------
-- package.path = "/usr/local/openresty/lualib/?.lua;/usr/local/openresty/lualib/captcha/?.lua;"
-- package.cpath = "/usr/local/openresty/lualib/?.so;/usr/local/openresty/lualib/captcha/?.so;"
------------------------------------------------------------------------------------------------

--Redis中插入记录方法
-- function setRedis(skey, sval)
        -- local res = ngx.location.capture('/redisSetQueue', {args= {key=skey,val=sval}})
        -- if res.status == 200 then
                -- return true
        -- else
                -- return false
        -- end
-- end

--设置随机种子
-- local resty_uuid=require("resty.uuid")
math.randomseed(os.time())

--在32个备选字符中随机筛选4个作为captcha字符串
local dict={'A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z','2','3','4','5','6','7','8','9'}
local stringmark=""
for i=1,4 do
       stringmark=stringmark..dict[math.random(1,32)]
end

--图片基本info
--picgid
-- local filename= "1"..resty_uuid.gen20()..".png"
-- local filename= "1"..uuid.gen20()..".png"
-- local filename= "1"..resty_uuid.gen32()..".png"
--图片78x26
-- local xsize = 98
-- local ysize = 36
local xsize = 78
local ysize = 26
--字体大小
local wsize = 17.5
--干扰线(yes/no)
local line = "yes"

--加载模块
local gd=require('gd')

--创建面板
local im = gd.createTrueColor(xsize, ysize)
--定义颜色
local black = im:colorAllocate(0, 0, 0)
local grey = im:colorAllocate(202,202,202)
local color={}
for c=1,100 do
        color[c] = im:colorAllocate(math.random(100),math.random(100),math.random(100))
end
--画背景
x, y = im:sizeXY()
im:filledRectangle(0, 0, x, y, grey)
	
--画字符
gd.useFontConfig(true)
for i=1,4 do
    k=(i-1)*16+3
    im:stringFT(color[math.random(100)],"arial",wsize,math.rad(math.random(-10,10)),k,22,string.sub(stringmark,i,i))
end
--干扰线点
if line=="yes" then
    for j=1,math.random(10) do
        im:line(math.random(xsize),math.random(ysize),math.random(xsize),math.random(ysize),color[math.random(100)])
    end
    for p=1,50 do
            im:setPixel(math.random(xsize),math.random(ysize),color[math.random(100)])
    end
end
--流输出
local fp=im:pngStr(75)

--redis中添加picgid为key,string为value的记录
-- setRedis(filename,stringmark)

--response header中传参picgid
ngx.header.content_type="text/plain"
ngx.header.stringmark=stringmark

--页面返回pic
ngx.say(fp)

--nginx退出
ngx.exit(200)