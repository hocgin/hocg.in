------
title: 关于Java并发-线程
date: 2018-02-27 01:13:39
tags:
  - Java
  - 多线程
categories:
  - Java
------
关于Java并发-线程

<!--more-->
## 并发和并行
并行: 多核同时执行  
并发: 单核切换执行

![v2-674f0d37fca4fac1bd2df28a2b78e633_hd.jpg](http://cdn.hocgin.top/v2-674f0d37fca4fac1bd2df28a2b78e633_hd.jpg)

-----
## 线程
### 线程状态`Thread.State`
> `@since 1.5`
> 关于 Java Thread 状态不得不说的故事(网络上各种版本)..

**线程的状态**
![线程状态图片](http://www.baeldung.com/wp-content/uploads/2018/02/Life_cycle_of_a_Thread_in_Java.jpg)
[原文URL](http://www.baeldung.com/java-thread-lifecycle)

### 多线程操作
> 关于`wait`和`notify`此处涉及到线程中的几个状态，请勿混淆。

**使用`wait`/`notify`对线程进行操作**
![使用wait/notify对线程进行操作](http://www.baeldung.com/wp-content/uploads/2018/02/Java_-_Wait_and_Notify.png)
[使用wait/notify对线程进行操作](http://www.baeldung.com/java-wait-notify)

### 可能的误区
1. 子线程被关闭，子线程所开启的子线程(子子线程)会不会被关闭？
答案: 不会的, 子线程的子线程本质上和子线程是同一等级的并不会被其影响。

2. 守护线程什么情况会被关闭？
答案: 1. 守护线程执行完(自然关闭)。 2.所有用户线程的关闭(强行关闭)

3. 什么是守护线程？
答案: 当线程`t.setDaemon(true)`该线程即为守护线程。铛铛铛，最出名的守护线程GC。

4. 用户线程 和 守护线程 的区别？  
答案: `守护线程[setDaemon(true)]`和`用户线程`大体并没啥区别, 但是守护线程的生命周期是随着所有用户线程的关闭而退出的。

5. 如何杀死一个Java线程？  
答案: Java已经不推荐使用`stop`进行线程的关闭了。如果线程是那种持久型操作类型的，建议开辟一个守护类型的线程进行回收(想法参照Go)。
```java
    @Test
    public void interrupt() throws InterruptedException {
        Thread thread = new Thread(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                System.out.println("Do something");
            }
        });
        thread.start();
        
        Thread.sleep(100);
        System.out.println(String.format("线程 %s 状态 %s", thread.getName(), thread.getState()));
        /**
         * 线程 RUNNABLE 状态会标记为关闭，并不进行关闭。
         * 线程 其他 状态会标记并进行关闭。
         * - 已经不推荐使用 thread.stop(); 可能会引起资源问题。
         */
        thread.interrupt();
        Thread.sleep(100);
        System.out.println(String.format("线程 %s 状态 %s", thread.getName(), thread.getState()));
    }
```

-----
## 线程池
### 前置
- Runable 无返回值
- Callable 有返回值
- Future 返回结果

### newCachedThreadPool()
> 创建一个可缓存的线程池，其指定线程池中线程的存活时间，默认为 60s。

```java
    public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                      60L, TimeUnit.SECONDS,
                                      new SynchronousQueue<Runnable>());
    }
```

> 这边源码有注释:当你想实现一些缓存相关的细节(如超时时间)，应该自己使用`ThreadPoolExecutor`的构造函数来创建。

### newSingleThreadExecutor
> 创建一个新的单线程Executor，其指定线程池中线程最大数量为1。

```java
    public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>()));
    }
```

> 1. 此处为何使用`门面模式`呢？注释写明只暴露`ExecutorService`接口的方法, 应该是为了防止强制使用`ThreadPoolExecutor`相关函数。
> 2. 相比于`newFixedThreadPool(1)`, 该函数保证不会被重新分配到其他的线程。

### newFixedThreadPool
> 创建一个固定大小的线程池
```java
    public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>());
    }
```

> 注释中说明: 提交的任务线程将一直存在，直到使用 ExecutorService#shutdown 进行退出


### newScheduledThreadPool  
> 创建一个固定大小且可定时的线程池

```java
    public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
        return new ScheduledThreadPoolExecutor(corePoolSize);
    }
```
### newSingleThreadScheduledExecutor 
> 创建一个大小为1且可定时的线程池

```java
    public static ScheduledExecutorService newSingleThreadScheduledExecutor() {
        return new DelegatedScheduledExecutorService
            (new ScheduledThreadPoolExecutor(1));
    }
```

> 同样使用了`门面模式`


### newWorkStealingPool `并行`
> 创建一个并行线程池(并行数目默认为:系统可用线程数目)
> `@since 1.8`

```java
    public static ExecutorService newWorkStealingPool() {
        return new ForkJoinPool
            (Runtime.getRuntime().availableProcessors(),
             ForkJoinPool.defaultForkJoinWorkerThreadFactory,
             null, true);
    }
```

-----
## Fork/Join `并行`
> 使用并行进行操作
> `@since 1.7`

### 相关类/接口说明
- ForkJoinTask 顶层接口, 其实现了`Future`。
  - RecursiveTask 有返回值
  - RecursiveAction 无返回值
- ForkJoinPool 类似`Executor`

#### 案例

```java
/**
* Main.java
* 响应结果:
*   TASK:ForkJoinPool.commonPool-worker-1
*   TASK:ForkJoinPool.commonPool-worker-1
*   TASK:ForkJoinPool.commonPool-worker-2
*   TASK:ForkJoinPool.commonPool-worker-1
*   有效值 4
*   TASK:ForkJoinPool.commonPool-worker-2
*   有效值 5
*   TASK:ForkJoinPool.commonPool-worker-1
*   有效值 6
*   TASK:ForkJoinPool.commonPool-worker-1
*   有效值 7
*   22
**/

    @Test
    public void forkJoinPool() throws ExecutionException, InterruptedException {
        ForkJoinPool forkJoinPool = ForkJoinPool.commonPool();
        IRecursiveTask iRecursiveTask = new IRecursiveTask();
        ForkJoinTask<Integer> task = forkJoinPool.submit(iRecursiveTask);
        System.out.println(task.get());
    }


/**
* IRecursiveTask.java
* .fork() 进行任务分裂，并使用线程进行执行
* .join() 等待执行完成并获取结果
**/
public class IRecursiveTask extends RecursiveTask<Integer> {
    public static AtomicInteger FLAG = new AtomicInteger(0);
    
    @Override
    protected Integer compute() {
        System.out.println("TASK:" + Thread.currentThread().getName());
        FLAG.addAndGet(1);
        if (FLAG.get() > 3) {
            System.out.println(String.format("有效值 %d", FLAG.get()));
            return FLAG.get();
        }
        // 为什么不用 this.fork()？
        // this.fork() 返回的是 this
        Integer join1 = new IRecursiveTask().fork().join();
        Integer join2 = new IRecursiveTask().fork().join();
        return join1 + join2;
    }
}

```

-----
## CompletableFuture/CompletionStage `异步+并行`
> 相比于`1.7`进行了更简便、友好的封装，并增加了异步通知的功能，摆脱了阻塞问题。
> `@since 1.8`

### CompletableFuture
> 1. `CompletableFuture`实现了`CompletionStage`用于进行异步并行,并提供函数让多个`CompletionStage`可以进行组合操作和或操作。

### 静态函数, 返回`CompletionStage`
- CompletableFuture.anyOf 任意一个执行完成
- CompletableFuture.allOf 所有执行完成
- CompletableFuture.supplyAsync 执行单个异步,有返回值(默认使用:ForkJoinPool#commonPool())。
- CompletableFuture.runAsync 执行单个异步,无返回值
- CompletableFuture.completedFuture 设定结果

### CompletionStage 函数
- thenXXX 流的流向(等待上一步执行完成)
  - thenApplyXXX 进行输入的转换(Apply：`有输入有输出`)
  - thenRunXXX 对上一个结果不关心，也没有返回值(Run：`无输入无输出`)
  - thenAcceptXXX 进行输入对处理(Accept：`有输入无输出`)
  - thenAcceptBothXXX(CompletionStage,BiConsumer) 加入CompletionStage, 进行指定处理(`组合操作`，`有输入无输出`)。
  - thenCombineXXX(CompletionStage,BiFunction) 加入CompletionStage, 进行指定处理(`组合操作`，`有输入有输出`)。
- runAfterXXX 运行之后
  - runAfterBothXXX(CompletionStage, Runnable) 加入CompletionStage, 并在其运行后指定执行(`组合操作`，`无输入无输出`)。
  - runAfterEither(CompletionStage, Runnable) (`或操作`)
- 完成
  - whenCompleteXXX 完成之后处理。(有输入无输出)
  - handleXXX 完成之后处理。(有输入有输出)
- 异常处理
  - exceptionally 异常处理。
- 其他
  - .complete() // 立即结束并返回指定的结果
  - .completeExceptionally() //立即异常结束

> 说明: 
> 1. `xxxEither` 加入CompletionStage进行OR操作(与之前的进行对比),取最先返回的结果取其结果值。  
> 2. `xxxAsync` 都是异步执行

-----
## 稍微提一下,线程组
> 为管理 Thread 而存在的，可以进行批量标记、检查。