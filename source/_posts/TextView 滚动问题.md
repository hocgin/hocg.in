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
## 设置 TextView 自动水平滚动
```xml
    <TextView
        android:id="@+id/tx"
        android:layout_width="40dp"
        android:layout_height="wrap_content"
        android:background="#fdf"
        android:text="1234567890123456789012345678901234567890"

        android:focusable="true"
        android:focusableInTouchMode="true"
        android:singleLine="true"
        android:scrollHorizontally="true"
        android:ellipsize="marquee"
        android:marqueeRepeatLimit ="marquee_forever"
        />
```
高版本测试中`android:singleLine="true"`虽然过期了，但仍不能使用`android:maxLines="1"`进行替换，如果实在强迫症患者可以使用`tx.setSingleLine(true);`替换。
