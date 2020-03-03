------
title: OpenWrt 入门篇
date: 2017-09-18 14:32:26
tags:
  - Tips
  - OpenWrt
categories:
  - OpenWrt
------
今天刚好重刷 OpenWrt 固件，整理整理
<!--more-->
## 介绍
[什么是 OpenWrt?](https://www.wikiwand.com/zh/OpenWrt)

## 关于支持 OpenWrt 的路由器
可以去 [支持 OpenWrt 的路由器列表](https://wiki.openwrt.org/toh/start) 查看支持的路由器, 了解其 **CPU型号(既芯片型号)** **RAM容量** **Flash容量**

## 关于 OpenWrt 固件的下载
[OpenWrt 官方下载固件地址](https://downloads.openwrt.org)
![image](http://cdn.hocgin.top/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-09-18%2012.12.12.png)
**关于下载地址格式:**

![image](http://cdn.hocgin.top/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-09-18%2012.26.38.png)

**关于固件类型**
- 后缀为`factory`是用于从原厂固件刷为 OpenWrt。
- 后缀为`sysupgrade`是用于从 OpenWrt 更新 OpenWrt。

## 原厂刷 OpenWrt 固件
> 待补充

## 网页界面 OpenWrt 备份 & 升级固件
![image](http://cdn.hocgin.top/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-09-18%2012.50.34.png)
![image](http://cdn.hocgin.top/屏幕快照%202017-09-18%2012.57.13.png)

## OpenWrt 安全模式
> 当我们无法进入网页界面，可以使用**安全模式**管理恢复固件
> **必须使用有线电缆进行连接。**
> 环境: Linux or macOS

进入OpenWrt安全模式的方法：
1. 使用网线连接电脑和路由器
2. 设置电脑网卡
  IP 地址:`192.168.1.x`(x为2至255)
  子网掩码:`255.255.255.0`
3. 打开终端运行命令
```shell
# 注, 此处 eth0 为网卡. 可使用 ifconfig 进行查看
sudo tcpdump -Ani eth0 port 4919 and udp
```
4. 断电重启
5. 打开终端运行命令
```shell
telnet 192.168.1.1
```
6. 执行指令, 例如
```shell
# 重置系统
firstboot
# 重置密码
passwd
```
7. 重启路由器

## 不死 U-Boot
> 待补充

## 网页界面 OpenWrt 宽带拨号设置
1. 进入接口设置界面

2. 进行 WAN 口编辑
![image](http://cdn.hocgin.top/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-09-18%2013.37.35.png)

3. 填写宽带账号 & 密码
![image](http://cdn.hocgin.top/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-09-18%2013.45.42.png)

4. 此时电脑连接 LAN 口的话，即可进行上网。

## WiFi 设置
1. 进入 WiFi 设置界面，此处为双网卡
![image](http://cdn.hocgin.top/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-09-18%2013.53.43.png)
2. 开启WiFi
![image](http://cdn.hocgin.top/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-09-18%2014.00.00.png)
3. 设置WiFi
![image](http://cdn.hocgin.top/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-09-18%2014.26.04.png)

---
## 基础知识
### 什么是WAN口？什么是LAN口？
> 路由器通常有多个LAN口，一个WAN口

- WAN
> 广域网（WAN、公网、外网）

设置拨号上网连接互联网

- LAN
> 局域网（LAN、私网、内网)

连接本地计算机

### PPPoE
> 以太网上的点对点协议中的一种, 宽带接入方式ADSL 就使用了PPPoE协议

### 关于 WiFi 2.4G 和 5G
`802.11n/b/g` 主要工作频段为2.4GHz
`802.11a/ac` 主要工作频段为5GHz
