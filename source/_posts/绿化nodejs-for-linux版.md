------
title: 绿化NodeJS for linux版
date: 2016-04-25 09:38:49
tags:
  - NodeJS
  - Ubuntu
  - Tips
categories:
  - Coder
------
起因，为了方便hexo发布博客，所以想把NodeJS绿化在U盘上..
谁叫网上只有win版的呢！自己码起来～
绿化 o(╯□╰)o
<!--more-->

## 目录结构
```shell
Green4nodeJS
├── hocgin.github.io // github博客目录
├── node // nodejs基本目录
│   ├── node-linux // nodejs源文件
│   ├── cache // 创建一个空文件夹，即可
│   ├── init-module // 创建一个空文件夹，即可
│   └── userconfig // 创建一个空文件夹，即可
└── init.sh // 初始化shell文件 *重要
```

## 初始化文件
> 主要是加载配置环境，初始化变量

`init.sh` 内容
```shell
#!/bin/bash
# Author: hocgin@gmail.com
# -------------Use--------------
# source init.sh or . init.sh
# ------------------------------
NOW_PATH=$(cd "$(dirname "$0")"; pwd)
NODE_NAME="node-linux"
NODE_HOME=$NOW_PATH"/node/"$NODE_NAME
NODE_PATH=$NODE_HOME"/bin"
NPM_PATH=$NODE_HOME"/lib/node_modules/npm/bin"
sudo chmod +x -R $NPM_PATH"/."
export PATH=$PATH:$NODE_PATH:$NPM_PATH
# "/home/hocgin/.npmrc"
npm set userconfig $NOW_PATH"/node/userconfig"
# "/home/hocgin/.npm-init.js"
npm set init-module $NOW_PATH"/node/init-module"
# "/home/hocgin/.npm"
npm set cache  $NOW_PATH"/node/cache"
```

修改 `/node/node-linux/lib/node_modules/npm/bin/npm` 文件
```shell
# NPM_CLI_JS="$basedir/node_modules/npm/bin/npm-cli.js"
NPM_CLI_JS="$basedir/npm-cli.js"

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

`注: 安装module时请加上 -g`

End
