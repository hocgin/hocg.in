------
title: Spring Boot启动过程和Bean的创建过程
date: 2018-01-15 17:10:20
tags:
  - Spring Boot
  - Web
categories:
  - Web
------
这几天分析了一下 Spring Boot 启动过程和 Bean 的创建过程，在此记录下来。
如果有什么不对的地方，欢迎提出🙏。
<!--more-->

## 启动过程

```java

        // 将 new SpringApplicationBuilder(sources...) 加入 sources 列表。
        // ---------------推断是否是Web环境------------
        // SpringApplication.deduceMainApplicationClass#248
        // 主要是否包含 javax.servlet.Servlet ..
        // ---------------Initializer------------
        // 使用 ClassLoader
        // 分析引入所有包的: META-INF/spring.factories 文件
        // - spring-boot-actuator-1.5.8.RELEASE.jar
        // - spring-data-redis-1.8.8.RELEASE.jar
        // - ..
        // 获得 Key 为`org.springframework.context.ApplicationContextInitializer`的所有节点(Class), 实例化并通过 @Order 进行排序。
        // ---------------Listener------------
        // 使用 ClassLoader
        // 分析引入所有包的: META-INF/spring.factories 文件
        // - spring-boot-actuator-1.5.8.RELEASE.jar
        // - spring-data-redis-1.8.8.RELEASE.jar
        // - ..
        // 获得 Key 为`org.springframework.context.ApplicationListener`的所有节点(Class), 实例化并通过 @Order 进行排序。
        // ---------------推断Main类------------
        // SpringApplication.deduceMainApplicationClass#252
        // 推断当前应用的入口函数(方法名为main)。
            new SpringApplicationBuilder()
                .sources(Application.class)
                // -------判断是否热部署状态---------
                // ---如果设置了 parent() 进行配置-----
                // configureAsChildIfNecessary(args);如果配置了会加入一个 ParentContextApplicationContextInitializer
                // ---------初始化当前应用----------
                // SpringApplication.run(args)
                .run(args);
```
### 分析 SpringApplication.run(args)
```java
        // 计时器, 用于记录启动时间
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        ConfigurableApplicationContext context = null;
        FailureAnalyzers analyzers = null;
        // 设置为无输入/输出设备模式
        configureHeadlessProperty();
        // 使用 ClassLoader
        // 分析引入所有包的: META-INF/spring.factories 文件
        // 获得 Key 为`org.springframework.boot.SpringApplicationRunListener`的所有节点(Class), 实例化并通过 @Order 进行排序。
        // 并封装进入 SpringApplicationRunListeners 类。
        SpringApplicationRunListeners listeners = getRunListeners(args);
        // 由 SpringApplicationRunListeners 控制类的启动。
        listeners.starting();
        try {
            // 封装我们提供的 args 参数
            ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
            // 根据是否 Web 环境(webEnvironment) 获得环境(StandardServletEnvironment/StandardEnvironment)
            // - 加载默认的参数源(StandardServletEnvironment.customizePropertySources)
            // - 加载我们提供的启动参数(args)作为参数源。当然，前提是 addCommandLineProperties 为 true。
            // 通过 SpringApplicationRunListeners.environmentPrepared(..) 处理上面提供的应用环境参数。
            ConfigurableEnvironment environment = prepareEnvironment(listeners, applicationArguments);
            // 打印 banner。本身是由 Banner 类实现的
            Banner printedBanner = printBanner(environment);
            // 实例化一个应用的当前环境, Spring Boot 提供了2种环境根据是否是web环境进行动态实例化(webEnvironment), 分别是(AnnotationConfigEmbeddedWebApplicationContext/ConfigurableWebApplicationContext)
            // 这是会创建两个用于扫描注解的重要对象
            // - AnnotatedBeanDefinitionReader  读取器, 设置环境参数，创建时注册了一系列的用于 Bean 的解析器(AnnotatedBeanDefinitionReader#65)
            // - ClassPathBeanDefinitionScanner 扫描器, 设置路径 & 环境 & 拦截器(Component.class)
            context = createApplicationContext();
            // ----------创建失败解析器------------
            // 当初始化出现错误时进行错误分析器
            // 使用 ClassLoader
            // 分析引入所有包的: META-INF/spring.factories 文件
            // - spring-boot-actuator-1.5.8.RELEASE.jar
            // - spring-data-redis-1.8.8.RELEASE.jar
            // - ..
            // 获得 Key 为`org.springframework.boot.diagnostics.FailureAnalyzer`的所有节点(Class), 实例化并通过 @Order 进行排序。
            // 并加入 FailureAnalyzers 管理。
            analyzers = new FailureAnalyzers(context);
            // 详情见下方【SpringApplication.prepareContext(..)】
            prepareContext(context, environment, listeners, applicationArguments, printedBanner);
            // 详情见下方【分析 AbstractApplicationContext.refreshContext(context);】
            refreshContext(context);
            // ApplicationRunner & CommandLineRunner.run 按类型从 Bean 容器中取出，并调用 run(..)
            afterRefresh(context, applicationArguments);
            // 广播通知 SpringApplicationRunListener.finished
            listeners.finished(context, null);
            // 关闭计时器，记录启动时间
            stopWatch.stop();
            // 是否启动日志
            if (this.logStartupInfo) {
                new StartupInfoLogger(this.mainApplicationClass)
                        .logStarted(getApplicationLog(), stopWatch);
            }
            return context;
        } catch (Throwable ex) {
            // 处理退出异常, 存储 ExitCodeEvent
            // 广播通知 listener(listener.finished(context, exception);)
            // 使用 analyzers 进行失败分析
            handleRunFailure(context, listeners, analyzers, ex);
            throw new IllegalStateException(ex);
        }
```

