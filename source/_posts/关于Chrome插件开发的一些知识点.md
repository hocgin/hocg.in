------
title: 关于Chrome 插件开发的一些知识点
date: 2017-02-04 13:20:51
update: 2017-11-10 20:48:09
tags:
  - HTML5
  - Chrome
categories:
  - IDE
------
身为Chrome重度患者，生活和工作处处不离，这篇并不是入门教程，而是开发中的一些小Tip的记录.
<!--more-->
# 我开发的Chrome 插件
- [天气预报](https://github.com/hocgin/Weather-For-Chrome-Plugin)

# 数据存储
- HTML5 `localStorage` **存储在解析页面当前范围和网站共享localStorage**
- Chrome API `chrome.storage` **存储在系统磁盘，适合少量数据**
- Web SQL Database **存储在系统磁盘，适合大量数据**

# 脚本运行范围
- background **浏览器打开后运行, 会一直存在于后台, 因此开发时更改后必须`⌘+R`重新加载**
- content_scripts **在网页加载后运行**
- html内导入的脚本 **运行于该html页面, 例如: option页面和popup页面**

**Note:**
> popup.js 于background.js 是可以进行共通的.
> 使用`var BG = chrome.extension.getBackgroundPage();` BG便是`background.js`的`window`对象


# Action 入口
- 地址栏右侧图标外 `browser_action` **可显示badge**
- 右键菜单 `chrome.contextMenus` **可在`background`中创建**
- 地址栏右侧图标~~内~~外 `page_action` **新版的已更改显示在外围 [PageAction API](https://developer.chrome.com/extensions/pageAction)**
- 多功能框 `omnibox` **对地址框进行监听**
- overrides **如, `管理书签`/`历史记录`/`新标签页`等 (一个扩展只能替换一个页面)**
- 桌面提醒 `webkitNotifications.createNotification`

# 权限
> 相当一部分Chrome API 使用需要在`Manifest`申明权限

# 页面间通信
- popup 与 background 通信
1. 使用上面提到的`共通`的特性。
2. 使用 `chrome.extension.onMessage.addListener`进行通信监听 与 使用`chrome.extension.sendMessage`进行触发
- option 与 (popup 或者 background) 通信
1. 使用 `chrome.extension.onMessage.addListener`进行通信监听 与 使用`chrome.extension.sendMessage`进行触发

- (popup 或者 background) 与 option 通信
1. 使用 `chrome.extension.onMessage.addListener`进行通信监听, 触发方式比较麻烦, 查看以下例子:
```js
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            if (!!tabs
                && tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, {
                  //message..
                  }, callback);
            }
        });
```

# i18
- `CSS` \_\_MSG\_@@key
- `JS` chrome.i18n.getMessage('key');

# 关于打包 & 发布
1. `扩展程序`中进行打包，生成`.crx`(扩展程序) & `.pem`(秘钥**重要**)
2. 前往[Chrome 开发者中心](https://chrome.google.com/webstore/developer/dashboard/) 认证`需支付5美元用于认证`
3. 把`.pem`更名为`key.pem`并放入`源码文件夹`中，打包为`.zip`文件
4. 上传 并编辑 (**必填 (扩展描述、ICON(128x128)、扩展截图(1280x800 or 640x400)、类别、语言)**)

-------
> 如有遗漏或错误欢迎补充..
