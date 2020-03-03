------
title: 关于Java多线程-几个辅助类
date: 2018-03-06 17:13:39
tags:
  - Java
  - 多线程
categories:
  - Java
------
关于Java多线程-几个辅助类，后期继续整理

<!--more-->
## 几个辅助类
- CountDownLatch 计数器
- CyclicBarrier 同步器
- Phaser `1.7` 阶段性、同步、计数

### Example
```java
    ExecutorService executorService = Executors.newFixedThreadPool(4);
    
    /**
     * 计数器 latch.await() 会等待计数为 0
     * @throws InterruptedException
     */
    @Test
    public void countDownLatch() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(4);
        LongStream.range(0, 4).forEach((i)->{
            executorService.submit(latch::countDown);
            System.out.println(String.format("index: %d", latch.getCount()));
        });
    
        latch.await();
        System.out.println(String.format("index: %d", latch.getCount()));
//        index: 4
//        index: 3
//        index: 2
//        index: 1
//        index: 0
    }
    
    /**
     * 等待指定数目的线程完成后, 才继续执行
     * @throws InterruptedException
     */
    @Test
    public void cyclicBarrier() throws InterruptedException {
        CyclicBarrier cyclicBarrier = new CyclicBarrier(4, ()->{
            System.out.println("所有任务执行完成，继续");
        });
        LongStream.range(0, 4).forEach((i)->{
            executorService.submit(()->{
                try {
                    System.out.println(String.format("已经完成数目: %d/%d", cyclicBarrier.getNumberWaiting(), cyclicBarrier.getParties()));
                    Thread.sleep(100);
                    cyclicBarrier.await();
                } catch (InterruptedException | BrokenBarrierException e) {
                    e.printStackTrace();
                }
                System.out.println(String.format("进行其他任务 %s", Thread.currentThread().getName()));
            });
        });
    
        Thread.sleep(1000);
        
//        已经完成数目: 0/4
//        已经完成数目: 0/4
//        已经完成数目: 0/4
//        已经完成数目: 0/4
//        所有任务执行完成，继续
//        进行其他任务 pool-1-thread-4
//        进行其他任务 pool-1-thread-2
//        进行其他任务 pool-1-thread-1
//        进行其他任务 pool-1-thread-3
    }
    
    /**
     * 配置同时允许申请许可的数目，如果数目已满则进行阻塞等待释放许可。
     * Semaphore 可配置是否使用公平机制，类似Lock
     * @throws InterruptedException
     */
    @Test
    public void semaphore() throws InterruptedException {
        Semaphore semaphore = new Semaphore(2);
        LongStream.range(0, 4).forEach((i)->{
            executorService.submit(()->{
                try {
                    System.out.println(String.format("正在申请许可 ID:%s", Thread.currentThread().getName()));
                    semaphore.acquire();
                    System.out.println(String.format("申请许可成功 %s", Thread.currentThread().getName()));
                    Thread.sleep(100);
                    System.out.println(String.format("进行任务 %s", Thread.currentThread().getName()));
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }finally {
                    System.out.println(String.format("释放许可 %s", Thread.currentThread().getName()));
                    semaphore.release();
                }
            });
        });
        
        Thread.sleep(1000);
    
//        正在申请许可 ID:pool-1-thread-2
//        正在申请许可 ID:pool-1-thread-1
//        申请许可成功 pool-1-thread-2
//        正在申请许可 ID:pool-1-thread-4
//        正在申请许可 ID:pool-1-thread-3
//        申请许可成功 pool-1-thread-1
//        进行任务 pool-1-thread-1
//        进行任务 pool-1-thread-2
//        释放许可 pool-1-thread-1
//        释放许可 pool-1-thread-2
//        申请许可成功 pool-1-thread-4
//        申请许可成功 pool-1-thread-3
//        进行任务 pool-1-thread-4
//        进行任务 pool-1-thread-3
//        释放许可 pool-1-thread-4
//        释放许可 pool-1-thread-3
        
    }
    
    /**
     * 阶段性, 会等待所有人完成该步骤再进入下一个步骤
     * - 每个阶段均可进行加入或移除
     *
     * 函数
     * - arriveAndAwaitAdvance 等待阶段
     * - arriveAndDeregister 移除
     * - bulkRegister 加入
     */
    @Test
    public void phaser() throws InterruptedException {
        Phaser phaser = new Phaser(4);
        /**
         * 阶段性任务
         */
        System.out.println("【阶段性任务】");
        LongStream.range(0, 4).forEach((i)->{
            executorService.submit(()->{
                try {
                    System.out.println(String.format("第一步 %s", Thread.currentThread().getName()));
                    Thread.sleep(100);
                    phaser.arriveAndAwaitAdvance();
                    
                    Thread.sleep(100);
                    System.out.println(String.format("第2步 %s", Thread.currentThread().getName()));
                    phaser.arriveAndAwaitAdvance();
                    
                    Thread.sleep(100);
                    System.out.println(String.format("第三步 %s", Thread.currentThread().getName()));
                    phaser.arriveAndAwaitAdvance();
                    
                    System.out.println("Done");
                }catch (InterruptedException e) {
                    e.printStackTrace();
                }
    
            });
        });
    
        Thread.sleep(1000);
    
    
        /**
         * 计数任务
         */
        System.out.println("【计数任务】");
        LongStream.range(0, 4).forEach((i)->{
            executorService.submit(()->{
                try {
                    System.out.println(String.format("已经完成 %s", Thread.currentThread().getName()));
                    Thread.sleep(100);
                    phaser.awaitAdvance(phaser.getPhase()); //cyclicBarrier.await();
                }catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
        });
        phaser.arrive();
        System.out.println("计数完成");
        
//        【阶段性任务】
//        第一步 pool-1-thread-2
//        第一步 pool-1-thread-3
//        第一步 pool-1-thread-1
//        第一步 pool-1-thread-4
//        第2步 pool-1-thread-2
//        第2步 pool-1-thread-1
//        第2步 pool-1-thread-4
//        第2步 pool-1-thread-3
//        第三步 pool-1-thread-1
//        第三步 pool-1-thread-4
//        第三步 pool-1-thread-2
//        第三步 pool-1-thread-3
//        Done
//        Done
//        Done
//        Done
//       【计数任务】
//        计数完成
//        已经完成 pool-1-thread-2
//        已经完成 pool-1-thread-4
//        已经完成 pool-1-thread-3
//        已经完成 pool-1-thread-1
    }
```