------
title: 关于HTTPS
date: 2016-06-02 11:22:43
tags:
  - HTTPS
categories:
  - Server
------
这是一篇关于`HTTPS`的日常使用记录，例如:博客HTTPS化~  
来吧!年轻人!~~装逼~~HTTPS时代到了
<!--more-->
### 关于https
[什么是HTTPS ?](https://en.wikipedia.org/wiki/HTTPS)
> 通俗的讲：隐私安全

### GitHub page 使用https
主要是使用 [Kloudsec](https://kloudsec.com/github-pages/new)
1. 申请账号，填入待解析的域名
2. 把`DNS解析`转到该网站提供的地址
3. 验证邮箱并填入`GitHub page IP`
4. 开启相关服务
- `PROTECTION` -> `SSL Encryption`
- `PLUGIN STORE`
[成品](https://hocg.in/)
**NOTE: 2016年09月04日 发现`Kloudsec`已经倒闭了**
现在使用的是[Cloudflare](https://www.cloudflare.com)
具体使用注册时有引导教程(`需把域名解析服务器改为cloudflare的`).

### 自己搭建的blog
免费的使用 [Startssl](https://www.startssl.com/)
[成品](https://blog.lutty.me/)

### TOMCAT 配置https环境
[ keytool 教程](
http://blog.csdn.net/small____fish/article/details/8214938)
外网回调可尝试使用[nat123](http://www.nat123.com)

### 自己VPS使用`HTTPS`
[Let's Encrypt](https://laravel-china.org/topics/2766)

:)
