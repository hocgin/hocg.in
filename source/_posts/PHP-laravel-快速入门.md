------
title: PHP Laravel 快速入门
date: 2017-03-01 14:59:38
tags:
  - PHP
  - Mac
categories:
  - Server
------
PHP 框架 Laravel 搭建开始, 慢慢更新~ 😜😜😜😜
<!--more-->
# Quit Start

一. 安装`composer`, 用于管理依赖

```shell
# 全局安装 macOS
brew update
brew tap josegonzalez/homebrew-php
brew tap homebrew/versions
brew install php55-intl
brew install josegonzalez/php/composer
```

二. 下载`laravel`

```shell
composer global require "laravel/installer"
```

三. 创建项目

```shell
composer create-project laravel/laravel --prefer-dist
```

四. 关于如何使用`PhpStorm`  
> 默认已经配置好PHP开发环境了!

4.0.1 相关插件
- Laravel Plugin
- **[Optional]** PHP Annotations Plugin
- **[Optional]** Symfony2 Plugin

4.1 配置`Composer`
- 右键项目根节点 -> Composer -> init composer, 配置`PHP解释器`和`Composer路径`

![image](http://cdn.hocgin.top/874D3259-AB37-4EA4-BAAC-CA17674334C8.png)

- 右键项目根节点 -> Composer -> add dependency, 添加`barryvdh/laravel-ide-helper`

![image](http://cdn.hocgin.top/2F36AE2A-A1A7-40D0-8668-26EB0038BBCE.png)
或者

```shell
composer require barryvdh/laravel-ide-helper
```

4.2 编辑`config/app.php`文件, 在`providers`节点下面添加
![image](http://cdn.hocgin.top/4761A0E6-27E9-4544-B379-DE897A42E24E.png)

4.3 扩展命令工具
- Preferences -> Tools -> Command Line Tool Support

![image](http://cdn.hocgin.top/A84F6129-8F9E-4BC3-BAAA-D32FEFB7F1D5.png)

![image](http://cdn.hocgin.top/3C942985-0082-4675-BA3F-1FCC3A83CD2B.png)

**使用**: Tools -> Run Command(⌘ + ⇧ + X)

![image](http://cdn.hocgin.top/363F317B-FED9-40AE-A30A-84216A3A2721.png)

4.4 配置 php-xdebug
```shell
# 检查是否安装php-xdebug
php -m
```
安装后，修改下php.ini把xdebug.so前的注释';'去掉

![image](http://cdn.hocgin.top/5157CD6B-FD07-4F82-9DE6-9E8BEA21D504.png)

五. 配置启动
![image](http://cdn.hocgin.top/A1D8FA94-D5A1-46A6-AE09-B638BC4C5FCE.png)

六. 配置Debug

![image](http://cdn.hocgin.top/03337E90-7562-498F-A595-98FEA679EDDE.png)
并且在根目录加入`debug.ini`

```config
xdebug.remote_enable = On
xdebug.remote_autostart = On
upload_max_filesize = 1000M
post_max_size = 1005M
max_execution_time = 120

;xdebug.profiler_enable = On
;xdebug.profiler_enable_trigger = Off
;xdebug.profiler_output_dir = ./xdebug
;xdebug.profiler_aggregate = On
;xdebug.profiler_append = On
;xdebug.profiler_output_name = "cachegrind.out.%R.%u.%p"
```



# 资源
[Laravel Live Templates for PhpStorm](https://github.com/koomai/phpstorm-laravel-live-templates#requests--input)  
[Laravel 插件视频](https://laracasts.com/series/how-to-be-awesome-in-phpstorm/episodes/15)

## 标签
- 继承  
`@extends`

- 存在替换  
`@yield('content')`  
`@section`  
`@endsection`

- 增加  
`@stack("appendCSS")`  
`@push('appendCSS')`  
`@endpush`

- 注入  
`@inject("xx", "xx[Name]")`
