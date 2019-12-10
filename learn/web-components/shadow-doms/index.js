function _defineCustomElements (components) {
  components.forEach(function (vDom) {
    const name = vDom.name
    const component = vDom.component
    const extend = vDom.extends || {}

    window.customElements.define(name, component, extend)
  })
}

function _watchCustomElementDefined (components) {
  const promises = components.map(function (vDom) {
    return window.customElements.whenDefined(vDom.name)
  })

  Promise.all(promises)
    .then(function () {
      console.log('【CUSTOM ELEMENTS】组件定义完成')
    })
    .catch(function (error) {
      throw error
    })
}

function defineElement (components) {
  _watchCustomElementDefined(components)
  _defineCustomElements(components)
}