#### 分析 SpringApplication.prepareContext(..)
```java
private void prepareContext(ConfigurableApplicationContext context,
            ConfigurableEnvironment environment, SpringApplicationRunListeners listeners,
            ApplicationArguments applicationArguments, Banner printedBanner) {
        // 设置环境参数
    context.setEnvironment(environment);
        // 
        // - 注册自定义 beanNameGenerator，如果有的话。
        // - 注册自定义 resourceLoader，如果有的话。
        // 其中, resourceLoader 分为两种类型
        //     - GenericApplicationContext(ResourceLoader)
        //     - DefaultResourceLoader(ClassLoader)
    postProcessApplicationContext(context);
        // 初始化所有之前加载的 ApplicationContextInitializer 节点
    applyInitializers(context);
        // 所有监听器通知进入 contextPrepared 阶段
    listeners.contextPrepared(context);
        // 是否启动日志
    if (this.logStartupInfo) {
        // 交由顶级打印日志信息
        logStartupInfo(context.getParent() == null);
        // 打印配置文件信息
        logStartupProfileInfo(context);
    }

    // Add boot specific singleton beans
    context.getBeanFactory().registerSingleton("springApplicationArguments",
        applicationArguments);
    if (printedBanner != null) {
        context.getBeanFactory().registerSingleton("springBootBanner", printedBanner);
    }

    // Load the sources
    Set<Object> sources = getSources();
    Assert.notEmpty(sources, "Sources must not be empty");
        // 创建 Bean 的加载器, BeanDefinitionLoader
        // ---------------解析器---------------
        // - 注解 AnnotatedBeanDefinitionReader
        // - xml XmlBeanDefinitionReader
        // - goovy GroovyBeanDefinitionReader
        // - 类路径 ClassPathBeanDefinitionScanner
        // ---------------自定义-----------------
        // - 加载自定义 beanNameGenerator，如果有的话。
        // - 加载自定义 resourceLoader，如果有的话。
        // - 加载自定义 environment，如果有的话。
    load(context, sources.toArray(new Object[sources.size()]));
        // 通知环境加载结束
    listeners.contextLoaded(context);
}

```
#### 分析 AbstractApplicationContext.refreshContext(context);
```java
    @Override
    public void refresh() throws BeansException, IllegalStateException {
        synchronized (this.startupShutdownMonitor) {
            // 设置为启动状态
            // 校验必须字段, 使用 ConfigurablePropertyResolver#setRequiredProperties 进行设置。
            // Prepare this context for refreshing.
            prepareRefresh();

            // 刷新当前 beanFactory 的ID, 值得一提的是默认的 BeanFactory 是 org.springframework.beans.factory.support.DefaultListableBeanFactory。
            // Tell the subclass to refresh the internal bean factory.
            ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

            // ----------BeanFactory重点初始化(AbstractApplicationContext.prepareBeanFactory#627)---------------
            // - 设置 BeanClassLoader
            // - 设置 字符解析器(SpelExpressionParser)
            // - 设置 资源位置
            // - 添加 处理器
            // - 忽略 某些接口
            // - 注册某些解析器解决依赖关系
            // - 添加一个监听器
            // - 注册 默认的 environment Bean(3个), 如果不存在的话。
            // Prepare the bean factory for use in this context.
            prepareBeanFactory(beanFactory);

            try {
                // AnnotationConfigEmbeddedWebApplicationContext.postProcessBeanFactory#182
                // - 加入 WebApplicationContextServletContextAwareProcessor 作为 BeanPostProcessor 
                // - beanFactory.ignoreDependencyInterface(ServletContextAware.class);
                // 也会读取注册的注解类 和 配置要扫描的包位置。
                // Allows post-processing of the bean factory in context subclasses.
                postProcessBeanFactory(beanFactory);

                // PostProcessorRegistrationDelegate.invokeBeanDefinitionRegistryPostProcessors(currentRegistryProcessors, registry)
                // 通过 ConfigurationClassPostProcessor.postProcessBeanDefinitionRegistry#308 扫描所有应用文件。
                // - 扫描预制的配置文件
                // - 扫描应用的所有注解配置成 Bean 字典
                // Invoke factory processors registered as beans in the context.
                invokeBeanFactoryPostProcessors(beanFactory);

                // 使用 BeanPostProcessor.class 获取 Bean(所有 Bean 均在beanDefinitionMap 内含有), 排序后, 注册为 Bean 处理器。
                // 加入 BeanPostProcessorChecker.class 用于监听Bean的创建周期。
                // - priorityOrderedPostProcessors
                // - orderedPostProcessors
                // - nonOrderedPostProcessors
                // - internalPostProcessors
                // 加入 ApplicationListenerDetector 作为兜底 BeanPostProcessor
                // Register bean processors that intercept bean creation.
                registerBeanPostProcessors(beanFactory);

                // 初始化消息资源(MessageSource)
                // 一般是作为 i18 的资源文件。
                // Initialize message source for this context.
                initMessageSource();

                // 初始化应用广播器(ApplicationEventMulticaster)
                // 一般用于管理 ApplicationListener
                // Initialize event multicaster for this context.
                initApplicationEventMulticaster();

                // EmbeddedWebApplicationContext.onRefresh#131
                // 创建嵌入式 Servlet 容器
                // Initialize other special beans in specific context subclasses.
                onRefresh();

                // 注册 listener beans 到 ApplicationEventMulticaster。
                // 广播 (Set<ApplicationEvent> earlyEventsToProcess).multicastEvent
                // Check for listener beans and register them.
                registerListeners();

                // - 转化 BeanFactory 类型
                // - 提供默认的嵌入值解析器，如果需要的话。
                // - 装载 LoadTimeWeaverAware.class 类型的 Bean
                // - 停止临时的 ClassLoad
                // - 冻结配置
                // - 预先装载所有单例 Bean。
                //    - 初始化@Controller @RequestMapping 之类的过程, 基本上我们使用的注解都是该阶段进行设置的。
                // Instantiate all remaining (non-lazy-init) singletons.
                finishBeanFactoryInitialization(beanFactory);

                // ----------发布事件通知----------------
                // 注册 LifecycleProcessor，并发布 onRefresh() 事件。
                // earlyApplicationEvents.add(new ContextRefreshedEvent(this)) 加入 Context 刷新事件
                // 注册 LiveBean，如果有的话。..DevTool Debug 那个
                // Last step: publish corresponding event.
                finishRefresh();
            }

            catch (BeansException ex) {
                if (logger.isWarnEnabled()) {
                    logger.warn("Exception encountered during context initialization - " +
                            "cancelling refresh attempt: " + ex);
                }

                // Destroy already created singletons to avoid dangling resources.
                destroyBeans();

                // Reset 'active' flag.
                cancelRefresh(ex);

                // Propagate exception to caller.
                throw ex;
            }

            finally {
                // Reset common introspection caches in Spring's core, since we
                // might not ever need metadata for singleton beans anymore...
                resetCommonCaches();
            }
        }
    }

```

