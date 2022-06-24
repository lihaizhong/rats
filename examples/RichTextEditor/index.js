const editor = new Quill("#quill-editor", {
  bounds: "#quill-container",
  debug: "info",
  placeholder: "请在这里添加您的内容",
  theme: "snow",
  readOnly: false,
  modules: {
    toolbar: []
  },
  formats: {}
})
