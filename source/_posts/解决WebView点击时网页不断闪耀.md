------
title: 解决 WebView 点击时网页不断闪耀
date: 2017-09-28 21:47:21
tags:
  - 问题
  - Android
categories:
  - Android
------
解决高版本 WebView 点击时网页不断闪耀的问题 🤗
<!--more-->
## 原因
网页渲染开启了硬件加速，如果你也出现了该问题，可以尝试关闭硬件加速。  

## 方案
方案一: 在xml中使用`android:layerType="software"`进行关闭。**推荐**  
方案二: 通过 java 代码`webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);`进行关闭。

## 参考
[BroswerKit](https://github.com/hocgin/BroswerKit/blob/master/app/src/main/res/layout/activity_browser.xml#L40-L53)进行标记的这段代码解决了我的闪耀问题