export class Cell extends HTMLElement {
  static tagName = "cc-cell";

  static get observedAttributes() {
    return ["label", "value"];
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "closed" });
    const template = `
    <div class="flex items-center h-11 border-b px-3 bg-slate-50">
      <div>${this.label}</div>
      <div class="flex-1">${this.value}</div>
    </div>
    `;
    shadowRoot.innerHTML = template;
  }

  get label() {
    return this.getAttribute("label");
  }

  set label(value) {
    this.setAttribute("label", value);
  }

  get value() {
    return this.getAttribute("value");
  }

  set value(value) {
    this.setAttribute("value", value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {

    }
  }
}
