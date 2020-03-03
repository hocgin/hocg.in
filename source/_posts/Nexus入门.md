------
title: Nexus 入门
date: 2016-08-24 19:03:01
tags:
  - Nexus
  - Tips
categories:
  - Server
------
适合`nexus`入门，不是手机，不是手机，不是手机　．．ｏ（╯□╰）ｏ
<!--more-->
## 环境
- Ubuntu-14.04.1
- jdk1.8.0_102
- [nexus-2.12.0-01](https://sonatype-download.global.ssl.fastly.net/nexus/oss/nexus-2.12.0-01-bundle.tar.gz)|[官网](http://www.sonatype.org/nexus/)
- 域名:`nexus.hocg.in`

## 前置条件
- 安装完jdk并配置好环境变量 `eg: java查看是否成功`

## 安装
**温馨提示:** 以下操作都是在`/opt`目录下
### 下载&解压
```shell
# 下载
wget https://sonatype-download.global.ssl.fastly.net/nexus/oss/nexus-2.12.0-01-bundle.tar.gz
# 解压
tar -zxvf nexus-2.12.0-01-bundle.tar.gz
# 清理
rm -rf *.gz
```
### 文件/目录详解
- `nexus-2.12.0-01` 程序目录
- `sonatype-work` 仓库目录(内包含仓库配置及jar包仓库)


### 基本操作
```shell
./nexus-2.12.0-01/bin/nexus { console | start | stop | restart | status | dump }
```
`访问 http://nexus.hocg.in:8081/nexus`
> 默认账号:admin 默认密码: admin123

## 如何使用
### Maven 中配置仓库
```xml
<repositories>
      <repository>
          <id>Nexus</id>
          <name>Nexus</name>
          <url>http://nexus.hocg.in:8081/nexus/content/groups/public/</url>
      </repository>
  </repositories>
```

## 问题
### 如何修改默认`8081`端口
```shell
vim /opt/nexus-2.12.0-01/conf/nexus.properties
# 修改application-port=8081项
```
### 如何创建用户
登陆系统后，左侧`Security > Users`中创建

### 如何使用`构建账号`
修改`Settings.xml`文件 (**Maven**)
```
<servers>
	<server>
		<id>nexus.hocg.in</id>
		<username>admin</username>
		<password>admin123</password>
	</server>
</servers>
```
### 如何修改用户密码

登陆系统后，顶部`点击用户名 > Profile`中修改
### 如何建立与中央仓库的索引
![image](https://hocg.in/i/如何建立与中央仓库的索引.png)
>**Note:** Nexus会自动建立任务计划,一般远程仓库都比较大，构建会比较多，因此索引文件会很大，请确保磁盘大小充足.


## 可能出现的报错
- **1** WARNING - NOT RECOMMENDED TO RUN AS ROOT , 原因是提醒你是否确认用`root`用户运行
```shell
\# ./nexus-2.12.0-01/bin/nexus restart
****************************************
WARNING - NOT RECOMMENDED TO RUN AS ROOT
****************************************
Stopping Nexus OSS...
Nexus OSS was not running.
Starting Nexus OSS...
Started Nexus OSS.
```
解决:
```shell
vim ./nexus-2.12.0-01/bin/nexus
# 加入系统变量
vi /etc/profile
# 加入export RUN_AS_USER=root
# 修改
RUN_AS_USER=root
# 启动
./nexus-2.12.0-01/bin/nexus start
# 查看是否启动成功
./nexus-2.12.0-01/bin/nexus status
# 稍等几分钟再访问

```
