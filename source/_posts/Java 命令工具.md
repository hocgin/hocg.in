------
title: Java 命令工具
date: 2019-05-12 19:37:49
tags:
  - JVM
  - Java
categories:
  - Java
------
## jps
> 显示当前用户的 Java 进程
> jps [options] [hostid]
```bash
# 常用, 查看传入参数和main函数位置
jps -lm
# 查看传入的jvm参数
jps -v
```

## jstat
> JVM 状态监控工具

```bash
# 最后一次 gc 调用情况
jstat -gc [hostid]
# 类加载情况
jstat -class [hostid]
# 实时编译情况
jstat -compiler [hostid]
# 虚拟机 三代(young,old,perm) 占用情况
jstat -gccapacity [hostid]
# GC 调用情况统计
jstat -gcutil [hostid]
# 年轻代对象
jstat -gcnew [hostid]
jstat -gcnewcapacity [hostid]
# old
jstat -gcold [hostid]
jstat -gcoldcapacity [hostid]

# 打印当前虚拟机执行信息
jstat -printcompilation [hostid]
```

## jmap
> 内存映射

```bash

# 查看堆内存 对象数量 和 占用
jstat -histo:live [hostid]
```

## jstack
> 栈快照

```bash
jstack [hostid]
```

## 参考
[参考](https://juejin.im/post/5ac442946fb9a028d700cfdf)