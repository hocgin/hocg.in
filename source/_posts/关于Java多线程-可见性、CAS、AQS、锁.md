------
title: 关于Java多线程-可见性、CAS、AQS、锁
date: 2018-03-03 09:13:39
tags:
  - Java
  - 多线程
categories:
  - Java
------
关于Java多线程-可见性、CAS、AQS、锁

<!--more-->
## 前提
> 解决多线程操作出现的脏读和数据、操作不一致问题。

### volatile`可见性`
> Java 内存分为主内存和工作内存。  
> 正常情况每个线程都拥有自己的工作内存，然后每隔一段时间会同步到主内存上，因此会存在不一致的情况。而`volatile`则是为了让标记字段的读取和写入都是在主内存中，保证其一致性。  
> `注意:`但其仍不能保证写入操作的原子性。

### CAS
> `Compare And Swap`, 比较并交换。用于解决多线程使用锁造成的性能损耗。  
> Java 是利用`Unsafe`来实现CAS，进行硬件级别的原子性操作。

### AQS
> `AbstractQueuedSynchronizer`, 这个为 Java 类, 公平锁`FairSync`和非公平锁`NonfairSync`均是通过此实现的。  
> 其利用队列来实现阻塞锁和同步。

#### ABA 问题
> 情景: 初始值为A[线程1获取的值为A][线程2获取的值为A,并更改值A为值B,再更改值B为值A][线程1更改值A为值B]。  
> 出现问题: 线程1感觉不到值有一段变化的过程，这是`乐观锁`出现的问题。  
> 解决方案: `AtomicStampedReference`/`AtomicMarkableReference`你值得拥有。

- AtomicStampedReference 每次修改会存储版本号,版本号实现用int。
- AtomicMarkableReference 每次修改会存储版本号,版本号实现用boolean。

-----
## 锁的名词
### 可重入锁
- 已获取的锁可以不必去重新申请。  
- synchronized/ReentrantLock 是可重入锁.

### 可中断锁
- 可以取消申请锁的操作。
- synchronized 不是可中断锁。

### 公平锁
- 公平锁是根据请求顺序分发锁, 唤醒需要时间，能保- 证操作的顺序。  
- 非公平锁会出现插队情况，性能高，但是不能保证操作的顺序。  
- synchronized 不是公平锁。
- `ReentrantLock`/`ReentrantReadWriteLock`默认情况是非公平锁`NonfairSync`,但可以设置为公平锁`FairSync`

### 乐观锁
> 每次不加锁，假设没有冲突去完成某项操作，如果因为冲突失败就重试，直到成功为止。

#### Atomic* `乐观锁`
> 由于在多线程操作中无法保证操作的原子性，因此引入了锁和CAS。  
> `AtomicStampedReference`/`AtomicMarkableReference` 用于解决 CAS 的 ABA 问题

##### 单
- AtomicInteger `Integer类型`
- AtomicLong `Long类型`
- AtomicBoolean `Boolean类型`,内部使用int实现。
- AtomicReference `对象类型`

##### 数组
- AtomicIntegerArray `Integer数组`
- AtomicLongArray `Long数组`
- AtomicReferenceArray `对象数组`

##### 对象内字段
- AtomicIntegerFieldUpdater `对象内Integer类型字段`
- AtomicLongFieldUpdater `对象内Long类型字段`
- AtomicReferenceFieldUpdater `对象内对象类型字段`

##### 根据版本号进行操作
- AtomicStampedReference 每次修改会存储版本号,版本号实现用int。
- AtomicMarkableReference 每次修改会存储版本号,版本号实现用boolean。

-----
## 锁和同步
1. 锁和同步的作用  
保证代码区域在同一时间只运行一个线程去执行,`其余线程处于阻塞状态(BLOCKED)`。

2. 锁和同步的差异。
- 作用范围, Lock 可以跨方法，synchronized 只能在同一个方法中。
- 公平锁, Lock 使用公平锁，synchronized 使用非公平锁。
- 可中断，Lock 可以使用`lockInterruptibly()`中断锁，synchronized 无法中断。
- 当 synchronized 无法访问时会被阻塞，Lock 提供`tryLock()`减少阻塞时间。

3. 不释放锁操作
- 同步代码中使用`Thread.sleep`/`Thread.yield`, 线程处于`WAITING`/`TIMED_WAITING`状态
- 同步代码中线程被`suspend()`

