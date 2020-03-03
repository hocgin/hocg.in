------
title: Ubuntu 下的 Oh My ZSH!
date: 2016-09-30 16:18:09
tags:
  - Oh My ZSH
  - Ubuntu
  - Tips
categories:
  - IDE
------
号称终极shell :)
<!--more-->
## 前言
### 什么是zsh？
shell的一种,`cat /etc/shells`查看当前系统支持的shell

### 相关Link
[为什么说 zsh 是 shell 中的极品？](http://www.zhihu.com/question/21418449)

### 环境
OS: Ubuntu 16.04 x86_64

## 目录结构
- ~/.zshrc `文件zsh配置文件`
> 1. 可用来更改`Theme`
> 2. 加载`Plugin`

- ~/.oh-my-zsh `oh-my-zsh目录`


## 安装
```shell
# 安装zsh
$ sudo apt-get install zsh
# 安装oh-my-zsh
$ sudo apt-get install wget git
$ wget --no-check-certificate https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh
# 替换zsh为系统shell
$ chsh -s /bin/zsh
# 退出&重新登入
$ exit
# 查看是否成功
```

## 配置文件
[zsh.config]()

**注意**
- 需更改`.oh-my-zsh`的目录

## 插件介绍
- `git`;处于git项目下出现提示
- `autojump`; 目录自动提示, 需要[Linux 额外安装](git clone git://github.com/joelthelion/autojump.git)
```shell
# ~/.bashrc 追加
[[ -s ~/.autojump/etc/profile.d/autojump.sh ]] && . ~/.autojump/etc/profile.d/autojump.sh
```
- `git`;处于git项目下出现提示
- `zsh-syntax-highlighting`;高亮可用命令
```shell
$ git clone git://github.com/jimmijj/zsh-syntax-highlighting ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
plugins=(zsh-syntax-highlighting)
```
- `colored-man-pages`; 帮助文档高亮
- `colorize`;更多代码高亮
- `copydir`; 整个目录拷贝
- `command-not-found`;命令行智能提示
- `history`;查看输入历史
- `z`; `autojump`同类

## 主题
- ys

## 小技巧
- 转换路径时可以省去cd命令，直接输入路径即可
- `d` 可以查看访问过的路径，然后输入数字就可以直接切换
- 输入不完整的路径/文件/命令，按下tab键可以出现提示，再按tab则可以实现路径补全
- 普通命令使用两次tab可进入选择模式， ctrl+f/b/n/p 可以向前后左右切换
- kill + tab `强强强`
- alias -s xx='xxx' 快捷配置

## 相关设置
> cat 代码高亮
```shell
pip install Pygments
# 增加以下alias
# alias ccat='pygmentize -g'
```

## 后续
[Oh My ZSH!](https://github.com/hocgin/Gather/tree/master/oh-my-zsh)