## 关于 Bean
- BeanDefinitionRegistry, Bean 定义注册表，类似 Bean 的仓库。
- BeanDefinition 存储 Bean 的信息。
    - Bean 的 scope 种类, 
        - prototype, 每次获取时创建。
        - request, 
        - session, 
        - global session, 
        - singleton(默认), 单例。
- BeanFactory, Bean 工厂。
    - 用于 注册 Bean, 获得 Bean, 清除 Bean, 配置 Bean 的相关策略。
- DefaultListableBeanFactory 是 Spring 默认的 BeanFactory。
    - registeredSingletons 已注册的 Bean 列表, 存储 BeanName。
    - singletonObjects 存储 Bean 对象, 使用 Map 结构。
    - earlySingletonObjects 存储由 ObjectFactory 创建的 Bean 对象。
    - singletonFactories 存储之前创建的 ObjectFactory 其本质是 Bean 对象。
    - beanDefinitionMap 扫描存储的记录，可以理解为 Bean 的总名单。
    - mergedBeanDefinitions

### 获取 Bean `getBean(..)`
```java
// AbstractBeanFactory.class
    @Override
    public Object getBean(String name) throws BeansException {
        return doGetBean(name, null, null, false);
    }

    @SuppressWarnings("unchecked")
    protected <T> T doGetBean(
            final String name, final Class<T> requiredType, final Object[] args, boolean typeCheckOnly)
            throws BeansException {

        // 解析 BeanName
        final String beanName = transformedBeanName(name);
        Object bean;


        // 检查缓存中是否存在该 Bean, 如果存在则实例化。
        // Eagerly check singleton cache for manually registered singletons.
        Object sharedInstance = getSingleton(beanName);
        if (sharedInstance != null && args == null) {
            if (logger.isDebugEnabled()) {
                if (isSingletonCurrentlyInCreation(beanName)) {
                    logger.debug("Returning eagerly cached instance of singleton bean '" + beanName +
                            "' that is not fully initialized yet - a consequence of a circular reference");
                }
                else {
                    logger.debug("Returning cached instance of singleton bean '" + beanName + "'");
                }
            }
            bean = getObjectForBeanInstance(sharedInstance, name, beanName, null);
        }

        else { // Bean 不在缓存

            // 当正在创建的 Bean 的 Scope 为 Prototype 时，抛出异常。
            // 因为 Prototype 模式无法解决依赖问题。
            // Fail if we're already creating this bean instance:
            // We're assumably within a circular reference.
            if (isPrototypeCurrentlyInCreation(beanName)) {
                throw new BeanCurrentlyInCreationException(beanName);
            }


            // 如果当前 BeanFactory 不包括该 BeanName 并且该 BeanFactory 有父 BeanFactory 时，尝试从父 BeanFactory 获取该 Bean。
            // Check if bean definition exists in this factory.
            BeanFactory parentBeanFactory = getParentBeanFactory();
            if (parentBeanFactory != null && !containsBeanDefinition(beanName)) {
                // Not found -> check parent.
                String nameToLookup = originalBeanName(name);
                if (args != null) {
                    // Delegation to parent with explicit args.
                    return (T) parentBeanFactory.getBean(nameToLookup, args);
                }
                else {
                    // No args -> delegate to standard getBean method.
                    return parentBeanFactory.getBean(nameToLookup, requiredType);
                }
            }

            // 如果不只依靠类型进行获取, 进行标记。
            if (!typeCheckOnly) {
                markBeanAsCreated(beanName);
            }

            try {
                // 将解析转化为 Bean 的信息，注册并获取其依赖的 Bean。
                final RootBeanDefinition mbd = getMergedLocalBeanDefinition(beanName);
                checkMergedBeanDefinition(mbd, beanName, args);

                // Guarantee initialization of beans that the current bean depends on.
                String[] dependsOn = mbd.getDependsOn();
                if (dependsOn != null) {
                    for (String dep : dependsOn) {
                        if (isDependent(beanName, dep)) {
                            throw new BeanCreationException(mbd.getResourceDescription(), beanName,
                                    "Circular depends-on relationship between '" + beanName + "' and '" + dep + "'");
                        }
                        registerDependentBean(dep, beanName);
                        getBean(dep);
                    }
                }

                // 当 Bean 的 Scope 为 Singleton 时
                // Create bean instance.
                if (mbd.isSingleton()) {
                    sharedInstance = getSingleton(beanName, new ObjectFactory<Object>() {
                        @Override
                        public Object getObject() throws BeansException {
                            try {
                                return createBean(beanName, mbd, args);
                            }
                            catch (BeansException ex) {
                                // Explicitly remove instance from singleton cache: It might have been put there
                                // eagerly by the creation process, to allow for circular reference resolution.
                                // Also remove any beans that received a temporary reference to the bean.
                                destroySingleton(beanName);
                                throw ex;
                            }
                        }
                    });
                    bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
                }

                // 当 Bean 的 Scope 为 Prototype 时
                else if (mbd.isPrototype()) {
                    // It's a prototype -> create a new instance.
                    Object prototypeInstance = null;
                    try {
                        beforePrototypeCreation(beanName);
                        prototypeInstance = createBean(beanName, mbd, args);
                    }
                    finally {
                        afterPrototypeCreation(beanName);
                    }
                    bean = getObjectForBeanInstance(prototypeInstance, name, beanName, mbd);
                }

                // 当 Bean 的 Scope 为 其他 时
                else {
                    String scopeName = mbd.getScope();
                    final Scope scope = this.scopes.get(scopeName);
                    if (scope == null) {
                        throw new IllegalStateException("No Scope registered for scope name '" + scopeName + "'");
                    }
                    try {
                        Object scopedInstance = scope.get(beanName, new ObjectFactory<Object>() {
                            @Override
                            public Object getObject() throws BeansException {
                                beforePrototypeCreation(beanName);
                                try {
                                    return createBean(beanName, mbd, args);
                                }
                                finally {
                                    afterPrototypeCreation(beanName);
                                }
                            }
                        });
                        bean = getObjectForBeanInstance(scopedInstance, name, beanName, mbd);
                    }
                    catch (IllegalStateException ex) {
                        throw new BeanCreationException(beanName,
                                "Scope '" + scopeName + "' is not active for the current thread; consider " +
                                "defining a scoped proxy for this bean if you intend to refer to it from a singleton",
                                ex);
                    }
                }
            }
            catch (BeansException ex) {
                cleanupAfterBeanCreationFailure(beanName);
                throw ex;
            }
        }

        // 检查获得的 Bean 类型是否符合预期结果。
        // Check if required type matches the type of the actual bean instance.
        if (requiredType != null && bean != null && !requiredType.isInstance(bean)) {
            try {
                return getTypeConverter().convertIfNecessary(bean, requiredType);
            }
            catch (TypeMismatchException ex) {
                if (logger.isDebugEnabled()) {
                    logger.debug("Failed to convert bean '" + name + "' to required type '" +
                            ClassUtils.getQualifiedName(requiredType) + "'", ex);
                }
                throw new BeanNotOfRequiredTypeException(name, requiredType, bean.getClass());
            }
        }
        return (T) bean;
    }

```

