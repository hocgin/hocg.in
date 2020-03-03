------
title: 关于Java-Unsafe/LockSupport
date: 2018-03-02 10:02:39
tags:
  - 多线程
  - 锁
categories:
  - Java
------
关于Java Unsafe/LockSupport

<!--more-->
## Unsafe
> 一个高效底层函数，可以实现内存管理、对象实例化(不通过构造函数)、操作函数+类+变量(通过使用地址)、多线程同步(挂起`锁`、CAS)、挂起和恢复、数组、内存屏障。

### 具体实践代码
> Unsafe 中在高并发和高性能的场景下具有显著的效果。

```java
package in.hocg.lock;

import org.junit.jupiter.api.Test;
import sun.misc.Unsafe;

import java.lang.reflect.Field;

/**
 * Created by hocgin on 2018/3/2.
 * email: hocgin@gmail.com
 */
public class UnsafeTest {
    static class Demo {
        private Integer integer;
        
        static {
            System.out.println("static{}");
        }
        
        {
            System.out.println("{}");
        }
        
        public Demo() {
            integer = 0;
            System.out.println("Demo()");
        }
        
        public Integer getInteger() {
            System.out.println("getInteger()");
            return integer;
        }
        
        public void setInteger(Integer integer) {
            System.out.println("setInteger()");
            this.integer = integer;
        }
    }
    
    /**
     * 使用 Unsafe 创建对象，不会调用构造函数。
     *
     * @throws NoSuchFieldException
     * @throws IllegalAccessException
     * @throws InstantiationException
     */
    @Test
    public void instantiation() throws NoSuchFieldException, IllegalAccessException, InstantiationException {
        Demo o = ((Demo) getUnsafe().allocateInstance(Demo.class));
        System.out.println(String.format("hashCode:: %d", o.hashCode()));
        // 此处会打印 "static{}" 因此仍然会执行静态代码块内容
    }
    
    /**
     * 使用 Unsafe 修改私有字段
     */
    @Test
    public void altering() throws NoSuchFieldException, IllegalAccessException {
        Demo demo = new Demo();
        Field field = demo.getClass().getDeclaredField("integer");
        
        Unsafe unsafe = getUnsafe();
        unsafe.putObject(demo, unsafe.objectFieldOffset(field), 1);
        System.out.println(String.format("getInteger() = %d", demo.getInteger()));
    }
    
    
    /**
     * 使用 Unsafe 抛出异常
     *
     * @throws NoSuchFieldException
     * @throws IllegalAccessException
     */
    @Test
    public void throwing() throws NoSuchFieldException, IllegalAccessException {
        getUnsafe().throwException(new NullPointerException());
    }
    
    /**
     * 分配一块GC无法管理的内存区域
     */
    @Test
    public void memory() throws NoSuchFieldException, IllegalAccessException {
        Unsafe unsafe = getUnsafe();
        
        int size = 1024;
        // 分配内存地址
        long address = unsafe.allocateMemory(size * 1);
        // 写入
        unsafe.putInt(address + 4 * 1, 100);
        // 读取
        int i = unsafe.getInt(address + 4 * 1);
        System.out.println(i);
    
        // 释放内存
        unsafe.freeMemory(address);
        
    }
    
    /**
     * 进行CAS操作，单纯使用 Java 并不能有效的解决CAS操作, 其主要通过 Unsafe 使用硬件级别来解决CAS操作
     * @throws NoSuchFieldException
     * @throws IllegalAccessException
     */
    @Test
    public void cas() throws NoSuchFieldException, IllegalAccessException {
        Unsafe unsafe = getUnsafe();
        Demo demo = new Demo();
        Field field = demo.getClass().getDeclaredField("integer");
    
    
        /**
         * compareAndSwapXXX
         * 参数
         * 1. 指定对象
         * 2. 字段的偏移地址
         * 3. 当前值
         * 4. 期望值
         * 返回值
         *   "认为的旧值"=="实际旧值",修改成"期望值"再返回 True: 修改成功
         *   "认为的旧值"!="实际旧值",直接返回 False: 修改失败
         */
        boolean state; // CAS 状态
        Integer integer1 = 0; // 认为的旧值
        Integer integer2 = demo.getInteger(); // 实际旧值
        int o1 = 1; // 期望值
        while (!(state = unsafe.compareAndSwapObject(demo, unsafe.objectFieldOffset(field), integer1, o1))) {
            System.out.println("再次尝试修改");
        }
        System.out.println(String.format("1 .CAS State: %b, 认为的旧值 %d, 实际旧值 %d, 期望值 %d", state, integer1, integer2, o1));
    
    
        integer2 = demo.getInteger(); // 实际旧值
        state = unsafe.compareAndSwapObject(demo, unsafe.objectFieldOffset(field), integer1, o1);
        System.out.println(String.format("2 .CAS State: %b, 认为的旧值 %d, 实际旧值 %d, 期望值 %d", state, integer1, integer2, o1));
    }
    
    /**
     * 利用OS底层的方式来实现挂起，相较于Object.wait()拥有更好的性能
     * @throws NoSuchFieldException
     * @throws IllegalAccessException
     * @throws InterruptedException
     */
    @Test
    public void park() throws NoSuchFieldException, IllegalAccessException, InterruptedException {
        Unsafe unsafe = getUnsafe();
        Thread thread = new Thread(() -> {
            /**
             * 参数
             * 1. isAbsolute, 是否为绝对时间。
             * 2. time, 第一个参数(isAbsolute)为 True 时该参数应为纳秒, False 时该参数应为毫秒。0为无线等待，直到unpark。
             */
            unsafe.park(false, 0); // 挂起 -> WAITING
        });
    
        thread.start();
        Thread.sleep(100);
        System.out.println(String.format("线程 %s 状态 %s", thread.getName(), thread.getState()));
    
        Thread.sleep(100);
        unsafe.unpark(thread);
        Thread.sleep(100);
        System.out.println(String.format("线程 %s 状态 %s", thread.getName(), thread.getState()));
    }
    
    
    /**
     * Basic
     * Unsafe unsafe = Unsafe.getUnsafe();
     *
     * @return
     * @throws IllegalAccessException
     * @throws NoSuchFieldException
     */
    public static Unsafe getUnsafe() throws IllegalAccessException, NoSuchFieldException {
        Field f = Unsafe.class.getDeclaredField("theUnsafe");
        f.setAccessible(true);
        return (Unsafe) f.get(null);
    }
}
```

