// import Quill from "quill"

const Parchment = Quill.import('parchment');

// bold
class BoldStyleAttributor extends Parchment.Attributor.Style {

  add(node) {
    node.style.fontWeight = 'bold';
    return true;
  }

  remove(node) {
    node.style.fontWeight = 'normal';
  }
}
const BoldStyle = new BoldStyleAttributor('bold', 'font-weight', {
  scope: Parchment.Scope.INLINE,
});

// line-height
class lineHeightAttributor extends Parchment.Attributor.Style {}
const lineHeightStyle = new lineHeightAttributor("lineHeight", "line-height", {
  scope: Parchment.Scope.INLINE,
  whitelist: ['20px', '22px', '24px']
});

// 注册扩展
Quill.register({'formats/bold': BoldStyle}, true)
Quill.register({"formats/lineHeight": lineHeightStyle}, true)

// 实例化编辑器
const editor = new Quill("#quill-editor", {
  bounds: "#quill-container",
  debug: "info",
  placeholder: "请在这里添加您的内容",
  theme: "snow",
  readOnly: false,
  modules: {
    toolbar: true
  },
  formats: {}
})

document.querySelector('#q_delta').addEventListener('click', () => {
  console.log('完整的Delta', editor.getContents())
})

document.querySelector('#q_html').addEventListener('click', () => {
  console.log('完整的HTML', editor.root.innerHTML)
})
