------
title: ES6 新特性
date: 2016-05-10 10:28:29
tags:
  - NodeJS
  - Ubuntu
  - Tips
categories:
  - Coder
------
NodeJS 的构建工具层出不穷，因此了解一下陈旧事物的进展。
<!--more-->
# 简介
es6: ecmscript6

# 新特性
- let 块级作用域, `注: es5中var声明的上全局范围的`
- const 常量
- class 类
- extends 继承
- super 指代父类的实例
- arrow functions 语法糖
```javascript
/**
 * 语法: (参数) => {执行代码}
 **/
function(i){ return i + 1; } //ES5
(i) => { i + 1 } //ES6
```
- template string 模版字符  
```javascript
 /**
  * 语法: `${变量}`
  **/
  const name = 'hocgin';
  console.log(`this is template strnig
  <b>${name}</b>
  `);
```
- destructuring   
```javascript
  let cat = 'ken'
  let dog = 'lili'
  let zoo = {cat, dog}
  console.log(zoo)  //Object {cat: "ken", dog: "lili"}

  let dog = {type: 'animal', many: 2}
  let { type, many} = dog
  console.log(type, many)   //animal 2
```
- default 默认值
```javascript
 /**
  * 语法:
  * function <method name>(param = <default value>) {
  *    ...
  * }
  **/
  function animal(type = 'cat'){
      console.log(type)
  }
  animal();
```
- rest 可变参数
```javascript
 /**
  * 语法:
  * function <method name>(...params) {
  *    ...
  * }
  **/
  function animals(...types){
      console.log(types)
  }
  animals('cat', 'dog', 'fish');
```
- import export 模块设计
> es6 把一个文件当作一个模块, 一个模块可`export`多个变量, 因此不同的`export`
> 可对应不同的`import`

```javascript
  // 导出模块
  export animal
  // 导入模块 - 变量为 animal
  import animal from './content'
  //--------------------
  // 导出模块
  export {dog, cat}
  // 导入模块 - 变量为 [dog, cat]
  import {dog, cat} from './content'
  //--------------------
  export {dog, cat}
  // 全部导入
  import * as animal from './content'
  // or
  module animal form './content'
  //--------------------
  // 默认导出, 一个模块只能使用 export default 一次
  export default 'dog dog'
  import animal from './content'
```
