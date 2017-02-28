## init.js

### 介绍
实现jQuery实例对象的重载，存在以下三个参数
1. selector 选择器
2. context 上下文
3. root 根
    + 如果不存在，root = rootQuery,即jQuery(document)
    + 用于确定上下文
    + 用于ready操作

### 解析

jQuery()
> 如果第一个参数为假值，返回jQuery实例对象

jQuery(selector[, context])
> 一个包含CSS选择器的字符串
**注：** 这里的context必须是DOM元素、文档或者作为上下文的jQuery对象

jQuery(element)
> 一个用于封装成jQuery对象的DOM元素

jQuery(elements)
> 一个用于封装成jQuery对象的DOM元素数组

jQuery(object)
> 一个普通的对象包装在一个jQuery对象

jQuery(jQuery object)
> 一个用于克隆的jQuery对象

jQuery(html[, ownerDocument])
> 如果是html片段，且匹配到ownerDocument

jQuery(html, props)
> 如果是单标签的html片段，将属性添加到html片段上

jQuery(callback)
> 如果是回调函数，当DOM加载完成后执行callback

### 引用

+ ../core
+ ../var/document.js
+ ../var/rsingleTag.js
+ ../traversing/findFilter.js


