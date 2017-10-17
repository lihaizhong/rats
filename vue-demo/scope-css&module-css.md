# Vue CSS

## scope css

1. 可以同时包含`scoped`属性的style标签和non-scoped属性的style标签。
1. 子组件的根节点将被父组件的`scoped`样式和子组件的`scoped`样式影响。
1. 部分不受影响。
1. **`scoped`的使用不会消除对`class`的依赖**。因为浏览器渲染`class`或者`id`选择器的性能优于属性选择器。
1. **组件递归中的后代选择器！**

## module css
