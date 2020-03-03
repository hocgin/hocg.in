------
title: 谈JVM，字节码
date: 2016-06-12 19:37:49
tags:
  - JVM
  - Java
categories:
  - Coder
------
谈谈JVM，最近在研究破解jar，有这方面经验的麻烦指导一下思路..
<!--more-->
## 参考
[参考1](http://www.yangyong.me/java-class%E6%96%87%E4%BB%B6%E5%92%8C%E8%99%9A%E6%8B%9F%E6%9C%BA%E5%AD%97%E8%8A%82%E7%A0%81%E6%8C%87%E4%BB%A4-%E5%A6%82%E4%BD%95%E6%9F%A5%E7%9C%8Bclass%E6%96%87%E4%BB%B6/#viewclass)
[指令整理](http://blog.csdn.net/sprayabc/article/details/8576605)

## 常用指令
```shell

# 反编译查看`类文件`所有信息
javap -verbose [class]

```

## 局部变量类型
|特殊字符表示|类型|描述|
|----|----|----|
|c|char|char类型|
|i|int|int类型|
|l|long|long类型|
|s|short|short类型|
|b|byte|byte类型|
|f|float|float类型|
|z|boolean|布尔类型|
|a|reference|引用|

## 方法信息
```
L1
    LOCALVARIABLE this LMain; L0 L1 0
    LOCALVARIABLE a I L0 L1 1
    MAXSTACK = 0
    MAXLOCALS = 2
```
局部变量参数 LOCALVARIABLE
局部表大小 MAXLOCALS
操作数栈大小 MAXSTACK

## 指令
### 运算指令
> 算术指令用于对两个`操作数栈`上的值进行某种特定运算，并把结果重新存入到`操作栈`顶。

- 加法指令:iadd,ladd,fadd,dadd
- 减法指令:isub,lsub,fsub,dsub
- 乘法指令:imul,lmul,fmul,dmul
- 除法指令:idiv,ldiv,fdiv,ddiv
- 求余指令:irem,lrem,frem,drem
- 取反指令:ineg,leng,fneg,dneg
- 位移指令:ishl,ishr,iushr,lshl,lshr,lushr
- 按位或指令:ior,lor
- 按位与指令:iand,land
- 按位异或指令:ixor,lxor
- 局部变量自增指令:iinc
- 比较指令:dcmpg,dcmpl,fcmpg,fcmpl,lcmp

### 加载和存储指令
> 用于`局部变量表`和`操作数栈`之间来回传输

- 将一个局部变量加载到操作数栈的指令包括：iload,iload\_&lt;n>，lload、lload\_&lt;n>、float、fload\_&lt;n>、dload、dload\_&lt;n>，aload、aload\_&lt;n>。
- 将一个数值从操作数栈存储到局部变量标的指令：istore,istore\_&lt;n>,lstore,lstore\_&lt;n>,fstore,fstore\_&lt;n>,dstore,dstore\_&lt;n>,astore,astore\_&lt;n>
- 将常量加载到操作数栈的指令：bipush,sipush,ldc,ldc\_w,ldc2\_w,aconst\_null,iconst\_ml,iconst\_&lt;i>,lconst\_&lt;l>,fconst\_&lt;f>,dconst\_&lt;d>
- 局部变量表的访问索引指令:wide
    一部分以尖括号结尾的指令代表了一组指令，如iload\_&lt;i>，代表了iload\_0,iload\_1等，这几组指令都是带有一个操作数的通用指令。

### 运算指令
> 对两个`操作数栈`上的值进行某种特定运算，并把结果重新存入到`操作栈`顶

- 加法指令:iadd,ladd,fadd,dadd
- 减法指令:isub,lsub,fsub,dsub
- 乘法指令:imul,lmul,fmul,dmul
- 除法指令:idiv,ldiv,fdiv,ddiv
- 求余指令:irem,lrem,frem,drem
- 取反指令:ineg,leng,fneg,dneg
- 位移指令:ishl,ishr,iushr,lshl,lshr,lushr
- 按位或指令:ior,lor
- 按位与指令:iand,land
- 按位异或指令:ixor,lxor
- 局部变量自增指令:iinc
- 比较指令:dcmpg,dcmpl,fcmpg,fcmpl,lcmp

### 类型转换指令
> 将两种Java虚拟机数值类型相互转换

JVM支持宽化类型转换(小范围类型向大范围类型转换)：
- int类型到long,float,double类型
- long类型到float,double类型
- float到double类型

### 对象创建与操作
> 虽然类实例和数组都是对象，Java虚拟机对类实例和数组的创建与操作使用了不同的字节码指令。

- 创建实例的指令:new
- 创建数组的指令:newarray,anewarray,multianewarray
- 访问字段指令:getfield,putfield,getstatic,putstatic
- 把数组元素加载到操作数栈指令:baload,caload,saload,iaload,laload,faload,daload,aaload
- 将操作数栈的数值存储到数组元素中执行:bastore,castore,castore,sastore,iastore,fastore,dastore,aastore
- 取数组长度指令:arraylength
- 检查实例类型指令:instanceof,checkcast

### 操作数栈管理指令
直接操作操作数栈的指令：pop,pop2,dup,dup2,dup_x1,dup2_x1,dup_x2,dup2_x2和swap
> NOTE: 压入栈顶(DUP)/弹出栈顶(POP)

### 控制转移指令
- 条件分支:ifeq,iflt,ifle,ifne,ifgt,ifge,ifnull,ifnotnull,if_cmpeq,if_icmpne,if_icmlt,if_icmpgt等
- 复合条件分支:tableswitch,lookupswitch
- 无条件分支:goto,goto_w,jsr,jsr_w,ret

### 方法调用和返回指令
- invokevirtual指令:调用对象的实例方法，根据对象的实际类型进行分派(虚拟机分派)。
- invokeinterface指令:调用接口方法，在运行时搜索一个实现这个接口方法的对象，找出合适的方法进行调用。
- invokespecial:调用需要特殊处理的实例方法，包括实例初始化方法，私有方法和父类方法
- invokestatic:调用类方法(static)
- 方法返回指令是根据返回值的类型区分的，包括ireturn(返回值是boolean,byte,char,short和int),lreturn,freturn,drturn和areturn，另外一个return供void方法，实例初始化方法，类和接口的类初始化i方法使用。

### 同步



## Eg:
```
// class version 52.0 (52)
// access flags 0x21
public class Main {

  // compiled from: Main.java

  // access flags 0x11
  public final I simpleField = 100

  // access flags 0x0
  <init>()V
   L0
    LINENUMBER 12 L0
    ALOAD 0
    INVOKESPECIAL java/lang/Object.<init> ()V
   L1
    LINENUMBER 10 L1
    ALOAD 0
    BIPUSH 100
    PUTFIELD Main.simpleField : I
   L2
    LINENUMBER 13 L2
    GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
    BIPUSH 100
    INVOKEVIRTUAL java/io/PrintStream.print (I)V
   L3
    LINENUMBER 14 L3
    RETURN
   L4
    LOCALVARIABLE this LMain; L0 L4 0
    MAXSTACK = 2
    MAXLOCALS = 1

  // access flags 0x9
  public static main([Ljava/lang/String;)V
   L0
    LINENUMBER 16 L0
    NEW Main
    DUP
    INVOKESPECIAL Main.<init> ()V
    ASTORE 1
   L1
    LINENUMBER 17 L1
    GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
    LDC "-->"
    INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/String;)V
   L2
    LINENUMBER 19 L2
    RETURN
   L3
    LOCALVARIABLE args [Ljava/lang/String; L0 L3 0
    LOCALVARIABLE main LMain; L1 L3 1
    MAXSTACK = 2
    MAXLOCALS = 2

  // access flags 0x21
  public synchronized a(I)V throws java/lang/Exception 
   L0
    LINENUMBER 23 L0
    RETURN
   L1
    LOCALVARIABLE this LMain; L0 L1 0
    LOCALVARIABLE a I L0 L1 1
    MAXSTACK = 0
    MAXLOCALS = 2
}
```

