------
title: Redis 相关
date: 2016-10-20 09:11:48
tags:
  - Redis
  - Tips
categories:
  - Server
------
  Redis 的部署和部位设计的实践, 还有常见问题的梳理! 💪
<!--more-->
## 前言
[官网](http://redis.io/download)

## 详情
### 默认项
- 端口 `6379`

### 目录结构
redis-3.2.4/
|-- redis.conf `redis配置文件`
`-- src	`编译后目录`
    |-- redis-server `启动bit文件`
    `-- redis-cli `终端bit文件`

## 安装
> 以下操作均在`/opt`
```shell
# 下载
wget http://download.redis.io/releases/redis-3.2.4.tar.gz
# 解压
tar -zxvf redis-3.2.4.tar.gz
cd redis-3.2.4
# 编译， 生成`src`目录
make
```

## 指令
> 以下操作均在`/opt`
```shell
# 默认配置运行
./redis-3.2.4/src/redis-server
# 指定配置文件运行
./redis-3.2.4/src/redis-server [config file]

```

## 疑问？
- 如何使`redis`后台运行?
> 更改配置文件, 找到`daemonize`字段,更改`no`为`yes`, 重启`redis` **切记！要指定配置文件**

- 如何更改`redis`默认`6379`端口?
> 更改配置文件, 找到`port`字段,更改为指定端口, 重启`redis` **切记！要指定配置文件**

- 如何设置`redis`的验证密码?
> 更改配置文件, 找到`requirepass`字段, 设置相应的验证密码, 重启`redis` **切记！要指定配置文件**
> 由于增加了验证密码，因此客户端连接命令为`redis-cli –a [upassword]`
