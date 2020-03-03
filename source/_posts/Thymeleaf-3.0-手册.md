------
title: Thymeleaf 3.0 手册
date: 2017-10-18 16:40:51
update: 2018-1-4 16:26:11
tags:
  - HTML5
  - Thymeleaf
categories:
  - Server
------
Spring 官方推崇的模版引擎，遵循 HTML5规范。
<!--more-->
## HTML5 
若要完全遵循HTML5规范，可使用 `data-th-*` 代替 `th:*`。

## 标签
### th:each
> foreach 循环
> 语法: th:each="obj, index:list"
```html
                <th:block th:each="permission, i:${role.permissions}">
                    <tr th:attr="data-tt-id=${permission.id}, data-tt-parent-id=${permission.parent}, data-tt-branch=${permission.hasChildren}">
                        <td th:text="${permission.name}"></td>
                        <td th:text="${permission.url}"></td>
                        <td th:text="${permission.type}"></td>
                        <td th:text="${permission.permission}"></td>
                    </tr>
                </th:block>
```

### th:inline
> 解析内嵌语法, 一般是混合javascript
> 语法: th:inline="javascript|text|none"
```html
<script th:inline="javascript">
/*<![CDATA[*/
var welcome = [[${welcome}]] '这是一个 Thymeleaf 变量';
var default_value = [[${maxCount?:0}]]
/*]]>*/
</script>
```

### th:fragment
> 定义模版，语法: th:fragment="模块名(变量)"
> 变量部分为可选, 配合 th:with 使用。
```html
    <!-- 不保留本身的标签, 保留 th:fragment 的标签 -->
    <div th:replace="/admin/fragments/header::header"></div>
    <!-- 保留本身的标签, 保留 th:fragment 的标签 -->
    <div th:insert="/admin/fragments/header::header"></div>
    <!-- @过期, 保留本身的标签, 不保留 th:fragment 的标签 -->
    <div th:include="/admin/fragments/header::header"></div>
```

### th:with
> 定义变量。语法: th:with="字段1=值, 字段2=值2"
```html
<div th:with="id='UploadImage',var='image',height=1,maxCount=1"></div>
```

### th:if
> 就是 if ..
```html
<div th:if="${true}"></div>
<!-- 
    布尔值.
    0 = false
    "false"/"off"/"no" = false
    null = false
 -->
```

### th:switch/th:case
```html
<ul th:switch="${val}">
    <li th:case="1">1</li>
    <li th:case="2">2</li>
</ul>

```

### th:selected
> 可用于 <option/> 标签
```html
<select class="form-control" id="type" name="type">
    <option value="0" th:selected="${permission?.type==0}">菜单</option>
    <option value="1" th:selected="${permission?.type==1}">数据</option>
</select>
```


## 注释语法

```html
<!--/* 这里是 编译器显示为注释, 浏览器不可见 */-->

<!--/*-->
<div>这里是 编译器显示不注释，浏览器不可见 </div>
<!--*/-->

<!--/*/
<div th:text="${'这里是 编辑器显示为注释, 浏览器可见'}">...</div>
/*/-->

```

## 表达式
### URL 表达式

```html
<img th:src="@{/img/tup.png}" alt="绝对路径">
<!-- <img alt="绝对路径" src="/img/tup.png"> -->
<img th:src="@{../img/tup.png}" alt="相对路径">
<!-- <img alt="相对路径" src="../img/tup.png"> -->
<img th:src="@{../img/tup.png(size=${100})}" alt="带参数的路径">
<!-- <img alt="带参数的路径" src="../img/tup.png?size=100"> -->
```

### 国际化表达式
1. 创建 `resources/messages_zh_CN.properties`, 其内容:

```xml
message.error=错误
```

2. 配置 `application.yml` (使用 xml 的执行转换)

```yml
spring:
  messages:
    basename: messages_zh_CN
```

3. 使用

```html
<div th:text="#{message.error}">Error</div> 
```

### 变量表达式
> 最基本的表达式, 类似于 EL 表达式。
> - 合 `org.springframework.ui.Model` 使用。
> - 可以使用众多内置对象。
> - @访问 Spring 容器内对象

```html
<span th:text="${author.name}">
```

### 变量表达式 - 扩展 1

```html
<ul th:object="${author}">
    <li th:text="*{name}"></li>
    <li th:text="*{mail}"></li>
    <li th:text="*{address}"></li>
</ul>

<!--
    等价于
    <ul>
        <li th:text="${author.name}"></li>
        <li th:text="${author.mail}"></li>
        <li th:text="${author.address}"></li>
    </ul>
-->

```

### 变量表达式 - 扩展 2

