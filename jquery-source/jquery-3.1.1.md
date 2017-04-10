# 扩展知识

## nodeType

```
1: 元素节点（比如：<div>）
2: 文本节点（elem或者attr中的文本内容）
8: 注释节点
9: 文档节点（Document）
10: 描述文档类型的DocumentType节点（比如：<!DOCTYPE html>）
11: DocumentFragment节点
```

# jQuery

## jQuery.fn

- jquery
- constructor
- length
- toArray
- get
- pushStack

 ```
利用constructor方法创建一个新的jQuery对象，并与当前的元素集合进行合并。
将旧的jQuery对象保存在新的jQuery的preObject属性当中。在map, slice, eq等都有使用。
```

- each
- map
- slice
- first
- last
- eq
- end

```
返回上一个jQuery对象。如果没有上一个，返回当前的jQuery对象的新实例。
```

- map
- sort
- splice

## jQuery.extend(args), jQuery.fn.extend(args)

```
// 判断是否是深拷贝
target === "boolean"
// 判断是否是对象或者函数，如果都不是，重置为对象
typeof target !== "object" && isNotFunction(target)
// 如果只传了一个参数，就扩充jQuery自己
i === length
// 拷贝操作：关键
// 是否深拷贝 && 复制参数是否存在 && （复制参数是否是普通对象 || 复制对象是否是数组）
// 如果是数组
// 如果是对象
// 递归执行extend
// 如果复制参数不是undefined
```

## jQuery.extend

- expando
- isReady
- error
- noop
- isFunction
- isArray
- isWindow
- isNumeric

```
如果参数类型是number或者string，并且参数减去数字化后的参数不是NaN
处理 空字符串、十六进制字符串、无限大值
!isNaN("" - parseFloat(""))   true
!isNaN(Infinity - parseFloat(Infinity))   true
!isNaN(0x444 - parseFloat(0x444))   true
```

- isPlainObject

```
如果不是object，返回 false
如果是没有prototype的对象，返回 true
如果对象的constructor属性的方法字符串全等于Object的方法字符创
typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString
```

- isEmptyObject
- type
- globalEval
- camelCase
- nodeName

```
判断elem是否是指定的标签
```

- each

```
如果是数组或者类数组，使用for循环调用
否则使用for...in...循环调用
```

- trim
- makeArray

```
内部使用
如果是数组或者类数组，调用合并操作
如果不是，调用数组的push
```

- inArray
- merge

```
参数二合并到参数一上
```

- grep

```
查找满足过滤函数的数组元素，不影响原数组。
```

- map
- guid
- proxy

```
模拟bind方法
事件绑定时，在同一个DOM元素上绑定两个方法（方法都是foo，绑定的上下文分别是context1， context2），当移除时，会把所有的foo都移除（不理会上下文）。
原因：foo（上下文为context1，context2）的guid是相同的
```

- now
- support

## class2type()

```
第62行  class2type = {}
第522行 class2type = {
          "object Boolean": "boolean",
          "object Number": "number",
          "object String": "string",
          "object Function": "function",
          "object Array": "array",
          "object Date": "Date",
          "object RegExp": "RegExp",
          "object Object": "object",
          "object Error": "error",
          "object Symbol": "symbol"
        }
```

## isArrayLike(obj)

> 527 ~ 542 判断是否是数组或者类数组

## Sizzle

> 543 ~ 2819

```
// 选择器
jQuery.find = Sizzle
// 伪类选择器
jQuery.expr = Sizzle.selectors

// Deprecated
jQuery.expr[":"] = jQuery.expr.pseudos
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort
jQuery.text = Sizzle.getText
jQuery.isXMLDoc = Sizzle.isXML
jQuery.contains = Sizzle.contains
jQuery.escapeSelector = Sizzle.escape
```

## dir(elem, dir, until)

> 2837 ~ 2850 查找所有符合要求的元素节点（nodeType === 1） 返回元素数组

## siblings(n, elem)

> 2853 ~ 2863 查找元素n的兄弟节点，利用n.nextSiblings属性 返回元素数组

## winnow(elements, qualifier, not)

> 2875 ~ 2906

```
过滤器，返回符合要求的元素数组
如果qualifier是函数
如果qualifier是DOM对象
如果qualifier不是字符串
如果是最简单的选择器
如果是复杂选择器
```

## jQuery.filter

> 2908 ~ 2922

## jQuery.fn

- find(selector)

> 2925 ~ 2946

```
如果selector不是字符串，通过jQuery.contains(container, contained)，查找集合
如果selector是字符串，通过Sizzle选择器插件来查找元素
```

- filter(selector)

> 2948 ~ 2950

```
调用了winnow(this, selector || [], false);
```

- not(selector)

> 2951 ~ 2953

```
调用了winnow(this, selector || [], true);
```

- is(selector)

> 2954 ~ 2966

```

```

## jQuery.fn

- has

> 3098 ~ 3110

```

```

- closest
- index
- add
- addBack

## sibling(cur, dir)
