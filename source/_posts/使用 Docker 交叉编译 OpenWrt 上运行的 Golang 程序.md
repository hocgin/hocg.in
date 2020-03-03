------
title: 使用 Docker 交叉编译 OpenWrt 上运行的 Golang 程序
date: 2017-11-23 10:17:02
tags:
  - Docker
  - OpenWrt
  - Go
categories:
  - Docker
------
\>.<
<!--more-->
## 前言
- 使用 `https://github.com/gomini/go-mips32` 对 Go 程序进行交叉编译.

## 使用 Docker 交叉编译 Go 程序
1. 拉取镜像
```bash
docker pull conoro/go-mips32:v1
```

2. 启动镜像并挂载本地目录
```bash
docker run -it -v 程序目录:/go/src conoro/go-mips32:v1 /bin/sh
cd src
# 编译
# export GOOS=linux
# export GOARCH=mips32le
go build main.go
```