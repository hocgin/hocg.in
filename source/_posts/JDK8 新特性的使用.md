------
title: JDK8 新特性的使用
date: 2017-10-10 10:02
tags:
  - 语法
  - Java
categories:
  - Java
------
JDK8 新特性的使用
<!--more-->
## JDK8 新特性
### Lambda 表达式 && @FunctionalInterface
Java8 支持了 Lambda 表达式，语法如下:
```java
// 标准式
(形参) -> {
	..代码
}

// 简化式
() -> System.out.print("简化式")

// 案例：
new Thread(() -> System.out.print("run")).run();
```
由于 Lambda 表达式是对`单个函数的接口(interface)`进行简化处理，即要保证接口不能存在后续新增函数声明，这时就需要引入 @FunctionalInterface 进行注解。  
以下是 Java8 下 Runable 接口的声明：
```java
@FunctionalInterface
public interface Runnable {
    /**
     * When an object implementing interface <code>Runnable</code> is used
     * to create a thread, starting the thread causes the object's
     * <code>run</code> method to be called in that separately executing
     * thread.
     * <p>
     * The general contract of the method <code>run</code> is that it may
     * take any action whatsoever.
     *
     * @see     java.lang.Thread#run()
     */
    public abstract void run();
}
```
> 注: @FunctionalInterface 接口内允许有**静态函数实现**和**默认函数实现**。

即如下
```java
interface R2 extends Runnable {
	
    // 默认函数实现
	default String to() {
		return getClass().toString();
	}
	
    // 静态函数实现
	static String in() {
		return "in()";
	}
}
```
这也是 Java8 interface 中的新特性。
------

### 关于 :: 
> 函数的引用 (**静态函数引用**、**构造函数引用**、**特定对象函数引用**)

```java
public class Main {
	
	public static void main(String[] args) {
		// 对构造函数进行引用，简单工厂实现
		Supplier<Car> aNew = Car::new;
		for (int i = 0; i < 3; i++) {
			System.out.println(aNew.get());
		}
		
		// 静态函数引用
		Function<Supplier<Car>, Car> create = Car::create;
		Car car = create.apply(Car::new);
		
		// 特定对象的函数引用    
        // 补充:在 Car 函数中使用 this::to 也是一种
		Function<String, String> to = car::to;
		System.out.println(to.apply("Shanghai"));
	}
	
}


class Car {
	public static Car create(Supplier<Car> carSupplier) {
		return carSupplier.get();
	}
	
	public String to(String address) {
		return String.format("to %s ", address);
	}
}
```
> 注: Function<参数, 返回值> create = Car::create;  
> 测试后发现只支持**最多2个参数**的函数对应 Function, BiFunction。

即, `::` 是对函数进行引用。
------

### 使用 @Repeatable 支持重复注解  
在 Java8 中, 不再限制`相同的注解在同一位置只能声明一次`。  
简单示例:  
```java
public class RepeatableMain {
	
	@Filter("filter-1")
	@Filter("filter-2")
	public static void main(String[] args) {
		for (Method method : RepeatableMain.class.getDeclaredMethods()) {
			System.out.println(Arrays.asList(method.getAnnotations()).toString());
		}
	}
	
	
	@Target(ElementType.METHOD)
	@Retention(RetentionPolicy.RUNTIME)
	@interface Filters {
		Filter[] value();
	}
	
	@Target(ElementType.METHOD)
	@Retention(RetentionPolicy.RUNTIME)
	@Repeatable(Filters.class) // 指定多注解的注解类
	@interface Filter {
		String value();
	}
}
```
------

### 新增注解支持类型
> ElementType.TYPE_PARAMETER  
> ElementType.TYPE_USE
```java
public class Annotations {
	@Retention(RetentionPolicy.RUNTIME)
	@Target({ElementType.TYPE_USE, ElementType.TYPE_PARAMETER})
	public @interface Both {
	}
	
	@Retention(RetentionPolicy.RUNTIME)
	@Target({ElementType.TYPE_PARAMETER})
	public @interface Parameter {
	}
	
	@Retention(RetentionPolicy.RUNTIME)
	@Target({ElementType.TYPE_USE})
	public @interface Use {
	}
	
	
	public static class Holder<@Both @Use @Parameter T> extends @Both @Use Object {
		public void method() throws @Both @Use Exception {
		}
	}
	
	@SuppressWarnings("unused")
	public static void main(String[] args) {
		final Holder<String> holder = new @Both @Use Holder<>();
		@Both @Use Collection<@Both @Use String> strings = new ArrayList<>();
	}
}
```

1. ElementType.TYPE_PARAMETER 表示注解可以在泛型声明前使用。
2. ElementType.TYPE_USE 表示注解可以在全部类型位置使用。
------

### Java 编译器新特性
在 java8 中, 可以在编译时使用`–parameters`参数保存函数形参的原变量命名，然后在代码中可通过反射获得函数的变量命名。  
示例如下:
```java
public class JVMs {
	public static void main(String[] args) throws NoSuchMethodException {
		Method method = JVMs.class.getMethod("main", String[].class);
		for (final Parameter parameter : method.getParameters()) {
			System.out.println(String.format("%s 检测到原变量名", parameter.isNamePresent() ? "可以": "不可以"));
			System.out.println(String.format("参数: %s", parameter.getName()));
		}
	}
}
```
------