```html
<div th:text="${@demoService.getStr('hocgin')}"></div>
```

### 预处理表达式
1. 前置设置, Controller

```java
    @GetMapping({"/test.html"})
    public String index(Model model, @PathVariable String page) {
        model.addAttribute("key", "error");
        HashMap<String, String> vm = new HashMap<>();
        vm.put("error", "来自 ${} 表达式");
        model.addAttribute("obj", vm);
        return String.format("test.html", page);
    }
```

2. 前置设置, `messages_zh_CN.properties` 参考**国际化表达式**

```properties
message.error=错误
```

3. test.html 编写

```html
<a th:href="@{/img/__${1+1}__}">连接</a>
<!-- <a href="/img/2">连接</a> -->
<div th:text="#{message.__${key}__}"></div>
<!-- <div>错误</div> -->
<div th:text="${obj.__${key}__}"></div>
<!-- <div>来自 ${} 表达式</div> -->
```

### Fragment 表达式
> ~{...}



## 表达式语法
### 字符串拼接
使用 `+` 或者 `|..|`

```html
<span th:text="'1+1=' + ${1+1}"></span>
<!-- 1+1=2 -->
<span th:text="|1+1=${1+1}|"></span>
<!-- 1+1=2 -->
```

### 运算符号
使用 `+, -, *, /, %`。

```html
<span th:text="-((1+1-1)*2/2)%9"></span>
<!-- -1 -->
```

### 与 或 非
使用 `and , or` 和 `! , not`。

```html
<span th:text="1==1 and true"></span>
<!-- true -->
<span th:text="true and false"></span>
<!-- false -->

<span th:text="true or false"></span>
<!-- true -->

<span th:text="not true"></span>
<!-- false -->
<span th:text="! false"></span>
<!-- true -->
```

### 关系表达式
使用 `>, <, >=, <=, ==, !=`。  
或者 `gt, lt, ge, le, eq, ne`。

```html
<span th:text="((1 > 2 and 2 < 3) or (2 >= 2 and 2 <= 5)) and (1 == 1 and 1 != 2)"></span>
<!-- true -->
<span th:text="((1 gt 2 and 2 lt 3) or (2 ge 2 and 2 le 5)) and (1 eq 1 and 1 ne 2)"></span>
<!-- true -->
```

### 简单条件表达式
使用:  
if-then `(if) ? (then)`  
if-then-else `(if) ? (then) : (else)`  
default `(value) ?: (defaultValue)`  

```html
<span th:text="true ? 'hocgin'"></span>
<!-- hocgin -->
<span th:text="false ? 'hocgin' : 'hocg.in'"></span>
<!-- hocg.in -->
<span th:text="${iname} ?: 'hocgin'"></span>
<!-- hocgin -->
```

## 解析优先级
|级别| 描述 | th属性|
|---|---|---|
|1|(Fragment inclusion)代码片段导入|`th:insert`,`th:replace`|
|2|(Fragment iteration)迭代|`th:each`|
|3|(Conditional evaluation)条件|`th:if`,`th:unless`,`th:switch`,`th:case`|
|4|(Local variable definition)局部变量|`th:object`,`th:with`|
|5|(General attribute modification)通用属性修改|`th:attr`,`th:attrprepend`,`th:attrappend`|
|6|(Specific attribute modification)具体属性修改|`th:value`,`th:href`,`th:src` ...|
|7|(Text tag body modification) 文本节点修改|`th:text`,`th:utext`|
|8|(Fragment specification) 代码段定义|`th:fragment`|
|9|(Fragment removal) 代码段删除|`th:remove`|


## 基础对象
### `#ctx` (org.thymeleaf.spring4.context.SpringWebContext)

```java
/**
 * org.thymeleaf.context.IContext
 **/
// 当前语言环境(eg. en_US)。 等价于 {#locale}
${#ctx.locale}
// org.thymeleaf.context.VariablesMap 对象, 内部存储的是可用于当前上下文(Context)的对象。等价于 {#vars}
${#ctx.variables}

/**
 * org.thymeleaf.context.IWebContext
 **/
${#ctx.applicationAttributes}
// 等价于 {#httpServletRequest}
${#ctx.httpServletRequest}
${#ctx.httpServletResponse}
// 等价于 {#httpSession}
${#ctx.httpSession}
${#ctx.requestAttributes}
${#ctx.requestParameters}
${#ctx.servletContext}
${#ctx.sessionAttributes}
```

### `param` (org.apache.catalina.util.ParameterMap)
包含当前页面的请求的参数(eg. `http://localhost:8080/admin/test.html?name=hocgin`)。

