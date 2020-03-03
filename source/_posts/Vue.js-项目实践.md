------
title: Vue 项目实践 - 持续更新
date: 2017-03-26 15:40:08
tags:
  - JavaScript
  - HTML5
  - 前端
categories:
  - Coder
------
🐌 目前国内前端MVVM最火的框架.. 项目实践记录一些流程
<!--more-->
# 相关
- vue
  - vue-router `给vue使用的路由`
  - vuex `一个专为 Vue.js 应用程序开发的状态管理模式`
- webpack

# 快速搭建项目
```shell
# 构建项目
npm install -g vue-cli
vue init webpack <project-name>
# 试行
cd iPage
npm install
npm run dev

# 安装 vuex
npm install vuex -S

# 安装 sass 开发支持
npm install --save-dev sass-loader
npm install --save-dev node-sass
npm install --save-dev css-loader
npm install --save-dev style-loader

# 编译生成静态文件
npm run build
```

# 目录结构
```
.  
├── README.md  
├── build  
├── config   
├── index.html  
├── node_modules  
├── package.json  
├── src // 源码
|    ├── App.vue    // 父组件  
|    ├── assets     // 静态文件  
|    ├── components // 公共组件  
|    ├── main.js    // webpack打包入口文件  
|    └── router  
|          └── index.js // 页面路由  
├── static  
└── test  
```

# 遇到的问题
