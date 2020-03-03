------
title: 安装完Ubuntu后,我该做什么
date: 2016-03-20 14:34:20
tags:
  - Ubuntu
  - Tips
  - Gnome
categories:
  - OS
------

这是一篇我对Ubuntu日常使用和优化的整理，也是一篇借鉴前人的文章，还有一些可能会遇到的疑难杂病的“偏方”，希望对你有帮助:)
**update**: 新增`undistract-me`终端命令完成提醒插件
<!--more-->

## yuan获取
官方列表： http://wiki.ubuntu.org.cn/%E6%BA%90%E5%88%97%E8%A1%A8
网易163： http://mirrors.163.com/.help/ubuntu.html

--------
## 移除
> 删除libreoffice

```shell
sudo apt-get remove libreoffice-common
```
> 删除Amazon的链接s

```shell
sudo apt-get remove unity-webapps-common
```
> 删掉基本不用的自带软件

```shell
sudo apt-get remove thunderbird totem rhythmbox empathy brasero simple-scan gnome-mahjongg aisleriot gnome-mines cheese transmission-common gnome-orca webbrowser-app gnome-sudoku  landscape-client-ui-install
sudo apt-get remove onboard deja-dup
```

> shang xia zuoyou

```shell
sudo apt-get remove vim-common
sudo apt-get install vim
```

---------
## 字体
monaco`苹果字体`
https://github.com/cstrap/monaco-font
```shell
curl -kL https://raw.github.com/cstrap/monaco-font/master/install-font-ubuntu.sh | bash
```
consolas`微软字体`

