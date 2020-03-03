------
title: 自编译 OpenWrt 系统
date: 2017-11-22 10:18:02
tags:
  - OpenWrt
categories:
  - OpenWrt
------
😌 整理、记录一下步骤..
<!--more-->
# 前置
## 更改源
```shell
sed -i.bak 's/\/us.archive.ubuntu.com\//\/cn.archive.ubuntu.com\//g' /etc/apt/sources.list

sudo apt update
```

## 关闭IPv6
echo 1 > /proc/sys/net/ipv6/conf/<eth1>/disable_ipv6

## 前置安装
- git subversion make automake autoconf gcc g++ binutils

## make, 缺省安装
- libncurses5-dev
- libssl-dev
- gawk

## 前置
- GitHub(git clone https://github.com/openwrt/openwrt) 获取 OpenWrt, 更改 openWrt 目录为当前用户所有权
```shell
# 例如:
chown -R hocgin:hocgin openwrt
```

-------
# 编译(openwrt/)
## 编译过程

1. make

2. ./script/feeds update -a

3. ./script/feeds install -a

```bash
4. make deconfig # 使用默认的配置
```

```bash
5. make menuconfig # 基于终端的一种配置方式，提供了文本模式的图形用户界面，用户可以通过光标移动来浏览所支持的各种特性。
```
> 固件配置, 可以选择编译的软件包

    ## 部分选项
    - 架构(AR7xxx) 
    - FLASH(Generic)
    - 路由器型号(WNDR3800) 
    - 文件系统(squashfs)
    - 通用设置
        - [-] Crytographically signed package lists
        - [-] Compile with support for patented functionallty
        - [-] Enable shadow password support
        - [-] Crash logging
        - [-] Compile the kernel with debug information
        - [-] Compile the kernel SysRq support
        - [-] Enable process core dump support
        - [-] Enable printk timestamps
        - [-] Enable Ipv6 support in packages
        - [-] Compile certain packages parallelized
        - [-] Enable gcc format-security
    - [-] Build the OpenWrt Image Builder
        - [-] In
    - [-] Build the OpenWrt SDK
    - [-] Package the OpenWrt-based Toolchain
其余默认。

6. make kernel_config
> 内核配置[开启浮点数模拟(FPU)]

7. make V=s -j<处理器数量>

8. 编译完成后，移出`bin/ar71xx/OpenWrt-ImageBuilder-ar71xx-generic.Linux-x86_64.tar.bz2` 文件, 并解压(tar xvf).

9. 进入(`OpenWrt-ImageBuilder-ar71xx-generic.Linux-x86_64/`)

10. 编译成镜像
```shell
# 检查基础镜像
parallels@ubuntu:~/OpenWrt/OpenWrt-ImageBuilder-ar71xx-generic.Linux-x86_64$ make image PROFILE=WNDR3700

# 包含必备包`预装软件`的镜像
parallels@ubuntu:~/OpenWrt/OpenWrt-ImageBuilder-ar71xx-generic.Linux-x86_64$ make image PROFILE=WNDR3700 PACKAGES="-dnsmasq dnsmasq-full ipset openssh-keygen openssh-server openssh-sftp-server kmod-fs-ext4 kmod-fs-ntfs kmod-fs-vfat kmod-usb2 kmod-usb-core kmod-usb-storage kmod-usb-storage-extras luci-app-firewall luci-app-samba luci-app-upnp luci luci-theme-material curl kmod-ipt-nat-extra libpcre"

```
11. 生成镜像(`~/OpenWrt/OpenWrt-ImageBuilder-ar71xx-generic.Linux-x86_64/bin/`)
- openwrt-ar71xx-generic-wndr3800-squashfs-sysupgrade.bin
- openwrt-ar71xx-generic-wndr3800-squashfs-factory.img


