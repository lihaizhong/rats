import { Cell } from "./Cell";

const components = [
  {
    name: Cell.tagName,
    component: Cell
  }
];

function defineCustomElements() {
  components.forEach((vDom) => {
    const name = vDom.name;
    const component = vDom.component;
    const options = vDom.options || {};

    window.customElements.define(name, component, options);
  });
}

function watchCustomElementDefined() {
  const promises = components.map(function (vDom) {
    return window.customElements.whenDefined(vDom.name);
  });

  Promise.all(promises)
    .then(() => {
      console.log("【CUSTOM ELEMENTS】组件定义完成");
    })
}

export function install() {
  defineCustomElements();
  watchCustomElementDefined();
}
