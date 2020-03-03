------
title: 解决 ProgressBar 上下出现空白现象
date: 2017-09-27 10:27:22
tags:
  - 问题
  - Android
categories:
  - Android
------
解决 ProgressBar 上下出现空白现象 🤠
<!--more-->

## 出现问题
一般情况我们使用如下代码来创建`ProgressBar`
```xml
<ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressBarStyleHorizontal"
        android:background="#fff"
        android:max="100"
        android:indeterminate="true"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"/>
```
那么将会出现如下情况:  
![出现空白间隔问题](http://cdn.hocgin.top/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-09-28%2021.58.00.png)

## 解决方案
通过变更`android:layout_marginBottom`和`android:layout_marginTop`在结合`android:background`设置为透明来处理这个问题:
```xml
    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_marginBottom="-7dp"
        android:layout_marginTop="-7dp"
        android:background="#00ffffff"
        android:max="100"
        android:indeterminate="true"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"/>
```
以下是处理后的结果  
![解决问题后](http://cdn.hocgin.top/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-09-28%2022.03.46.png)