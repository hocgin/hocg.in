------
title: hexo 使用小记
date: 2016-03-15 21:31:42
tags:
  - Hexo
categories:
  - Other
------
  这是一篇关于如何使用hexo的收集Box **>** 不定期更新吧！
  **update** 2017年01月12日10:33:55
<!--more-->
> 参照 [hexo 官方文档](https://hexo.io/zh-cn/docs/tag-plugins.html)
> 参照 [next 主题](http://theme-next.iissnan.com/theme-settings.html)
> 参照 [next 主题 for github](https://github.com/iissnan/hexo-theme-next/wiki/%E5%88%9B%E5%BB%BA%E5%88%86%E7%B1%BB%E9%A1%B5%E9%9D%A2)
> 参照 [更多扩展使用](http://www.tuicool.com/articles/AfQnQjy/)


## md文档头部

参数 |	描述 |	默认值
----|----|---------
layout | 布局 |有哪些layout呢，请到 scaffolds 目录下查看，这些文件名称就是layout名称
title | 标题 |
date | 建立日期 |文件建立日期
updated |更新日期 |文件更新日期
comments |开启文章的评论功能 |true
tags |标签（不适用于分页） |
categories |分类（不适用于分页） |
permalink |覆盖文章网址 |
description| 添加本页描述| 默认所有
photos | 添加图片|

## hexo 基础命令
```shell
# 清除
$ hexo clean
# 上传 GitHub
$ hexo deploy
# 新建文章
$ hexo new "postName"
# 新建页面
hexo new page "pageName"
# 生成静态页面至public目录
hexo generate
# 开启预览访问端口（默认端口4000，'ctrl + c'关闭server）
hexo server
# 将.deploy目录部署到GitHub
hexo deploy
```

## .md 扩展
1. 扩大图片宽度
```
{% fi image-url, alt, title %}
```

2. 显示 更多按钮
```md
  以上是摘要
  <!--more-->
  以下是余下全文
```

3. 使用标签别名
```
{% cq %} 标签别名 {% endcq %}
```

## 可能遇到的问题
1. 当你发布的`.md`文件中携带逗号`,`(已知)，在`多说`评论插件中将无法识别评论条数(就是文章顶部那个)
> 借鉴办法：替换文件命名，将逗号已`_`或` `分隔

## 换电脑后, 如何迁移？
```shell
// 为了使用hexo d来部署到git上，需要安装
npm install hexo-deployer-git --save
// 为了建立RSS订阅，需要安装
npm install hexo-generator-feed --save
// 为了建立站点地图，需要安装
npm install hexo-generator-sitemap --save
```

- 可能会遇到 './build/Release/DTraceProviderBindings'] code: 'MODULE_NOT_FOUND'

```shell
npm install hexo --no-optional
```
## End