### Java 新增类库
#### Optional
> 用于解决 NullPointerException 
```java
public class OptionalMain {
	public static void main(String[] args) {
        // Null 值
		Optional<String> optional = Optional.empty();
		System.out.println(String.format("是否为null: %s", !optional.isPresent() ? "是" : "否"));
		System.out.println(optional.orElseGet(() -> "无值回调该函数()"));

        // 非 Null 值
		optional = Optional.of("hocgin");
		System.out.println(optional.map(s -> String.format("值: %s", s)).orElse("默认值: 10086"));
	}
}
```

#### Stream API
> 函数式编程，简化了之前繁琐的代码编写方式。
```java
public class SteamMain {
	
	public static void main(String[] args) {
		// 集合中使用 Stream API
		Collection<String> collections = Arrays.asList(
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7"
		);
		
		collections.stream()
				.filter(i -> Integer.valueOf(i) > 3)
				.limit(3)
				.forEach(System.out::println);
		
		// 文件流中使用 Stream API
		final Path path = new File("filePath").toPath();
		try (Stream<String> lines = Files.lines(path, StandardCharsets.UTF_8)) {
			lines.onClose(() -> System.out.println("读取完成")).forEach(System.out::println);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```
> 注: 此处 try 中可在文件流读取完进行自动关闭流的处理。

### Date/Time API
> 加强了对时间与日期的处理。
```java
public class DateAndTimeMain {
	public static void main(String[] args) {
		// 日期相关
		LocalDate nowDate = LocalDate.now();
		// 时间相关
		LocalTime nowTime = LocalTime.now();
		// 日期&时间相关
		LocalDateTime now = LocalDateTime.now();
		// 获取指定时区的当前时刻
		Clock clock = Clock.systemUTC();
		// 获取某时区的当前时间
		ZonedDateTime zonedDateTime = ZonedDateTime.now(ZoneId.of("Asia/Shanghai"));
		
		System.out.println(String.format("当前日期: %s", nowDate));
		System.out.println(String.format("当前时间: %s", nowTime));
		System.out.println(String.format("当前日期&时间: %s", now));
		System.out.println(String.format("当前时间戳: %s", clock.millis())); // === System.currentTimeMillis()
		System.out.println(String.format("上海时间: %s", zonedDateTime));
		
		// 用于计算两个日期间的间隔
		ZonedDateTime zonedDateTime2 = ZonedDateTime.now(ZoneId.of("Asia/Shanghai"));
		Duration duration = Duration.between(zonedDateTime, zonedDateTime2);
		System.out.println(duration.abs().getNano());
	}
}
```

### JavaScript引擎(Nashorn)
> 允许 Java 与 JavaScript 相互调用。

```java
public class NashornMain {
	public static void main(String[] args) throws ScriptException {
		ScriptEngineManager manager = new ScriptEngineManager();
		ScriptEngine engine = manager.getEngineByName("JavaScript");
		System.out.println(engine.getClass().getName());
		System.out.println("Result:" + engine.eval("function f() { return 1; }; f() + 1;"));
	}
}
```

### Base64
在 java8 中, 加入了，Base64编码。
```java
public class Base64Main {
	public static void main(String[] args) {
		final String text = "Base64 finally in Java 8!";
		final String encoded = Base64
				.getEncoder()
				.encodeToString(text.getBytes(StandardCharsets.UTF_8));
		System.out.println(encoded);
		
		final String decoded = new String(
				Base64.getDecoder().decode(encoded),
				StandardCharsets.UTF_8);
		System.out.println(decoded);
	}
}
```

### 并行数组
在 java8 中, 对数组进行并行处理, 极大提高在多核机子上的处理速度。
```java
public class ParallelMain {
	public static void main(String[] args) {
		long[] arrayOfLong = new long[20000];
		
		// 进行赋值操作
		Arrays.parallelSetAll(arrayOfLong,
				index -> ThreadLocalRandom.current().nextInt(1000000));
		Arrays.stream(arrayOfLong).limit(10).forEach(
				i -> System.out.print(i + " "));
		System.out.println();
		
		// 进行数组排序
		Arrays.parallelSort(arrayOfLong);
		Arrays.stream(arrayOfLong).limit(10).forEach(
				i -> System.out.print(i + " "));
		System.out.println();
		
		// 进行数组操作, 结果: [a1, a1+a2, a1+a2+a3,..]
		Arrays.parallelPrefix(arrayOfLong, (x, y) -> x + y);
		Arrays.stream(arrayOfLong).limit(10).forEach(
				i -> System.out.print(i + " "));
		System.out.println();
	}
}
```

### 并发
- 线程池`ExecutorService/ScheduledExecutorService`支持使用`Stream API`.
- 新增 StampedLock 用于替代 ReadWriteLock
```java
    StampedLock lock = new StampedLock();
    lock.writeLock();
    try {
        // 代码..
    } finally {
        lock.unlockWrite(stamp);
    }
```
- 原子操作(java.concurrent.atomic)
- ConcurrentMap 继承自Map接口
- ForkJoinPool 预置并行机制


### 新增的 Java 工具
- Nashorn引擎命令行工具 **jjs**
```shell
jjs # 回车
(function(){return 1+1})()
```
- 类依赖分析器命令行工具 **jdeps**
```shell
# .class 文件
jdeps Base64Main.class
# .jar 文件
jdeps demo.jar
# 文件夹
jdeps jdk8 
```

### JVM 新特性
- PermGen 被移除
- JVM选项`-XX:PermSize`与`-XX:MaxPermSize`分别被`-XX:MetaSpaceSize`与`-XX:MaxMetaspaceSize`所代替

### 相关
[Java 8](https://www.gitbook.com/book/wizardforcel/modern-java/details)