4. 会释放锁操作
- 同步代码被break、return
- 同步代码被异常或错误终止
- 同步代码块执行结束
- 同步代码块被 wait(), 线程处于`WAITING`/`TIMED_WAITING`状态


-----
## 锁`Lock`的相关实现
> `NonfairSync`、`FairSync`

### ReentrantLock
```java
        
    /**
     * 可重入锁
     * 已获取的锁可以不必去重新申请。
     * 例如：
     * synchronized(lock){
     *     synchronized(lock){
     *         //..
     *     }
     * }
     */
    @Test
    public void reentrantLock() {
        ReentrantLock lock = new ReentrantLock();
        System.out.println(String.format("是否公平锁 %b", lock.isFair())); // 是否公平锁 false
        /**
         * 可重入锁, 在同一个线程内不用反复申请锁(只是计数+1)。
         * 如果不同线程会尝试关掉当前线程(interrupt)
         */
        lock.lock();
        System.out.println(String.format("该锁是否已被获取 %b", lock.isHeldByCurrentThread())); // 该锁是否已被获取 true
        System.out.println(String.format("是否有线程在等待获取该锁 %b", lock.hasQueuedThreads())); // 是否有线程在等待获取该锁 false
        lock.lock();
        System.out.println(String.format("该锁是否已被获取 %b", lock.isHeldByCurrentThread())); // 该锁是否已被获取 true
        System.out.println(String.format("是否有线程在等待获取该锁 %b", lock.hasQueuedThreads())); // 是否有线程在等待获取该锁 false
        lock.unlock();
        System.out.println(String.format("该锁是否已被获取 %b", lock.isHeldByCurrentThread())); // 该锁是否已被获取 true
        System.out.println(String.format("是否有线程在等待获取该锁 %b", lock.hasQueuedThreads())); // 是否有线程在等待获取该锁 false
        lock.unlock();
        System.out.println(String.format("该锁是否已被获取 %b", lock.isHeldByCurrentThread())); // 该锁是否已被获取 false
        System.out.println(String.format("是否有线程在等待获取该锁 %b", lock.hasQueuedThreads())); // 是否有线程在等待获取该锁 false
    }
```






### ReentrantReadWriteLock
> 读写锁

```java
    /**
     * 读写锁
     * 读锁 & 读锁 之间不会堵塞
     * 写锁 & 读锁/写锁 都会发生堵塞
     */
    @Test
    public void reentrantReadWriteLock() throws InterruptedException {
        ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    
        Runnable rRunable = () -> {
            lock.readLock().lock();
            System.out.println(String.format("获取 %s锁 %s", lock.isWriteLocked()?"写":"读", Thread.currentThread().getName()));
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(String.format("关掉 %s锁 %s", lock.isWriteLocked()?"写":"读", Thread.currentThread().getName()));
            lock.readLock().unlock();
        };
        Runnable wRunable = () -> {
            lock.writeLock().lock();
            System.out.println(String.format("获取 %s锁 %s", lock.isWriteLocked()?"写":"读", Thread.currentThread().getName()));
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(String.format("关掉 %s锁 %s", lock.isWriteLocked()?"写":"读", Thread.currentThread().getName()));
            lock.writeLock().unlock();
        };
        Thread rthread = new Thread(rRunable);
        Thread rthread2 = new Thread(rRunable);
        Thread wthread = new Thread(wRunable);
        Thread wthread2 = new Thread(wRunable);
    
        /**
         * 读->写->读
         *
         * 获取 读锁 Thread-1
         * 关掉 读锁 Thread-1
         * 获取 写锁 Thread-3
         * 关掉 写锁 Thread-3
         * 获取 读锁 Thread-2
         * 关掉 读锁 Thread-2
         */
//        System.out.println("读->写->读");
//        rthread.start();
//        Thread.sleep(100);
//        wthread.start();
//        Thread.sleep(100);
//        rthread2.start();
    
    
        /**
         * 读->读->写
         * 获取 读锁 Thread-1
         * 获取 读锁 Thread-2
         * 关掉 读锁 Thread-1
         * 关掉 读锁 Thread-2
         * 获取 写锁 Thread-3
         * 关掉 写锁 Thread-3
         */
//        System.out.println("读->读->写");
//        rthread.start();
//        Thread.sleep(100);
//        rthread2.start();
//        Thread.sleep(100);
//        wthread.start();
    
    
        /**
         * 写->写->读
         * 获取 写锁 Thread-3
         * 关掉 写锁 Thread-3
         * 获取 写锁 Thread-4
         * 关掉 写锁 Thread-4
         * 获取 读锁 Thread-1
         * 关掉 读锁 Thread-1
         */
        System.out.println("写->写->读");
        wthread.start();
        Thread.sleep(100);
        wthread2.start();
        Thread.sleep(100);
        rthread.start();
    

        Thread.sleep(5000);
        
    }
```


