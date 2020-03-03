------
title: IDEA 中的 Spring Boot 开发模式
date: 2017-10-20 23:28:09
tags:
  - SpringBoot
  - Ubuntu
  - Tips
categories:
  - Server
------
🤑 完全热部署, 配置完成瞬间舒爽无比。
<!--more-->
## `.java` 文件和配置文件更改后进行自动重启
1. 更改`IDEA`中的如下设置`Build project automatically`。

![屏幕快照 2017-10-19 22.30.09.png](http://cdn.hocgin.top/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-10-19%2022.30.09.png)

2. 打开`IDEA`的`Action window`, 快捷键如下:
- Linux : `CTRL+SHIFT+A`
- Mac OSX : `SHIFT+COMMAND+A`
- Windows : `CTRL+ALT+SHIFT+/`
输入(选择) `Registry...`, 选择如下:

![屏幕快照 2017-10-19 22.36.39.png](http://cdn.hocgin.top/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-10-19%2022.36.39.png)

此时进行`.java` 文件和配置文件修改时, 会进行 Spring Boot 重启。

## 当更改静态`HTML`进行实时刷新
1. 加入依赖

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
        </dependency>
```

2. 安装浏览器插件

- [Chrome 插件](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)

- [Firefox 插件](https://addons.mozilla.org/en-US/firefox/addon/livereload/)

- [Safari 插件](http://download.livereload.com/2.1.0/LiveReload-2.1.0.safariextz)

3. 更改文件和静态页面(HTML)都可以进行热部署类。

## 实时刷新`thymeleaf`模版文件

配置文件设置取消缓存:

```yml
spring:
    thymeleaf:
        cache: false
```

Chrome 设置取消缓存:

![屏幕快照 2017-10-19 22.46.23.png](http://cdn.hocgin.top/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-10-19%2022.46.23.png)

此时几乎所有的东西(`.java`/``/`SpringBoot 配置文件`)都可以进行热部署了。
包括:
 - 修改 `.java` 文件。
 - 修改页面(`thymeleaf` `html` `..`) 文件。
 - 修改 `SpringBoot 配置文件`。
 - 增删静态文件(`css` `js` `图片`)。


 ## 关于定制化热部署
 可查询`spring-boot-devtools`的使用, 使用以下子项进行配置。
 ```yml
 spring:
    devtools:
 ```

 ## IDEA 扩展
> pom.xml 添加以下依赖可查看更多的信息。
> 该依赖是可查看监控信息的, 更多使用移步 Google.com。

 ```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
 ```
IDEA 显示如下:

 ![屏幕快照 2017-10-29 14.18.38.png](http://cdn.hocgin.top/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-10-29%2014.18.38.png)