```java
// 返回对象
${param.name} 
// 获得值: hocgin
${param.name[0]} 
${param.size()}
${param.isEmpty()}
${param.containsKey('name')}
```

### `session` (org.thymeleaf.context.WebSessionVariablesMap)
从 Session 获取内容。

```java
// 获得值: hocgin
${session.name}
${session.size()}
${session.isEmpty()}
${session.containsKey('name')}
```

### `#httpServletRequest` (org.apache.catalina.connector.RequestFacade)
### `#themes` (org.thymeleaf.spring4.expression.Themes)
### `application`

### `#dates` (org.thymeleaf.expression.Dates)
### `#calendars` (org.thymeleaf.expression.Calendars)
### `#numbers` (org.thymeleaf.expression.Numbers)
### `#strings` (org.thymeleaf.expression.Strings)
### `#objects` (org.thymeleaf.expression.Objects)
### `#bools` (org.thymeleaf.expression.Bools)
### `#arrays` (org.thymeleaf.expression.Arrays)
### `#lists` (org.thymeleaf.expression.Lists)
### `#sets` (org.thymeleaf.expression.Sets)
### `#maps` (org.thymeleaf.expression.Maps)
### `#aggregates` (org.thymeleaf.expression.Aggregates)
### `#messages` (org.thymeleaf.expression.Messages)
### `#ids` (org.thymeleaf.expression.Ids)

**代码示例**

```html
### `#locale` (<span th:text="${#locale}"></span>)<br>
### `#ctx` (<span th:text="${#ctx}"></span>)<br>
### `#vars` (<span th:text="${#vars}"></span>)<br>

### `param` (<span th:text="${param}"></span>)<br>
### `application` (<span th:text="${application}"></span>)<br>
### `session` (<span th:text="${session}"></span>)<br>
### `#httpSession` (<span th:text="${#httpSession}"></span>)<br>
### `#httpServletRequest` (<span th:text="${#httpServletRequest}"></span>)<br>

### `#themes` (<span th:text="${#themes}"></span>)<br>
### `#dates` (<span th:text="${#dates}"></span>)<br>
### `#calendars` (<span th:text="${#calendars}"></span>)<br>
### `#numbers` (<span th:text="${#numbers}"></span>)<br>
### `#strings` (<span th:text="${#strings}"></span>)<br>
### `#objects` (<span th:text="${#objects}"></span>)<br>
### `#bools` (<span th:text="${#bools}"></span>)<br>
### `#arrays` (<span th:text="${#arrays}"></span>)<br>
### `#lists` (<span th:text="${#lists}"></span>)<br>
### `#sets` (<span th:text="${#sets}"></span>)<br>
### `#maps` (<span th:text="${#maps}"></span>)<br>
### `#aggregates` (<span th:text="${#aggregates}"></span>)<br>
### `#messages` (<span th:text="${#messages}"></span>)<br>
### `#ids` (<span th:text="${#ids}"></span>)<br>
```

## 重点
- 在 `thymeleaf` 中使用 Spring 容器内的单例.

```html
<div th:text="${@demoService.getStr('hocgin')}"></div>
```

- 引入模版片段
1. XPath 表达式
```html
<div th:include="mytemplate :: [//div[@class='content']]"></div>
```

2. CSS 表达式
```html
<div th:include="mytemplate :: [div.content]"></div>
```

- 引入公有片段(JS 或 CSS)

```html
    <css th:replace="mytemplate :: common-css"></css>
    <js th:replace="@{mytemplate} :: common-css"></js>
    <!-- 可结合 路径表达式 -->
```

## 扩展
### thymeleaf-layout-dialect
> 一般情况网站都有一个外部框架, 如 header 或者 footer, 这个扩展便是用于抽离那些重复的部分的。
#### layout:decorator
> 指定需使用的父级模版
```html
<html lang="en"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorator="/admin/_layouts/default">
      ...
</html>
```
#### layout:fragment
> 在父模版中使用定义一个标记，
> 在子模版中使用覆盖到父模版位置。
```html
<!-- 父 -->
<div layout:fragment="content">
    <p>父模版内容</p>
</div>
<!-- 子 -->
<div layout:fragment="content">
    <p>子模版内容</p>
</div>
<!-- 生成 -->
<div>
    <p>子模版内容</p>
</div>
```

#### layout:title-pattern
> 用与 <title/> 标签, 指定 title 的值。
```html
<!-- 后台 - 子标题 -->
<title layout:title-pattern="$DECORATOR_TITLE - $CONTENT_TITLE">后台</title>
```

## 黑科技
1. 当我们想取一个对象里面的一个属性, 但这个对象可能为空时(😋)。
```html
<td th:text="${user?.address?.city}"></td>
```
