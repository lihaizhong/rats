# Vue 学习

## Object.defineProperty

`Object.defineProperty(obj, prop, descriptor)`

### 参数

- obj: 要在其上定义属性的对象。
- prop: 要定义或者修改的属性的名称。
- descriptor: 将被定义或修改的属性描述符。

### 返回值

被传递给函数的对象。

### 属性描述符

属性描述符分为两种主要形式：**数据描述符**和**存取描述符**。

### 数据描述符

`configurable`、`enumerable`、`value`、`writable`

### 存取描述符

`configurable`、`enumerable`、`get`、`set`

## Vue config属性

```javascript
export type Config = {
  // user
  optionMergeStrategies: { [key: string]: Function };
  silent: boolean;
  productionTip: boolean;
  performance: boolean;
  devtools: boolean;
  errorHandler: ?(err: Error, vm: Component, info: string) => void;
  warnHandler: ?(msg: string, vm: Component, trace: string) => void;
  ignoredElements: Array<string | RegExp>;
  keyCodes: { [key: string]: number | Array<number> };

  // platform
  isReservedTag: (x?: string) => boolean;
  isReservedAttr: (x?: string) => boolean;
  parsePlatformTagName: (x: string) => string;
  isUnknownElement: (x?: string) => boolean;
  getTagNamespace: (x?: string) => string | void;
  mustUseProp: (tag: string, type: ?string, name: string) => boolean;

  // private
  async: boolean;

  // legacy
  _lifecycleHooks: Array<string>;
};
```

## Vue.config 合并策略

- activated: **mergeHook**
- beforeCreate: **mergeHook**
- created: **mergeHook**
- beforeUpdate: **mergeHook**
- updated: **mergeHook**
- beforeMount: **mergeHook**
- mounted: **mergeHook**
- deactivated: **mergeHook**
- beforeDestroy: **mergeHook**
- destroyed: **mergeHook**
- errorCaptured: **mergeHook**
- serverPrefetch: **mergeHook**

---

- data: L1255(合并核心方法**mergeDataOrFn**)
- provide: **mergeDataOrFn**
- computed: L1375(合并核心方法**extend**)
- props: L1375(合并核心方法**extend**)
- methods: L1375(合并核心方法**extend**)
- inject: L1375(合并核心方法**extend**)

---

- components: mergeAssets（核心合并方法**extend**）
- directives: mergeAssets（核心合并方法**extend**）
- filters: mergeAssets（核心合并方法**extend**）

---

- render: **defaultStrat**
- el: **defaultStrat**
- propsData: **defaultStrat**

---

- watch: L1342(合并核心方法**与mergeHook类似**)

---

Vue的config合并策略总共就只有这五种。e**xtend**和**mergeDataOrFn**属于两个大类的合并策略，对这两种合并策略进行简单的封装优化，形成了相对特定的合并策略。

**defaultStrat**的合并策略非常的简单粗暴，是一种非黑即白的策略模式。默认策略的返回值不是parent就是child，不会出现两者同时存在的情况。

**mergeHook**的策略是原样保持parent和child，将parent和child合并到一个数组中，执行的时候按照在数组的顺序来调用，*用于Vue的生命周期钩子*。

*data*和*provide*的合并策略主要实现使用了**mergeDataOrFn**。data只是在合并前对child是否是`function`做了判断，由于组件可以创建多个实例，如果直接使用对象引用，会导致多个组件之间相互影响的情况。

*computed*、*props*、*methods*、*inject*的合并策略主要实现使用了**extend**。**extend主要作用是浅拷贝**，所以这些属性在合并的时候child会覆盖parent中同名的属性。**这个在开发是需要特别注意。**

**mergeAssets**的策略核心方法也是**extend**。在合并时基本表现和computed、props、methods、inject类似。

watch的合并策略比较特殊，watch也是用了extend方法，但是extend在其中只是用于对象浅拷贝。**真正的合并部分是将parent和child保存在同一个数组中，这与mergeHook非常相似。**

## Vue 声明周期

```text
new Vue(options);

-- initProxy() 设置_renderProxy属性
-- initLifecycle() 初始化`$parent`、`$root`、`$children`、`$refs`、`_watcher`、`_inactive`、`_directInactive`、`_isMounted`、`_isDestroyed`、`_isBeingDestroyed`属性
-- initEvents() 初始化`_events`、`_hasHookEvent`属性
-- initRender() 初始化`_vnode`、`$slots`、`$scopedSlots`、`$vnode`、`_c`、`$createElement`、`$attrs`、`$listeners`属性

- HOOK beforeCreate

-- initInjections()
-- initState() 初始化`_watcher`属性，解析`props`、`methods`、`data`、`computed`、`watch`属性
-- initProvide()

- HOOK created

-- vm.$mounted(el)

```

## Vue.extend

### 执行过程

1. 检查该内部组件是否已经被缓存。
2. 判断是否有`name`属性。（如果有，会检查`name`是否合法）
3. 创建一个VueComponent构造函数。（该函数继承了Vue的prototype属性，并将当前Vue的options配置与当前组件的options进行合并）
4. 继承静态扩展方法`extend`、`mixin`、`use`。
5. 继承静态工具方法`component`、`filter`、`directive`。
6. 将自身的映射数据原本保存下来，方便检查数据更新。
7. 缓存组件自身。
8. 返回当前组件构造函数。
