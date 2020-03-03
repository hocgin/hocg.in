------
title: Java线程池和锁-小记
date: 2017-10-07 01:03:29
tags:
  - Java
  - Tips
categories:
  - Java
------
提取想要的apk， 例如CM ROM包中的含天气的时钟不错！

<!--more-->
## 并发
### 线程池
- ExecutorService
```java
public class ConcurrencyMain {
	public static void main(String[] args) throws InterruptedException {
ExecutorService executor = Executors.newWorkStealingPool();
		
		List<Callable<String>> callables = Arrays.asList(
				() -> "task1",
				() -> "task2",
				() -> "task3");
		
		executor.invokeAll(callables)
				.stream()
				.map(future -> {
					try {
						return future.get();
					} catch (Exception e) {
						throw new IllegalStateException(e);
					}
				})
				.forEach(System.out::println);
	}
}
```
- ScheduledExecutorService
```java
public class ConcurrencyMain {
	public static void main(String[] args) throws InterruptedException {
		ScheduledExecutorService executor = Executors.newScheduledThreadPool(3);
		
		ScheduledFuture<?> future = executor.schedule(() -> System.out.println("执行延迟任务"), 2, TimeUnit.SECONDS);
		
		TimeUnit.MILLISECONDS.sleep(1000);
		
		long remainingDelay = future.getDelay(TimeUnit.MILLISECONDS);
		System.out.println(String.format("剩余延迟时间: %sms", remainingDelay));
		
	}
}
```
**区别** 两者的区别是`ScheduledExecutorService`是可延迟执行。

### 同步(Synchronized)
1. 对象锁  
**语法:** 
```java
public class SynchronizedMain {
	public static void main(String[] args) {
		
		// ==[测试一:同一对象]==
		// 结果: 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
		Test t1 = new Test();
		Thread runnable1 = new Thread(() -> t1.exec());
		Thread runnable2 = new Thread(() -> t1.exec());
		runnable1.start();
		runnable2.start();
		
		// ==[测试二:不同一对象]==
		// 结果: 0 0 1 2 3 4 5 6 7 1 2 3 4 5 6 7 8 9 8 9
		Test t2 = new Test();
		Thread runnable3 = new Thread(() -> t1.exec());
		Thread runnable4 = new Thread(() -> t2.exec());
		runnable3.start();
		runnable4.start();
	
	}
}

// 以下两种方式等价，仅作用范围不一样。
class Test {
	public synchronized void exec() {
		for (int i = 0; i < 10; i++) {
			System.out.printf(i + " ");
		}
	}

    public void exec() {
		synchronized (this) {
			for (int i = 0; i < 10; i++) {
				System.out.printf(i + " ");
			}
		}
	}
}
```
**结论:** 同一对象调用该方法是锁定的，不同对象不会进行锁定。  
2. 类锁
```java
public class SynchronizedMain {
	public static void main(String[] args) {
		// ==[测试一:同一对象]==
		// 结果: 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
		Test t1 = new Test();
		Thread runnable1 = new Thread(() -> t1.exec());
		Thread runnable2 = new Thread(() -> t1.exec());
		runnable1.start();
		runnable2.start();
		
		// ==[测试二:不同一对象]==
		// 结果: 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
		Test t2 = new Test();
		Thread runnable3 = new Thread(() -> t1.exec());
		Thread runnable4 = new Thread(() -> t2.exec());
		runnable3.start();
		runnable4.start();
	
	}
}

// 以下两种方式等价
class Test {
	private static Object lock = new Object();
	public  void exec() {
		synchronized (lock) {
			for (int i = 0; i < 10; i++) {
				System.out.printf(i + " ");
			}
		}
	}
    
    public void exec() {
		synchronized (Test.class) {
			for (int i = 0; i < 10; i++) {
				System.out.printf(i + " ");
			}
		}
	}
}
```
**结论:** 该方式锁的作用范围是整个类。

2. 指定锁  
**语法:** 
```java
public class SynchronizedMain {
	private static Object lock = new Object();
	public static void main(String[] args) {
		
		// ==[测试一:同一对象]==
		// 结果: 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
		Test t1 = new Test();
		Thread runnable1 = new Thread(() -> t1.exec(lock));
		Thread runnable2 = new Thread(() -> t1.exec(lock));
		runnable1.start();
		runnable2.start();
		
		// ==[测试二:不同一对象]==
		// 结果: 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
		Test t2 = new Test();
		Thread runnable3 = new Thread(() -> t1.exec(lock));
		Thread runnable4 = new Thread(() -> t2.exec(lock));
		runnable3.start();
		runnable4.start();
	
	}
}

class Test {
	public void exec(Object lock) {
		synchronized (lock) {
			for (int i = 0; i < 10; i++) {
				System.out.printf(i + " ");
			}
		}
	}
}
```
**结论:** 该方式取决于传入的锁。**当对象属性发生改变时，锁就失去了作用。**

对于 Java8 中，`ReentrantLock` 可实现锁的作用。