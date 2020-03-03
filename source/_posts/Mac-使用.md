------
title: Mac的使用
date: 2016-07-02 10:47:06
tags:
  - Mac
  - Tips
categories:
  - OS
------
  留坑，刚刚起步，梳理中ing。
<!--more-->


### 小技巧
- 在Dock 隐藏 iTerm2
隐藏:
```shell
/usr/libexec/PlistBuddy -c "Add :LSUIElement bool true" /Applications/iTerm.app/Contents/Info.plist
```
显示:
```shell
/usr/libexec/PlistBuddy -c "Delete :LSUIElement" /Applications/iTerm.app/Contents/Info.plist
```