-------------------
## Gnome3
### 安装
#### 1.安装Gnome3桌面
```shell
# 安装
sudo add-apt-repository ppa:gnome3-team/gnome3
sudo apt-get update
sudo apt-get install ppa-purge
sudo ppa-purge ppa:gnome3-team/gnome3
sudo apt-get dist-upgrade
sudo apt-get install gnome-themes-standard ubuntu-desktop gnome-shell
# 删除
sudo apt-get install ppa-purge
sudo ppa-purge ppa:gnome3-team/gnome3
```
#### 2.Gnome3系统
[下载](https://ubuntugnome.org/download/)
### 主题
`主题文件位置：~/.themes 或 /usr/share/themes`
#### 1.Paper
```shell
# 下拉git
git clone https://github.com/snwh/paper-gtk-theme.git
# 运行安装脚本
sh ./install-gtk-theme.sh
```
#### 2.Numix-Circle
> 很赞

```shell
# 安装
sudo apt-add-repository ppa:numix/ppa
sudo apt-get update
sudo apt-get install numix-icon-theme-circle
```
### 插件支持
> gnome-tweak-tool Gnome3的调节软件
> 可直接管理插件

```shell
sudo apt-get install gnome-tweak-tool
```
`插件下载网站: https://extensions.gnome.org/`
1. 使用Chrome 插件
2. 系统安装chrome-gnome-shell

```shell
sudo add-apt-repository ppa:ne0sight/chrome-gnome-shell
# trusty
sudo apt-get update
sudo apt-get install chrome-gnome-shell

```
**插件列表**

名称|描述|推荐
----|----|
Autohide battery       |    可以在电池充满的情况下隐藏电池图标 | 推荐
Battery status               |  可以显示当前电池电量以及可以使用的时间 | 推荐
Dash to dock               |     在屏幕左边显示一个快速启动条 | 推荐
Freon                     |    显示当前磁盘，显卡，CPU等等温度|不推荐，推荐SysPeek
Lock Keys                 |   显示当前的 Num Lock, Caps Lock 的状态 | 推荐
Refesh wifi connections    |   在 wifi 列表上显示一个刷新图标 | 推荐
status title bar           |   讲状态条上的标题改为当前窗口的标题 | 推荐
Coverflow Alt-Tab | 类似WIN 7切换特效 | 太显眼，不推荐
OpenWeather | 天气预报 |推荐
NetSpeed | 显示网速 |不推荐，推荐SysPeek
system-monitor| 显示当前系统信息| 太显眼，不推荐
Dynamic Top Bar| 在当前没有最大化窗口时使顶栏透明|推荐
Impatience | Gnome Shell 动画提速|推荐
Better Volume Indicator |透过鼠标滚轮操作更便捷地调整音量|推荐
Media player indicator | 显示音乐播放器的状态|推荐
Workspaces-to-dock| 将工作区转变为一个可自动隐藏的停靠栏|推荐
Panel OSD| 修改通知显示位置|推荐
Clipboard Indicator| 剪贴板指示器 | 推荐
Caffeine |禁止自动挂起或锁屏 | 推荐
Transmission Daemon Indicator |Transmission面板指示器 | 推荐，需要Transmission Daemon
Icon Hider |显示/隐藏顶栏图标|推荐
Top Panel Workspace Scroll| 在顶栏上滚动鼠标中键来快速切换工作区。在topbar按住shift+滚轮|推荐
Drop Down Terminal|终端快捷方式|推荐
Windows Blur Effects|给未激活的窗口添加模糊效果|不推荐
Modern Calc|功能齐全的计算器扩展|没找到
EasyScreenCast|录屏工具|推荐
Place status indicator | 快速访问一些文件夹|推荐，没装上
Removable drive menu | 显示连接到电脑的usb设备|推荐
User themes | 用来启用自定义的shell主题 |推荐，没装上
Workspace indicator | 在顶栏显示当前示工作区的序号|推荐
touchpad-indicator | 插入鼠标时自动使触摸板失效|推荐
------------------------------------------------------

## 壁纸
```shell
# 1.安装archibold
curl -L -O http://archibold.io/sh/archibold
chmod +x archibold
sudo mv archibold /usr/bin

# 2.执行
archibold login-background [壁纸的位置]
```
此外还可以让桌面和锁屏界面使用动态壁纸，动态壁纸由一个xml文件构成，就像这样：
```xml
<background>

  <starttime>
    <year>2011</year>
    <month>11</month>
    <day>24</day>
    <hour>7</hour>
    <minute>00</minute>
    <second>00</second>
  </starttime>

    <static>
    <duration>3600.0</duration>
    <file>picture1.jpg</file>
    </static>

    <transition type="overlay">
    <duration>18000.0</duration>
    <from>picture1.jpg</from>
    <to>/picture2.jpg</to>
    </transition>

    <static>
    <duration>18000.0</duration>
    <file>picture2.jpg</file>
    </static>

    <transition type="overlay">
    <duration>21600.0</duration>
    <from>picture2.jpg</from>
    <to>picture1.jpg</to>
    </transition>

</background>
```
简单解释以下这个xml文件的含义：

`starttime`：这个部分规定了壁纸切换起始时间，设置成过去的某个时间即可(设置成2020年就要等到2020年才会有效果)  
`static`：这个部分表示在duration规定的时间(以秒为单位)中壁纸都是file中给定的那张图片  
`transition`：这个部分表示在duration规定的时间内壁纸从from中的图片切换到to中的图片你可以添加任意多个static+transition的组合，只需要最后一个transition切换回最初的static那张图片就可以循环更换壁纸了。  

那么如何启用这样的xml文件呢，单凭系统设置无法办到，我们需要使用dconf系统配置编辑器。
首先打开dconf编辑器，展开`org–gnome–desktop–background`这一项，可以看到其中的`picture-uri`修这一项的默认值是`file:///usr/share/backgrounds/gnome/adwaita-timed.xml`，这个就是你刚装好桌面是的默认壁纸啦，将其改成你的xml文件就可以了。  
锁屏界面的壁纸更换方法也一样，只不过把`org–gnome–desktop–background`改成`org–gnome–desktop–screensaver`而已

---------------------------------------------------
## 软件安装
### 指令安装
> 命令面板小提示

```shell
# 安装
sudo apt update
sudo apt install python3-dev python3-pip
sudo -H pip3 install thefuck
```

> 科学上网 Client-SS

```shell
# 安装
sudo add-apt-repository ppa:hzwhuang/ss-qt5
sudo apt-get update
sudo apt-get install shadowsocks-qt5
# 安装 pip
sudo pip install genpac

# 下载自动翻墙列表
genpac -p "SOCKS5 127.0.0.1:1080" --gfwlist-proxy="SOCKS5 127.0.0.1:1080" --output="~/Documents/autoproxy.pac" --gfwlist-url="https://autoproxy-gfwlist.googlecode.com/svn/trunk/gfwlist.txt" --user-rule-from="user-rules.txt"
```
**添加开机启动**
command：`/usr/bin/ss-qt5`

> 屏幕截图 Shutter

```shell
# 安装
sudo apt-get install Shutter

# 打开
# 搜索 Shutter
```
> 音视频解码 ubuntu-restricted extras

```shell
# 安装
sudo apt-get install ubuntu-restricted-extras
```
> 终端命令执行完成提醒

```shell
# 安装
sudo apt-get install undistract-me
# 配置
vim ~/.bashrc
# 新增如下两行
# . /usr/share/undistract-me/long-running.bash
# notify_when_long_running_commands_finish_install
# 生效
source ~/.bashrc
# 测试
sleep 11

```
> GNOME MPV 代替VLC播放器

```shell
# 安装
sudo add-apt-repository ppa:xuzhen666/gnome-mpv
sudo apt-get update
sudo apt-get install gnome-mpv
```

> 视频播放 VLC播放器

```shell
# 安装
sudo add-apt-repository ppa:videolan/master-daily
sudo apt-get update
sudo apt-get install vlc
# 使用
# 搜索 vlc
```
> Grub引导 Grub Customizer
> 可配置启动界面，启动项等

```shell
# 安装
sudo add-apt-repository ppa:danielrichter2007/grub-customizer
sudo apt-get update
sudo apt-get install grub-customizer
# 使用
# 搜索 Grub Customizer
```
> Office WPS

```shell
# 安装
sudo apt-get install wps-office
```
> [小插件]指示器性能 SysPeek

```shell
# 安装
sudo add-apt-repository ppa:nilarimogard/webupd8  
sudo apt-get update
sudo apt-get install syspeeka
```
> Synapse 快速启动器

```shell
sudo add-apt-repository ppa:synapse-core/testing
sudo apt-get update
sudo apt-get install synapse
```
> Uget一款下载工具，配合 aria2 插件使用效果出色
> curl + area2 + axel

地址：[参考](http://baike.renwuyi.com/2014-11/2153.html)

```shell
# 安装
sudo add-apt-repository ppa:plushuang-tw/uget-stable
sudo apt-get update
sudo apt-get install uget
```
> redshift类似 f.lux 的屏幕色温调整工具

```shell
# 安装
sudo apt-get install redshift-gtk
```
**添加开机启动**
command：`redshift-gtk -l 39.92:116.46 -t 5500:4500`

> Go For It 一款整合了待办事项与计时器的生产力应用。

```
# 安装
sudo add-apt-repository ppa:mank319/go-for-it
sudo apt-get update
sudo apt-get install go-for-it
```
> Catfish 一款优雅迅捷的文件搜索工具
```shell
# 安装
sudo apt-get install catfish
```

> 神级命令行软件 Tmux [说明](http://www.wushxin.top/2016/03/28/%E4%BD%BF%E7%94%A8tmux.html)
```shell
sudo apt-get install tmux
```

> `cat`代码高亮
```
# 安装
pip install pygments
```
配置
～/.bashrc
加入`alias cat='pygmentize -O style=monokai -f console256 -g'`

### 软件包安装
[系统管理 UbuntuTweak](http://ubuntu-tweak.com/)
`打开：搜索 Ubuntu Tweak`
[同步软件 坚果云](https://www.jianguoyun.com)
`打开：搜索 Nutstore`
[百度网盘桌面客户端 BCloud](https://github.com/LiuLang/bcloud-packages)
[便签](https://launchpad.net/indicator-stickynotes)
[MarkDown编辑软件 HarooPad](http://keepass.info/)
[密码管理器 keepass2](http://pad.haroopress.com/)
[搜狗输入法](http://pinyin.sogou.com/linux/?r=pinyin)
[有道词典](http://cidian.youdao.com/multi.html#linuxAll)
[VMware Workstation](http://www.vmware.com/products/workstation/)
[Chrome](http://www.google.cn/chrome/browser/)
[网易音乐](https://github.com/cosven/FeelUOwn)
[数据库设计软件 DBdesigner4](http://fabforce.net/dbdesigner4/) - [问题1](http://josemarfuregattideabreusilva.blogspot.com/2015/04/installing-dbdesigner-405-on-ubuntu.html)

----------------

### 听起来不错
1. Deluge Bittorrent 客户端
2. Nutty网络监测工具。
3. Synaptic 新立得软件包管理器
4. UNetbootin启动盘制作工具
5. Gpick拾色器。
6. gpaint 微软画图
7. ddm 驱动管理器
8. Navicat `o(╯□╰)o 竟然是wine的`
9. XMind

## 小技巧
### 关闭系统检测报告
```shell
sudo gedit /etc/default/apport
# 修改enabled=0
```

### 开机自动开启数字键
```shell
sudo apt-get install numlockx
sudo vim /etc/gdm/Init/Default
# -----------
# 在文件最后exit 0的前面添加：
  if [ -x /usr/bin/numlockx ]; then
      numlockx on
  fi
```
重启即可

### 插入鼠标时自动使触摸板失效
安装Touchpad Indicator (触摸板开关）  
```shell
sudo add-apt-repository ppa:atareao/atareao  
sudo apt-get update  
sudo apt-get install touchpad-indicator
```
 搜索 touchpad indicator

### 遇到显示俩个输入法图标情况  
`有一定原因是自启项启动了一个`

### 黑屏  
`95% 是和显卡驱动有关`

### Chrome 每次打开都要求输入密码  
一、删除现在的密钥环  
  视图->根据密码环 在密码区会有一个“登录”为名字的密钥环，右击将其删除。  
二、添加新的密钥环  
  终端输入seahorse打开管理密钥环的软件，文件->新建->密码和密钥->输入名字(这里是以”chrome”为例)。密码设置为空

### 添加源安装后，not fount XX  
一、 试着访问该链接  
二、如果可以手动找到该路径，那便可以修改`/etc/apt/source.list.d/`目录下你添加的安装源文件  
**例如**
```shell
vim /etc/apt/sources.list.d/sogoupinyin.list
# 显示内容
# deb http://archive.ubuntukylin.com:10006/ubuntukylin trusty main
# 可修改链接部分。
```


### 网卡驱动 `Realtek RTL8723AE 无线网卡驱动`  
**第一种**(闭源驱动)：  

```shell
sudo apt-get install linux-firmware-nonfree
```

**第二种**(第三方驱动，PPA安装)：  

```shell
sudo add-apt-repository ppa:hanipouspilot/rtlwifi
sudo apt-get update
sudo apt-get install rtlwifi-new-dkms
```

### 当遇到产品无法输入中文的时候
先尝试卸载ibus，如果还是不可以试试在xxx.sh的启动脚本中添加如下：

```shell
XMODIFIERS="@im=fcitx"
export XMODIFIERS
```

到

```shell
# ---------------------------------------------------------------------
# Run the IDE.
# ---------------------------------------------------------------------
```
之前。
**通用**
```shell
sudo mv /usr/bin/ibus-daemon /usr/bin/ibus-daemon.fix
```

### 解决`LC_CTYPE: cannot change locale (en_US.UTF-8)` 错误
```shell
# 增加en_US.UTF-8
locale-gen en_US.UTF-8
```

### 修复`VMware`故障，闪退
1. 下载[Uefi.priv](http://cdn.hocgin.top/Uefi.priv)、[fix.sh](http://cdn.hocgin.top/fix.sh)、[Uefi.der](http://cdn.hocgin.top/Uefi.der)至于同一目录.
2. 执行  
```shell
sh fix.sh
```
