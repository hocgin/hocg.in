------
title: Wireshark 的使用
date: 2017-04-20 19:34:05
tags:
  - Wireshark
  - Tips
categories:
  - IDE
------
 抽空整理一下, 虽然`Charles`很好用, 但是某些情况下该软件也是不可替代的.
<!--more-->
<!-- ## 参考
[WireShark](http://www.cnblogs.com/TankXiao/archive/2012/10/10/2711777.html) -->

### 关于Wireshark
适合研究 TCP,UDP 等协议. **因为限制并不能改包或模拟发包，只能分析协议**
若, 研究HTTP,HTTPS推荐使用`Charles` or `Fiddler`

### 关于抓包五颜六色的意义
> 更多详情查看 View - Coloring Rules

- 绿色背景（黑字）`HTTP包`
- 灰色背景（黑字）`TCP包`
- 蓝色背景 (黑字)  `DNS包`
- 黑色背景 (红字)  `TCP错误包或者校验错误包`

### Wireshark主窗口
> 从上至下

![img](https://cloud.githubusercontent.com/assets/16535610/21889866/01695500-d906-11e6-8ddb-c82c20967ae0.png)

- 菜单栏: 用于开始操作。
- 主工具栏: 提供快速访问菜单中经常用到的项目的功能。
- 过滤工具栏: 提供处理当前显示过滤得方法。
- 拦截的数据包列表(Packet list): 显示打开文件的每个包的摘要。点击面板中的单独条目，包的其他情况将会显示在另外两个面板中。
- 选中的数据包信息(Packet details): 显示您在Packet list面板中选择的包的更多详情。
- 选中的数据包字节码: 显示您在Packet list面板选择的包的数据，以及在Packet details面板高亮显示的字段。
- 状态栏: 显示当前程序状态以及捕捉数据的更多详情。

**选中的数据包信息**
- Frame: 物理层的数据帧概况
- Ethernet II: 数据链路层以太网帧头部信息
- Internet Protocol Version 4: 互联网层IP包头部信息
- Transmission Control Protocol:  传输层T的数据段头部信息，此处是TCP
- Hypertext Transfer Protocol:  应用层的信息，此处是HTTP协议


### 过滤表达式
- 协议过滤
> tcp upd ..

- ip 过滤
>`来源` ip.src == 192.168.1.1
>`目的地` ip.dst == 192.168.1.1

- 端口
> tcp.port == 8080
>`仅显示来源为8080的` tcp.srcport == 8080

- Http模式
> http.request.method=="GET"

- 逻辑运算符为 `and` `or`