### 创建 Bean `createBean(..)`
```java
// AbstractAutowireCapableBeanFactory.class
    @Override
    protected Object createBean(String beanName, RootBeanDefinition mbd, Object[] args) throws BeanCreationException {
        if (logger.isDebugEnabled()) {
            logger.debug("Creating instance of bean '" + beanName + "'");
        }
        RootBeanDefinition mbdToUse = mbd;

        // 根据信息(mbd, beanName)获取 Bean 的类型
        // Make sure bean class is actually resolved at this point, and
        // clone the bean definition in case of a dynamically resolved Class
        // which cannot be stored in the shared merged bean definition.
        Class<?> resolvedClass = resolveBeanClass(mbd, beanName);
        if (resolvedClass != null && !mbd.hasBeanClass() && mbd.getBeanClassName() != null) {
            mbdToUse = new RootBeanDefinition(mbd);
            mbdToUse.setBeanClass(resolvedClass);
        }

        // 校验重载函数
        // Prepare method overrides.
        try {
            mbdToUse.prepareMethodOverrides();
        }
        catch (BeanDefinitionValidationException ex) {
            throw new BeanDefinitionStoreException(mbdToUse.getResourceDescription(),
                    beanName, "Validation of method overrides failed", ex);
        }

        try {

            // Spring 提供的，由 BeanPostProcessor 进行处理接入点。
            // Give BeanPostProcessors a chance to return a proxy instead of the target bean instance.
            Object bean = resolveBeforeInstantiation(beanName, mbdToUse);
            if (bean != null) {
                return bean;
            }
        }
        catch (Throwable ex) {
            throw new BeanCreationException(mbdToUse.getResourceDescription(), beanName,
                    "BeanPostProcessor before instantiation of bean failed", ex);
        }
        // 默认的创建 Bean 方式
        Object beanInstance = doCreateBean(beanName, mbdToUse, args);
        if (logger.isDebugEnabled()) {
            logger.debug("Finished creating instance of bean '" + beanName + "'");
        }
        return beanInstance;
    }

// AbstractAutowireCapableBeanFactory.class
    protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final Object[] args)
            throws BeanCreationException {

        // 根据 Bean 信息实例化 Bean
        // Instantiate the bean.
        BeanWrapper instanceWrapper = null;
        if (mbd.isSingleton()) {
            instanceWrapper = this.factoryBeanInstanceCache.remove(beanName);
        }
        if (instanceWrapper == null) {
            instanceWrapper = createBeanInstance(beanName, mbd, args);
        }
        final Object bean = (instanceWrapper != null ? instanceWrapper.getWrappedInstance() : null);
        Class<?> beanType = (instanceWrapper != null ? instanceWrapper.getWrappedClass() : null);
        mbd.resolvedTargetType = beanType;

        // 使用 MergedBeanDefinitionPostProcessor 进行处理
        // Allow post-processors to modify the merged bean definition.
        synchronized (mbd.postProcessingLock) {
            if (!mbd.postProcessed) {
                try {
                    applyMergedBeanDefinitionPostProcessors(mbd, beanType, beanName);
                }
                catch (Throwable ex) {
                    throw new BeanCreationException(mbd.getResourceDescription(), beanName,
                            "Post-processing of merged bean definition failed", ex);
                }
                mbd.postProcessed = true;
            }
        }

        // Eagerly cache singletons to be able to resolve circular references
        // even when triggered by lifecycle interfaces like BeanFactoryAware.
        boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
                isSingletonCurrentlyInCreation(beanName));
        // 单例 & 允许循环引用 & 正在创建
        if (earlySingletonExposure) {
            if (logger.isDebugEnabled()) {
                logger.debug("Eagerly caching bean '" + beanName +
                        "' to allow for resolving potential circular references");
            }
            // 使用 ObjectFactory 来管理 Bean 防止循环依赖。
            addSingletonFactory(beanName, new ObjectFactory<Object>() {
                @Override
                public Object getObject() throws BeansException {
                    return getEarlyBeanReference(beanName, mbd, bean);
                }
            });
        }

        // Initialize the bean instance.
        Object exposedObject = bean;
        try {
            //  对 Bean 的属性进行填充
            populateBean(beanName, mbd, instanceWrapper);
            if (exposedObject != null) {
                // 初始化 Bean 实例
                exposedObject = initializeBean(beanName, exposedObject, mbd);
            }
        }
        catch (Throwable ex) {
            if (ex instanceof BeanCreationException && beanName.equals(((BeanCreationException) ex).getBeanName())) {
                throw (BeanCreationException) ex;
            }
            else {
                throw new BeanCreationException(
                        mbd.getResourceDescription(), beanName, "Initialization of bean failed", ex);
            }
        }

        if (earlySingletonExposure) {
            Object earlySingletonReference = getSingleton(beanName, false);
            // 存在已创建的单例, 一般情况为解决依赖的时候。
            if (earlySingletonReference != null) {
                if (exposedObject == bean) {
                    exposedObject = earlySingletonReference;
                }
                // 允许循环依赖不一致 & Bean 含有依赖。
                // 此时如果存在依赖，将会发生异常。
                else if (!this.allowRawInjectionDespiteWrapping && hasDependentBean(beanName)) {
                    String[] dependentBeans = getDependentBeans(beanName);
                    Set<String> actualDependentBeans = new LinkedHashSet<String>(dependentBeans.length);
                    for (String dependentBean : dependentBeans) {
                        if (!removeSingletonIfCreatedForTypeCheckOnly(dependentBean)) {
                            actualDependentBeans.add(dependentBean);
                        }
                    }
                    if (!actualDependentBeans.isEmpty()) {
                        throw new BeanCurrentlyInCreationException(beanName,
                                "Bean with name '" + beanName + "' has been injected into other beans [" +
                                StringUtils.collectionToCommaDelimitedString(actualDependentBeans) +
                                "] in its raw version as part of a circular reference, but has eventually been " +
                                "wrapped. This means that said other beans do not use the final version of the " +
                                "bean. This is often the result of over-eager type matching - consider using " +
                                "'getBeanNamesOfType' with the 'allowEagerInit' flag turned off, for example.");
                    }
                }
            }
        }


        // 注册一次性 Bean
        // Register bean as disposable.
        try {
            registerDisposableBeanIfNecessary(beanName, bean, mbd);
        }
        catch (BeanDefinitionValidationException ex) {
            throw new BeanCreationException(
                    mbd.getResourceDescription(), beanName, "Invalid destruction signature", ex);
        }

        return exposedObject;
    }


```
