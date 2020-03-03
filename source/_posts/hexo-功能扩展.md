------
title: hexo 功能扩展
date: 2016-03-26 13:44:28
tags:
  - HTML5
  - Hexo
  - CSS3
categories:
  - Web
------
这是自己参照hexo进行私人订制的教程，也是实战的记录，感觉还不错，成品可参照本博客.. （如果我以后没换的话😶）
<!--more-->
## 须知
`站点目录`: /  
`主题目录`: /themes/[主题名]  
`主题配置文件`: /themes/[主题名]/\_config.yml   
`站点配置文件`: /\_config.yml  

## 添加微信公众号二维码
首先，打开`主题目录`下的 `layout/_macro/post.swig`
然后，找到节点`footer`加入以下代码
```html
<! -- 添加微信图标 start -->
      {% if theme.wechat_subscriber.enable %}
        {% if !is_home() %}
        <div class="hocgin-container">
          <div class="folder">
           <div class="paper">
        	<img width="100%" src="{{ theme.wechat_subscriber.qcode }}"/>
            </div>
          </div>
        </div>
	      <div class="hocgin-description">{{ theme.wechat_subscriber.description }}</div>
        {% endif %}
      {% endif %}
<! -- 添加微信图标 end -->
```
其次，到`主题目录`下的`source/css`创建文件夹`_hocgin`并在它之下创建css文件`customize-hocgin.css`以下是文件内容：
```css
.hocgin-container *, *:before, *:after {
  box-sizing: border-box;
}

.hocgin-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.hocgin-container > .folder {
  width: 220px;
  height: 180px;
  left: calc(50% - 110px);
  top: calc(70% - 90px);
  position: relative;
}
.hocgin-container > .folder > .paper {
  opacity: 1;
  position: absolute;
  overflow: hidden;
  width: 200px;
  height: 200px;
  top: calc(50% - 111px);
  left: calc(50% - 100px);
  transition: top 0.5s, opacity 0.4s;
  font-family: Verdana, Tahoma, sans-serif;
  font-size: 0.1em;
  padding: 1em;
  color: #644812;
  background-color: #fde1ab;
  -moz-box-shadow: 10px 10px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 10px 10px rgba(0, 0, 0, 0.2);
  box-shadow: 10px 10px rgba(0, 0, 0, 0.2);
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
.hocgin-container > .folder:hover > .paper {
  top: calc(50% - 150px);
}
.hocgin-container > .folder.opened > .paper {
  top: calc(-250px);
  opacity: .9;
}
.hocgin-description {
  text-align: center;
  margin-top: 4px;

}
```
保存后，找到`主题目录`下`source/css/main.styl`__(注：别的主题可能不一样)__ 追加
```css
// --------------------------------------------------
@import "_hocgin/customize-hocgin.css";
```
最后，修改`主题配置文件` 追加
```
# Customize args -- Hocgin
wechat_subscriber:
  enable: true
  qcode: [url]
  description: 欢迎您扫一扫上面的微信公众号，订阅我的博客！
```
### 效果
http://hocg.in

-----------------------------------

