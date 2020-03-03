------
title: Vue.js项目 部件简介 (未完待续)
date: 2017-03-31 15:32:36
tags:
  - JavaScript
  - HTML5
  - 前端
categories:
  - Coder
------
🦋 目前国内前端MVVM最火的框架.. 前段时间写了一个[About页面](https://github.com/hocgin/iPage), 这几天顺带整理一下知识点.
<!--more-->
# Vue.js
> Vue.js是当下很火的一个JavaScript MVVM库，它是以数据驱动和组件化的思想构建的.
> 类似的有`Angular.js`.

- 可以建立DOM和数据之间的绑定
- 可以按功能/组件抽离HTML代码

**相关**
[Vue 项目实践 - 持续更新](http://hocg.in/2017/03/26/Vue.js-%E9%A1%B9%E7%9B%AE%E5%AE%9E%E8%B7%B5)

## 功能部分
### 基础
- 数值默认双向绑定
- 支持 条件语法特性/功能函数/生命周期
- 动态设定`style`/`class`
- 捆绑`event`
- 渲染生命周期
### 高级
- 单页面组件
- 自定义指令
- 单元测试
- 插件

## 单文件组件`.vue`
**定义:**
```html
<template>
  <h1>This is title</h1>
</template>
<script>
  export default {
    name: 'Title'
  }
</script>
```
**使用:**
```html
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <Title></Title>
  </div>
</template>
<script>
  import Title from './components/Title'
  export default {
    name: 'app',
    components: {
      Title
    }
  }
</script>
```


# Vue Router
> 扩展 Vue
> 按字面意思来看为`Vue 路由`
> 其实质也就是用于**单页应用**管理页面跳转, 负责路径解析.

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    }
  ]
})
```


# Vuex
> 扩展 Vue
> 当开发大型项目时, 为防止 Vue 太过臃肿, 使用 Vuex 管理数据状态.

# webpack
> 一款模块加载器兼打包工具
> 使用模块的理念来处理 JS/CSS/图片等资源文件

## 指令
```shell
# 安装
npm install webpack --save-dev
# 执行
webpack
   --display-error-details # 输出详细错误
   --watch # 实时监听并自动打包
   --config <file> # 指定配置文件打包
   -p # 压缩打包
   -d # 生成map映射文件
```

## 配置(webpack.config.js)
```javascript
module.exports = {
  // 插件
  plugins: [],
  // 页面入口
  entry: {},
  // 入口文件输出位置, 即处理后的文件存放位置
  output: {},
  module: {
    // 文件处理加载器
    rules: []
  },
  // 额外处理
  resolve: {
    // 自动扩展文件后缀, require时可以进行省略
    extensions: [],
    // 模块定义别名, require时可以进行路径省略, 直接使用别名
    alias: {}
  }
}
```
## 入口文件(main.js)
```javascript
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
// 引入js, 加载器会自动进行处理
import holderjs from 'holderjs'
// 引入 css/scss, 加载器会自动进行处理
import appScss from './assets/app.scss'
import fontAwesomeCss from './assets/font-awesome-4.7.0/css/font-awesome.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
```

> 未完待续ing
