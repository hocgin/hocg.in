------
title: 关于 Android Studio 启动 Android 模拟器失败问题
date: 2017-07-02 21:07
tags:
  - Android
  - Mac
categories:
  - Android
------
## 起因
Android Studio 启动虚拟机一直闪退，不显示任何报错信息

<!--more-->
## 排查问题
1. 尝试用命令启动模拟器, 方便查看其错误日志
```shell
# 查看你创建的设备
emulator -list-avds
# 启动命令
emulator -netdelay none -netspeed full -avd New_Device_API_2
# 以下为报错日志
Hax is enabled
Hax ram_size 0x60000000
HAX is working and emulator runs in fast virt mode.
Failed to sync vcpu reg
Failed to sync vcpu reg
Failed to sync vcpu reg
Failed to sync vcpu reg
Failed to sync vcpu reg
Failed to sync HAX vcpu contextInternal error: Initial hax sync failed
```
vcpu无法进行同步?? What??
尝试进行了 Google，[How do I fix “Failed to sync vcpu reg” error?
](https://stackoverflow.com/questions/17024538/how-do-i-fix-failed-to-sync-vcpu-reg-error/17024645)
好吧, docker 之类的虚拟机引起了冲突

## 解决办法
关掉用不着的虚拟机如 docker ..