## LockSupport
> 其本质是`Unsafe`的薄封装。

```java
    
    @Test
    public void park() throws InterruptedException {
        Thread thread = new Thread(() -> {
            /**
             * 进行挂起
             * 本质使用 UNSAFE.park(false, 0L);
             */
            LockSupport.park();
        });
        thread.start();
    
        
        Thread.sleep(1000);
        System.out.println(String.format("挂起线程状态 %s", thread.getState())); // WAITING
        /**
         * 进行解除
         * 本质使用 UNSAFE.unpark(thread)
         */
        LockSupport.unpark(thread);
        Thread.sleep(100);
        System.out.println(String.format("解除挂起线程状态 %s", thread.getState())); // TERMINATED
    }
    
    @Test
    public void blocker() throws InterruptedException {
        Thread thread = new Thread(()->{
            /**
             * 线程内部有个 parkBlocker 字段, LockSupport 本质上使用 Unsafe 进行内存修改。
             */
            LockSupport.park("sdas");
        });
        thread.start();
        Thread.sleep(100);
        System.out.println(String.format("挂起 %s", LockSupport.getBlocker(thread))); // 挂起 sdas
        
        LockSupport.unpark(thread);
        Thread.sleep(100);
        System.out.println(String.format("解除挂起 %s", LockSupport.getBlocker(thread))); // 解除挂起 null
        
    }
```

### 阻塞和解除阻塞
> 总结: 使用`LockSupport`更具有灵活性。

```java
    public static final Object LOCK = new Object();
    
    /**
     * notifyAll 实现
     * @throws InterruptedException
     */
    @Test
    public void notifyAll2() throws InterruptedException {
        Runnable runnable = () -> {
            System.out.println(String.format("开始运行 %s", Thread.currentThread().getName()));
            synchronized (LOCK) {
                try {
                    LOCK.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            System.out.println(String.format("解除锁 %s", Thread.currentThread().getName()));
        };
        CompletableFuture.allOf(CompletableFuture.runAsync(runnable),
                CompletableFuture.runAsync(runnable), CompletableFuture.runAsync(runnable), CompletableFuture.runAsync(runnable));
        
        Thread.sleep(1000);
        synchronized (LOCK) {
            LOCK.notify();
            System.out.println("通知完毕");
        }
    }
    
    /**
     * unpark 通知所有需自己实现
     * @throws InterruptedException
     */
    @Test
    public void unparkAll() throws InterruptedException {
        List<Thread> threads = Collections.synchronizedList(new ArrayList<>());
        
        Runnable runnable = () -> {
            Thread thread = Thread.currentThread();
            threads.add(thread);
            System.out.println(String.format("开始运行 %s", thread.getName()));
            LockSupport.park();
            System.out.println(String.format("解除锁 %s", thread.getName()));
        };
        CompletableFuture<Void> future = CompletableFuture.allOf(CompletableFuture.runAsync(runnable),
                CompletableFuture.runAsync(runnable), CompletableFuture.runAsync(runnable), CompletableFuture.runAsync(runnable));
    
        Thread.sleep(1000);
        for (Thread thread : threads) {
            LockSupport.unpark(thread);
        }
        System.out.println("通知完毕");
    }
```


### park/unpark 与 wait/notify 总结
相比于使用 `Object.wait`/`Object.notify`,`LockSupport.unpark`/`LockSupport.park` 更具有灵活性。
1. 不局限于同步块内
2. 灵活的 API(例如时间)
3. 可指定唤醒(当多个进入wait时Object.notify是随机唤醒其中一个)。