## 底部加入打赏功能
首先，打开`主题目录`下的 `layout/_macro/post.swig`
然后，找到节点`footer`加入以下代码
```html
      <! -- 添加打赏图标 start -->
      {% if theme.pay_money.enable %}
        {% if !is_home() %}
	   <div class="hocgin-money">
		<div class="money-reward">
		    赏
		    <div class="money-pay">
		        <img width="100%" src="{{ theme.pay_money.weixin_qcode }}"/>
		    </div>
		    <div class="money-pay">
		        <img width="100%" src="{{ theme.pay_money.alipay_qcode }}"/>
		    </div>
		</div>
	    </div>
	    <br/>
	    <br/>
        {% endif %}
      {% endif %}
      <! -- 添加打赏图标 end -->
```
其次，到`主题目录`下的`source/css`创建文件夹`_hocgin`并在它之下创建css文件`money-customize-hocgin.css`以下是文件内容：
```css
.hocgin-money *, *:before, *:after {
    box-sizing: border-box;
}

.hocgin-money > .money-reward {
    font-size: 2.4rem;
    line-height: 4.6rem;
    display: block;
    width: 4.6rem;
    height: 4.6rem;
    margin: 0 auto;
    padding: 0;
    -webkit-user-select: none;
    text-align: center;
    vertical-align: middle;
    color: #fff;
    border: 1px solid #f1b60e;
    border-radius: 50%;
    background: #fccd60;
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #fccd60), color-stop(100%, #fbae12), color-stop(100%, #2989d8), color-stop(100%, #207cca));
    background: -webkit-linear-gradient(top, #fccd60 0, #fbae12 100%, #2989d8 100%, #207cca 100%);
    background: linear-gradient(to bottom, #fccd60 0, #fbae12 100%, #2989d8 100%, #207cca 100%);
    position: relative;
}

.hocgin-money > .money-reward > .money-pay {
    position: absolute;
    overflow: hidden;
    width: 200px;
    height: 200px;
    visibility: hidden;
    top: calc(50% - 100px);
    left: calc(50% - 100px);
    opacity: 0;
    transition: top 0.5s, opacity 0.4s;
    font-family: Verdana, Tahoma, sans-serif;
    font-size: 0.1em;
    padding: 1em;
    color: #644812;
    background-color: #fff;
    -moz-box-shadow: 0 1px 1px 1px #efefef;
    -webkit-box-shadow: 0 1px 1px 1px #efefef;
    box-shadow: 0 1px 1px 1px #efefef;
    border: 1px solid #e6e6e6;
}

.hocgin-money > .money-reward:hover > .money-pay {
    visibility: visible;
    opacity: 1;
    z-index: 10;
}

.hocgin-money > .money-reward:hover > .money-pay:nth-child(1) {
    top: calc(50% - 250px);
}

.hocgin-money > .money-reward:hover > .money-pay:nth-child(2) {
    top: calc(50% + 50px);
}
```
保存后，找到`主题目录`下`source/css/main.styl`__(注：别的主题可能不一样)__ 追加
```css
// --------------------------------------------------
@import "_hocgin/money-customize-hocgin.css";
```
最后，修改`主题配置文件` 追加
```
# Customize args -- Hocgin
pay_money:
  enable: true
  weixin_qcode: http://cdn.hocgin.top/img/un/ali.pay.500.png
  alipay_qcode: http://cdn.hocgin.top/img/un/ali.pay.500.png
```
### 已知bug
1. 因为没使用js(也不想使用)，安卓设备需要`长按`才能出现效果，而苹果设备无法显示效果，欢迎大家修复。┌|*´∀｀|┘

### 效果
http://hocg.in

----------------------------------------
## 防止百度转码
`主题目录`下 `\layout\_partials\head.swig`
```html
<meta http-equiv=”Cache-Control” content=”no-transform” />
<meta http-equiv=”Cache-Control” content=”no-siteapp” />
```

----------------------------------------
## 添加搜索功能 `2016年06月04日`
1. 安装hexo数据生成插件

> Json格式的，有利于自主编写(暂时只介绍原生支持的，如果想自己编写下面的可以不用看)

[hexo-generator-json-content](https://github.com/alexbruno/hexo-generator-json-content)
```shell
$ npm i -S hexo-generator-json-content
```

> NexT 原生支持，不想折腾的可以使用

[hexo-generator-search](https://github.com/PaicHyperionDev/hexo-generator-search)
```shell
$ npm install hexo-generator-search --save
```

`站点配置文件` 新增
```
# Search
search:
  path: search.xml
  field: post
```
OK！

> 待续ing


----------------------------------------
## 结合服务器，实现自动部署

----------------------------------------
## 多说css美化
