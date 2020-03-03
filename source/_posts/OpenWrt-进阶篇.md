------
title: OpenWrt 入门篇
date: 2017-05-31 14:52:26
tags:
  - Tips
  - OpenWrt
categories:
  - OpenWrt
------
## Tips
### 查看路由器支持架构
```shell
opkg print-architecture | awk '{print $2}'
```
### 如何更改时区?
```shell
# 查看当前的时区
date -R
# Wed, 31 May 2017 07:07:28 +0000

# 修改时区
vi /etc/config/system
# 进行修改
# config system
#        option hostname 'Openwrt'
#        option timezone 'CST-8'
#        option zonename 'Asia/Shanghai'
# 重启
reboot
# 查看是否成功
date -R
# Wed, 31 May 2017 15:08:01 +0800

# 同步系统时间
ntpd -n -q -p 0.asia.pool.ntp.org

```
### 如何在 OpenWrt 上搭建 PHP 环境?
```shell
# 更新索引
opkg update
# 安装必须的环境
opkg install php5 php5-mod-gd php5-mod-curl php5-mod-session php5-mod-pdo php5-mod-mcrypt php5-mod-mbstring php5-fastcgi php5-cgi php5-mod-ctype php5-mod-exif php5-mod-iconv php5-mod-json php5-mod-sockets php5-mod-sqlite3 php5-mod-tokenizer php5-mod-zip
# 配置文件目录
# /etc/httpd.conf
# 重启http服务
/etc/init.d/uhttpd restart
```
