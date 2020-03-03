------
title: Nginx 部署
date: 2017-02-24 09:12:22
tags:
  - Ubuntu
categories:
  - Server
------
🎽  [Nginx](http://baike.baidu.com/link?url=6LDqhy3I7UWDkwOT6TS_s-d4Jsv9AVcA_yedSmd618s1BjJl-0NQ-roxjDF7jHazXWlTwbIHTv03_gWIWeRPUq) 是一个很强大的高性能Web和反向代理服务器
<!--more-->

## 前言
### 环境
OS: Ubuntu-16

## 安装
### 依赖
- [PCRE](http://www.pcre.org/)
- [zlib](http://zlib.net)
- [nginx](nginx.org/en/download.html)

### 目录结构
/opt
|-- nginx-1.10.1
|-- pcre-8.38
\`-- zlib-1.2.8

### shell
> 以下操作均在`/opt`目录

```shell
# tar -zxvf nginx-1.10.1.tar.gz
# cd nginx-1.10.1
# ./configure
```
ERROR:
```shell
checking for OS
 + Linux 2.6.32-042stab113.21 x86_64
checking for C compiler ... not found

./configure: error: C compiler cc is not found
```
缺失编译部件, 解决办法如下:
```shell
# apt-get install build-essential libtool
# ./configure
```
Error:
```shell
./configure: error: the HTTP rewrite module requires the PCRE library.
You can either disable the module by using --without-http_rewrite_module
option, or install the PCRE library into the system, or build the PCRE library
statically from the source with nginx by using --with-pcre=<path> option.
```
缺失`PCRE`, 移步官网下载(`顶部有链接`), 我是在`/opt`目录中解压
**注**: pcre 没有 `2`
> 以下操作均在`/opt`目录  


```shell
# tar -jxvf pcre-8.38.tar.bz2
# cd pcre-8.38
# ./configure && make && make install
```

回到`/opt/nginx-1.10.1`目录继续进行
```shell
# ./configure --with-pcre=/opt/pcre-8.38
```
Error:
```shell
./configure: error: the HTTP gzip module requires the zlib library.
You can either disable the module by using --without-http_gzip_module
option, or install the zlib library into the system, or build the zlib library
statically from the source with nginx by using --with-zlib=<path> option.
```
原因是缺失`zlib`,移步官网下载(`顶部有链接`), 同样是在`/opt`目录中解压
> 以下操作均在`/opt`目录  

```shell
# tar -zxvf zlib-1.2.8.tar.gz
# cd zlib-1.2.8
# ./configure && make && make install
```
回到`/opt/nginx-1.10.1`目录继续进行

```shell
# ./configure --with-pcre=/opt/pcre-8.38 --with-zlib=/opt/zlib-1.2.8
# make
# make install
```
至此，安装结束。可查看`ls /usr/local/nginx/`目录
显示如下文件:
/usr/local/nginx/  
![image](http://cdn.hocgin.top/E3B25E4D-8D26-4E4D-BBA2-F77F7B089FA5.png)

## 基础命令
> 以下命令均在`/usr/local/nginx`目录下运行  

```shell
# 启动
./sbin/nginx
# 检查配置
./sbin/nginx -t
# 重新加载配置
./sbin/nginx -s reload
# 查看配置文件
cat ./conf/nginx.conf
```

## 扩展
### `nginx.conf`配置
[字段详解](http://blog.csdn.net/tjcyjd/article/details/50695922)

### 模块
**待续ing**
