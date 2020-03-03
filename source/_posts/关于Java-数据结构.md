------
title: 关于Java-数据结构
date: 2018-03-20 17:10:39
tags:
  - Java
  - 数据结构
categories:
  - Java
------
关于Java常用数据结构，后期继续整理

<!--more-->
## List
> List必须保持元素特定的顺序

### LinkedList `List`、`Queue`
- 双链表`Node`
- 非线程安全的
- 转换为线程安全`Collections.synchronizedList(new LinkedList(...));`
- 特点: 实现了List、Deque接口，双向链表，适合频繁插入/删除，不适合使用set、set。

### ArrayList `List`
- 数组实现
- 非线程安全的
- 特点: 动态长度(默认长度为10，增长默认为当前长度的1/2，不可大于Integer.MAX_VALUE - 8，否则 OutOfMemoryError), get、set直接访问。

### Vector `List`
- 线程安全
- 用`synchronized`修饰函数
- 
### CopyOnWriteArrayList `List`
- 数组实现
- 线程安全
- 特点: 数组长度默认为0，每次修改都会重新增长长度和拷贝数组。

### Stack
- 线程安全
- 数组实现
- 特点: 模拟栈。

### 工具类
- 转换为线程安全`Collections.synchronizedList(new ArrayList(...));`
  - 内部是用List实现存储的
  - 与`Vector`差别是可以传入定制的锁。
- 转为不可变List `Collections.unmodifiableList(new ArrayList<>())`
    - 门面模式(List)
    - 线程安全
    - 特点: 不可变。

### 常用技巧
```java
    @Test
    public void lists() {
        /**
         * 打乱数组
         */
        List<Integer> list = Arrays.asList(1, 2, 3);
        Collections.shuffle(list);
        System.out.println(String.format("打乱 %s", list));
    
        /**
         * 移除所有 NULL
         */
        list.removeIf(Objects::isNull);
    
        /**
         * 去重
         */
        list = list.stream().distinct().collect(Collectors.toList());
    
        /**
         * 分组
         */
        Map<String, List<Integer>> collect = list.stream()
                .collect(Collectors.groupingBy(Object::toString));
    
        /**
         * 查找一个元素
         */
        Integer integer = list.stream().filter(item -> {
            return item == 1;
        }).findAny().orElse(null);
        
    }
```

## Set
> Set不能有重复元素

### HashSet `Set`
- 线程不安全
- 利用 HashMap 的 Key 值进行存储。
- 无序
- 利用Hash存储，存取和查找高效。

### LinkedHashSet `Set`
- 线程不安全
- 利用 LinkedHashMap 的 Key 值进行存储。
- 按插入排序

### TreeSet `Set`
- 线程不安全
- 利用 TreeMap 的 Key 值进行存储。
- 插入有序, 默认自然排序。


## Queue
> Queue保持一个队列(先进先出)的顺序.

### PriorityQueue `Queue`
- 线程不安全
- 数组实现

### Deque `Queue`
- 双端队列
##### ArrayDeque `Queue`
- 数组实现
- 线程不安全
- 动态长度

### BlockingQueue

### DelayQueue

## Map
> 用于保存具有"映射关系"的数据
### HashMap
- 不能保证key-value对的顺序
- 线程不安全

### LinkedHashMap
- 插入顺序
- 线程不安全

### TreeMap
- 线程不安全
- 插入有序, 默认自然排序。

### ConcurrentHashMap 
- 线程安全
- 特点: 分多个块

## 整理了两张图
![map.png](http://cdn.hocgin.top/map.png)
![集合.png](http://cdn.hocgin.top/%E9%9B%86%E5%90%88.png)

[推荐](https://www.kancloud.cn/this_is_lxf/javabase/210926)