### StampedLock
> 邮票锁, ReentrantReadWriteLock 的升级版
> 写锁、读锁、新增(乐观读锁、锁的转换)

```java
    
    /**
     * 邮票锁
     * @throws InterruptedException
     */
    @Test
    public void stampedLock() throws InterruptedException {
        StampedLock lock = new StampedLock();
        int demo = 0;
        
        /**
         * 写锁
         */
        long stamp = lock.writeLock();
        try {
            demo = 1;
        }finally {
            lock.unlockWrite(stamp);
        }
    
    
        /**
         * 读锁
         */
        stamp = lock.readLock();
        try {
            System.out.println(demo);
        }finally {
            lock.unlockRead(stamp);
        }
    
        /**
         * 乐观读锁
         * 一般情况读写并不冲突，但也可以通过检测申请乐观读锁后是否有写锁被申请，如果有可以再进行重新申请为读锁。
         */
        stamp = lock.tryOptimisticRead();
        if (!lock.validate(stamp)) {
            stamp = lock.readLock();
            try {
                System.out.println(demo);
            } finally {
                lock.unlockRead(stamp);
            }
        } else {
            System.out.println(demo);
        }
    
    }
```

-----
## Synchronized
### 使用级别
- 实例对象函数`this锁`
- 静态函数`class锁`
- 代码块`指定的锁`

```java
public class SynchronizedTest {
    
    /**
     * 当线程1同步块正在执行，线程2处于阻塞状态(BLOCKED)
     *
     * @throws InterruptedException
     */
    @Test
    public void state() throws InterruptedException {
        Runnable runnable = () -> {
            synchronized (SynchronizedTest.class) {
                try {
                    // 不会让出锁
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        };
        Thread thread = new Thread(runnable);
        Thread thread2 = new Thread(runnable);
        thread.start();
        thread2.start();
        Thread.sleep(100);
        System.out.println(String.format("阻塞的线程2(%s) 状态: %s", thread2.getName(), thread2.getState())); // 阻塞的线程2(Thread-2) 状态: BLOCKED
    }
    
    /**
     * 多个同步块共用一把锁, 当线程1同步块1正在执行，线程2在同步块2处于阻塞状态(BLOCKED)
     */
    @Test
    public void multiSync() throws InterruptedException {
        class Demo {
            private final Object LOCK = new Object();
            
            public void sync1() throws InterruptedException {
                synchronized (LOCK) {
                    Thread.sleep(1000);
                }
            }
            
            public void sync2() {
                synchronized (LOCK) {
                    System.out.println("执行中..");
                }
            }
        }
        
        Demo demo = new Demo();
        
        Thread thread = new Thread(() -> {
            try {
                demo.sync1();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        Thread thread2 = new Thread(demo::sync2);
        thread.start();
        thread2.start();
        
        Thread.sleep(100);
        System.out.println(String.format("阻塞的线程2(%s) 状态: %s", thread2.getName(), thread2.getState())); // 阻塞的线程2(Thread-2) 状态: BLOCKED
        
    }
    
    /**
     * 死锁
     *
     * @throws InterruptedException
     */
    @Test
    public void deadlock() throws InterruptedException {
        Object LOCK = new Object();
        Object LOCK2 = new Object();
        
        Thread thread = new Thread(() -> {
            synchronized (LOCK) {
                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (LOCK2) {
                    ;
                }
            }
        });
        Thread thread2 = new Thread(() -> {
            synchronized (LOCK2) {
                synchronized (LOCK) {
                    ;
                }
            }
        });
        thread.start();
        thread2.start();
        
        Thread.sleep(100);
        
        boolean b = thread.getState().equals(Thread.State.BLOCKED) && thread2.getState().equals(Thread.State.BLOCKED);
        if (b) {
            System.out.println(String.format("%s 和 %s 死锁", thread.getName(), thread2.getName()));
        } else {
            System.out.println("未发生死锁");
        }
        // Thread-1 和 Thread-2 死锁
    }
    
}
```