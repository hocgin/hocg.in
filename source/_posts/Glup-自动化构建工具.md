------
title: Glup 自动化构建工具
date: 2016-09-20 8:10:29
tags:
  - NodeJS
  - Ubuntu
  - Tips
categories:
  - Coder
------
Gulp.js 是一个自动化构建工具 😜
<!--more-->
## 来源
[Glup 整合](https://github.com/hocgin/Gulp-Scaffold)

## Glup
> Glup用自动化构建工具增强你的工作流程！

## 安装
```shell
$ npm install gulp -g
$ npm install gulp --save-dev
```

## 插件
- 编译Sass (gulp-ruby-sass)
- Autoprefixer (gulp-autoprefixer)
- 缩小化(minify)CSS (gulp-minify-css)
- JSHint (gulp-jshint)
- 拼接 (gulp-concat)
- 丑化(Uglify) (gulp-uglify)
- 图片压缩 (gulp-imagemin)
- 即时重整(LiveReload) (gulp-livereload)
- 清理档案 (gulp-clean)
- 图片快取，只有更改过得图片会进行压缩 (gulp-cache)
- 更动通知 (gulp-notify)
```shell
$ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-clean gulp-notify gulp-rename gulp-livereload gulp-cache --save-dev
```
