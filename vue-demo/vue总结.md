# Vue总结

1. 模板必须有一个包含元素

``` javascript
Vue.component('comp-name', {
    template: '<p></p><p></p>' // error
    template: '<div><p></p><p></p></div>' // right
    template: '<template><p></p><p></p></template>' // error
})
```
