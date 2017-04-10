# access get/set通用方法

## 参数解析

1. elems        待get/set值的元素
2. fn           回调函数，get/set方法实现
3. key          get/set的key值
4. value        get/set的value值
5. chainable    是否支持链式调用（如果是get，不支持；如果是set，支持）
6. emptyGet     
7. raw          套接字

fn的参数如果只有两位，则表示GET，如果有三位，表示SET。
