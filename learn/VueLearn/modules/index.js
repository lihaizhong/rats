const mixin = {
  data () {
    return {
      message: 'hello vue mixin',
      value: 'mixin value',
      arr: [3, 4, 5, 6],
      obj1: { a: 5, b: 6, c: 7, d: 8 }
    }
  },
  methods: {
    mixinMethods1 () {},
    mixinMethods2 () {}
  }
}

const mixin1 = {
  data () {
    return {
      message: 'hello vue mixin1',
      value: 'mixin value1',
      arr: [7, 8, 9],
      obj1: { b: 9, c: 7, d: 10, e: 78 }
    }
  },
  methods: {
    mixin1Methods1 () {},
    mixin1Methods2 () {}
  }
}

Vue.component('ds-render-template', {
  functional: true,
  render (h, context) {
    return h('div', context.data, [h('template', 'hello render function')])
  }
})

Vue.component('ds-simple-template', {
  data () {
    return {
      message: 'hello simple template'
    }
  },
  created () {
    console.log('second vm: ', this)
  },
  template: `
    <div>
      <p>{{ message }}</p>
      <p>{{ pValue }}</p>
      <p>{{ pValue1 }}</p>
    </div>
  `,
  inject: ['pValue', 'pValue1']
})

Vue.component('ds-template', {
  props: {
    outer: {
      type: String,
      default: 'outer'
    }
  },
  provide: function () {
    return {
      pValue: 'provide template value'
    }
  },
  data () {
    return {
      message: 'ds-template',
      count: 0
    }
  },
  computed: {
    com () {
      return 'dddd'
    }
  },
  created () {
    console.log('first vm: ', this)
  },
  methods: {
    onHandleAddCount () {
      this.count++
    }
  },
  template: `
    <div>
      <p>{{ message }}</p>
      <ds-simple-template></ds-simple-template>
      <p>{{ com }}</p>
      <p>{{ count }}</p>
      <button @click="onHandleAddCount">{{ outer }}</button>
    </div>
  `
})

const DsInternalTemplate = Vue.extend({
  data () {
    return {
      message: 'ds internal template'
    }
  },
  template: `
    <keep-alive>
      <div>{{ message }}</div>
    </keep-alive>
  `
})

const switchTemplates = ['ds-template', 'ds-internal-template']
let templateIndex = 0

const app = new Vue({
  el: '#app',
  provide: function () {
    return {
      pValue: 'provide value',
      pValue1: 'provide root value'
    }
  },
  components: {
    DsInternalTemplate: DsInternalTemplate
  },
  mixins: [mixin, mixin1],
  data () {
    return {
      message: 'hello vue',
      message2: 'hello vue2',
      value: 'hello input',
      arr: [1, 2, 4, 6],
      object: {
        a: 1,
        b: 2,
        c: 3
      },
      dsTemplateComponent: switchTemplates[templateIndex]
    }
  },
  computed: {
    messageComputed () {
      return this.message + ' computed'
    },
    messageComputed2: {
      get () {
        return this.message2 + ' computed'
      }
    }
  },
  watch: {
    message (newVal) {
      if (newVal === '更新消息') {
        this.value = '新的消息'
      }
    },
    object: {
      deep: true,
      handler () {
        console.log('object __ob__: ', this.object.__ob__)
      }
    },
    arr: {
      immediate: true,
      handler () {
        console.log('arr __ob__', this.arr.__ob__)
      }
    }
  },
  mounted () {
    const slf = this
    setTimeout(function delay () {
      slf.arr.push(5)
      slf.object.a = 9
      slf.message = '更新消息'
      // 设置未在$data上预设的属性会报错
      // [Vue warn]: Avoid adding reactive properties to a Vue instance or its root $data at runtime - declare it upfront in the data option.
      // slf.$set(slf.$data, 'd', 4);
      // 删除$data上面的属性会报错
      // [Vue warn]: Avoid deleting properties on a Vue instance or its root $data - just set it to null.
      // slf.$delete(slf.$data, 'a');
    }, 2000)
  },
  methods: {
    instanceMethods1 () {},
    instanceMethods2 () {},
    onHandleSwitchTemplate () {
      templateIndex = (templateIndex + 1) % switchTemplates.length

      this.dsTemplateComponent = switchTemplates[templateIndex]
    }
  },
  template: `
    <div class="vue-learn-main">
      <p :class="{ 'vue-learn-msg': true }">{{ message }}</p>
      <div><input v-model="value" @click.stop="instanceMethods1" /></div>
      <!-- <button @click="onHandleSwitchTemplate">切换组件</button> -->
      <!-- <component :is="dsTemplateComponent" outer="计数器"></component> -->
    </div>
  `
})

console.log('app: ', app)
