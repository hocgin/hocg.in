------
title: 使用Maven下载jar包 linux版
date: 2016-04-25 09:38:49
tags:
  - Maven
  - Shell
  - Tips
categories:
  - Coder
------
这只是学习Shell的小脚本, 练手工具罢了.. 折腾!折腾啊
<!--more-->

## 目录结构
```shell
Green4nodeJS
├── down.sh // 下载shell，o(╯□╰)o其实就是一条shell
└── pom.xml // 正常maven配置
```
## 文件内容
`down.sh` 内容：
```shell
#!/bin/sh
# Author: hocgin@gmail.com
# -------------Use--------------
# sh down.sh
# ------------------------------
# 运行pom.xml 下载jar
NOW_PATH=$(cd "$(dirname "$0")"; pwd)
POM_XML=$NOW_PATH"/pom.xml"
TARGET_DIR=$NOW_PATH"/target"
mvn -f $POM_XML dependency:copy-dependencies
sudo chmod -R 777 $TARGET_DIR
```

`pom.xml` 内容：
> 正常maven的pom.xml内容

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <!-- 项目的名称 start -->
    <modelVersion>4.0.0</modelVersion>
    <groupId>temp.download</groupId>
    <artifactId>temp-download</artifactId>
    <version>1.0-SNAPSHOT</version>
    <!-- 项目的名称 end -->

	<dependencies>
      <!-- 要下载的jar start -->
	<dependency>
		<groupId>org.json</groupId>
		<artifactId>json</artifactId>
		<version>20160212</version>
	</dependency>
     <!-- 要下载的jar end -->
	</dependencies>

</project>
```
完成

## 使用方法
```shell
source init.sh
# Or
. init.sh

cd hocgin.github.io
# 尽情hexo吧
```
End
