------
title: Ngrok使用指南
date: 2016-08-31 07:15:24
tags:
  - Ngrok
  - Tip
categories:
  - Server
------
Ngrok 是一款内部端口转发，对于微信类似的开发很有用的😆  
可参照墙内(花生壳 or nat123)
<!--more-->
## 概述
**编译环境:**
[Go 1.4.1 强烈建议](https://storage.googleapis.com/golang/go1.4.1.linux-amd64.tar.gz)  
根域名: `web.hocg.in`,即生成的域名为`*.web.hocg.in`
文件结构:
ngrok
  ├── bin
  │   └── ngrok.cfg
  ├── client.sh
  ├── code.sh
  └── server.sh
**部署环境:**
服务器OS: Ubuntu-15
客户端OS: Ubuntu-16


## 安装
### 环境依赖及源码下载
> 以下命令根目录统一在`/opt`

```shell
# 环境依赖
sudo apt-get install build-essential golang mercurial git
# 获取 ngrok 源码
git clone https://github.com/tutumcloud/ngrok.git ngrok
cd ngrok
```
### 生成证书 && 编译
> 以下命令根目录统一在`/opt/ngrok`

`code.sh`文件
> 生成证书 && 编译服务端
> `DOMAIN` 为配置的`根域名`, 用于签名.

```shell
#!/bin/bash
echo "开始清除.."
rm -rf assets/client/tls/ngrokroot.crt
rm -rf assets/server/tls/snakeoil.crt
rm -rf assets/server/tls/snakeoil.key
rm -rf device.*
rm -rf rootCA.*
DOMAIN=web.hocg.in
echo "设置域名为[*.$DOMAIN]"
echo "开始生成秘钥.."
openssl genrsa -out rootCA.key 2048
openssl req -x509 -new -nodes -key rootCA.key -subj "/CN=$DOMAIN" -days 5000 -out rootCA.pem
openssl genrsa -out device.key 2048
openssl req -new -key device.key -subj "/CN=$DOMAIN" -out device.csr
openssl x509 -req -in device.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out device.crt -days 5000

echo "开始迁移秘钥.."
cp -rf rootCA.pem assets/client/tls/ngrokroot.crt
cp -rf device.crt assets/server/tls/snakeoil.crt
cp -rf device.key assets/server/tls/snakeoil.key

echo "开始编译.."
make release-server
```
**客户端**
> 前置条件: Go需先增加对这些平台交叉编译的支持

- Windows  
go的`src`目录  
```shell
GOOS=windows GOARCH=amd64 ./make.bash
```
`nginx`目录,编译
```shell
GOOS=windows GOARCH=amd64 make release-client
```

- macOS  
go的`src`目录  
```shell
GOOS=darwin GOARCH=amd64 ./make.bash
```
`nginx`目录,编译
```shell
GOOS=darwin GOARCH=amd64 make release-client
```

- Linux
`nginx`目录,编译
```shell
make release-client
```


### 配置文件
`ngrok.cfg`文件
> `server_addr` 为配置的`根域名`， `4443`为默认端口

```shell
server_addr: web.hocg.in:4443
trust_host_root_certs: false
```
### 运行文件
`server.sh`文件
> 服务器运行
> `DOMAIN` 为配置的`根域名`.
> 注释的那一句用于后台运行

```shell
#!/bin/bash
# $1 HTTP
# $2 HTTPS
killall ngrokd
DOMAIN=web.hocg.in
# nohup ./bin/ngrokd -domain="$DOMAIN" -httpAddr=":$1" -httpsAddr=":$2" >/tmp/ngrok.log 2>&1 &
./bin/ngrokd -domain="$DOMAIN" -httpAddr=":$1" -httpsAddr=":$2"
```
`client.sh`文件
> 客户端运行, default:linux
> 具体环境修改具体内容

```shell
#!/bin/bash
# $1 Port
# $2 domain
./bin/ngrok -subdomain $2 -proto=http -config=./bin/ngrok.cfg $1
```
## 使用
> 若需变更域名, 需修改`code.sh`的`DOMAIN`、`server.sh`的`DOMAIN`与`./bin/ngrok.cfg`的`server_addr`
### 编译
```shell
sh code.sh
```
> **成功** 检查`ngrok/bin`文件夹是否存在`ngrok` and `ngrokd`

### 服务端
```shell
sh server.sh 8888 9999
```
### 客户端
```shell
sh client.sh 8080 dm
```
### 检验
访问:`http://dm.web.hocg.in:8888`
![image](https://hocg.in/i/Ngrok使用指南.png)
## 重要
### 关于域名解析
eg. `*.web.hocg.in`
路径解析需配置`*.web` and `web` 两个A记录
### 关于签名
最好在同一环境进行`服务端`和`客户端`的编译


## 小技巧
- 如何让服务端的`ngrok`后台运行
> 正常的`nohup`或`&`是无法使`ngrok`后台运行的
> 需使用`screen`
```shell
# 安装
\# apt-get install screen
# 使用
screen -S [命名] [需放入后台的命令]
# 使用 ctrl+A+D 让其运行在后台
# 查看screen 后台进程
screen -ls
# 重新连接后台进程
screen -r [进程id]

```


## 可能遇到的异常
- Go-1.2.1语言版本不支持`go version`
```shell
# github.com/gorilla/websocket
src/github.com/gorilla/websocket/client.go:361: unknown tls.Config field 'GetCertificate' in struct literal
src/github.com/gorilla/websocket/client.go:370: unknown tls.Config field 'ClientSessionCache' in struct literal
src/github.com/gorilla/websocket/client.go:373: unknown tls.Config field 'CurvePreferences' in struct literal
make: *** [client] Error 2
```
[官方Go-64的安装](https://golang.org/doc/install?download=go1.7.linux-amd64.tar.gz)

- Go编译器找不到`go-bindata`
```shell
GOOS="" GOARCH="" go get github.com/jteeuwen/go-bindata/go-bindata
/bin/sh: 1: go: not found
make: *** [bin/go-bindata] Error 127
```
1. 请注意配置好`GOROOT`和`GOPATH`
> `GOROOT`为安装GO的目录
> `GOPATH`自定义一个GO插件下载目录

2. 执行以下shell下载插件
```shell
go get -u github.com/jteeuwen/go-bindata/...
```
END:)
