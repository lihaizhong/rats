import { Cell } from "./Cell";

const components = [
  {
    name: Cell.tagName,
    component: Cell
  }
];

export function initWebComponents() {
  components.forEach((vDom) => {
    const name = vDom.name;
    const component = vDom.component;
    const options = vDom.options || {};

    window.customElements.define(name, component, options);
  });

  const promises = components.map(function (vDom) {
    return window.customElements.whenDefined(vDom.name);
  });

  return Promise.all(promises)
}
