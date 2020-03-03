------
title: JQuery.pjax 无法再次初始化当前页面的JS
date: 2017-10-19 22:07:20
tags:
  - JavaScript
  - Pjax
categories:
  - Web
------
Pjax 很久之前用过一次, 这一次在整合后台模版，发现网上对这个坑竟然是改源码...在这详细记录一下。

<!--more-->
## 问题
当 `JQuery.pjax` 加载页面后, 再次加载该页面时，其内部的初始化 `JS` 或 `script inline` 并不能被再次执行。例如:
```html
<div id="pjax-container">
    <!-- .. -->
</div>
<!-- jQuery 3 -->
<script th:src="jquery.min.js"></script>
<!-- jQuery Pjax -->
<script th:src="jquery.pjax.js"></script>
<script type="text/javascript">
        $(document).ready(function () {
            if ($.support.pjax) {
                $(document).pjax('a[data-pjax]', '#pjax-container', {
                    maxCacheLength: 0,
                    push: false,
                    replace: true,
                    fragment: '#pjax-container',
                    timeout: 8000
                });
            }
        });
</script>
<script type="text/javascript">
    $(function(){
        console.log("不能被再次执行");
    });
</script>
<!-- 不能被再次执行 -->
<script type="text/javascript"  src="init.js"></script>
```

## 解决办法
1. 其原因是`JQuery.pjax`对`js`进行了缓存, 可以使用`JQuery`进行加载, 当然其代价是牺牲了这部分都缓存, 不过因为是特定页面的脚本, 牺牲的缓存几乎可以忽略。例子如下:
```html
<div id="pjax-container">
    <!-- .. -->
    <!-- 能被再次执行 -->
    <script th:inline="javascript">
            $.getScript('/admin-lte/dist/js/pages/dashboard2.js');
    </script>
    <script type="text/javascript"  src="init.js"></script>
    <script type="text/javascript">
        $(function(){
            console.log("能被再次执行");
        });
    </script>
</div>
<!-- jQuery 3 -->
<script th:src="jquery.min.js"></script>
<!-- jQuery Pjax -->
<script th:src="jquery.pjax.js"></script>
<script type="text/javascript">
        $(document).ready(function () {
            if ($.support.pjax) {
                $(document).pjax('a[data-pjax]', '#pjax-container', {
                    maxCacheLength: 0,
                    push: false,
                    replace: true,
                    fragment: '#pjax-container',
                    timeout: 8000
                });
            }
        });
</script>
```