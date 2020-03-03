------
title: 关于log4j报错
date: 2017-01-16 08:09:27
tags:
  - JAVA
categories:
  - Coder
------
  Java开发中经常遇到日志`冲突`或者`异常`, 彻底的来此追根究底.
<!--more-->

## 日志历史
- log4j
- JCL + log4j
- SLF4J `slf4j-XXX-version.jar` [XXX指代log4j12, jdk14, jcl, nop 等]
- slf4j-api
> v1 `log4j` 早期直接实现日志打印  
> v2 `JCL + log4j` 动态绑定, 面向`JCL 接口`实现的`log4j`  
> v3 `slf4j-api` 提供 `SLF4J接口` **面向对象编程**  
> `slf4j-XXX-version.jar` 对接口和指定`XXX`种类日志的具体实现

## slf4j 举例jar
- log4j-over-slf4j.jar 把`log4j`转为`slf4j`
- slf4j-log4j12.jar 以slf4j标准实现的log4j12
- `XXX-over-slf4j.jar` 把日志重定向到`slf4j` eg.`jcl-over-slf4j.jar`

## 总结
即.
Component  
   |  
   | log to Apache Commons Logging   
   V  
 jcl-over-slf4j.jar --- (redirect) ---> SLF4j ---> slf4j-log4j12-version.jar ---> log4j.jar ---> 输出日志
**解释:**
JCL实现的重定向为SLF4J日志形式, 然后SLF4J转为Log4j12输出!
