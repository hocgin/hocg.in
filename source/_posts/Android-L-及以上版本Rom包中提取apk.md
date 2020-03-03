------
title: Android L 及以上版本Rom包中提取apk
date: 2016-08-07 19:19:29
tags:
  - Android
  - 手机
categories:
  - Android
------
提取想要的apk， 例如CM ROM包中的含天气的时钟不错！

<!--more-->

## 以往版本
> Android Rom包只需解压后，取出system包即可取出内部apk

## Now
> 解压后可以发现，文件发生了改变并且`system.new.dat`此文件是不支持直接解压的。

### 环境
系统: win10
工具: [下载](http://cdn.hocgin.top/Extractor%20and%20Repacker%204.0.rar)
> 环境自备

### 操作步骤
1. 普通方式解压ROM
2. 运行下载工具中.bat文件`Extractor.bat`
3. 根据提示选择`1`，并复制`system.new.dat`, `system.transfer.list`，`file_contexts`三个文件到bat文件所在目录
4. 按任意键继续
5. 完成后可以得到一个`system`文件夹
6. 嘿嘿嘿..

### 问题!
1. 有可能在你安装apk的时候出现`应用未安装`的情况
  - 可以尝试重新对apk进行签名
  - 检查是否已经安装过该apk

End
