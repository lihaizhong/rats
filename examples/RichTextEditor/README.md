# Quill

Quill是一款**API驱动的**、**支持格式和模板定制**的开源Web富文本编辑器。她内部已经拥有了最基础的富文本编辑功能。同时，强大的扩展能力能让你基于她进行二次开发，打造一款属于你的富文本编辑器。

## 测试运行

```bash
npx parcel serve examples/RichTextEditor/index.html --log-level verbose
```

## 内置模块

Quill一共内置了6个模块：

- Clipboard 粘贴板
- History 操作历史
- Keyboard 键盘事件
- Syntax 语法高亮
- Toolbar 工具栏
- Uploader 文件上传

Clipboard、History、Keyboard是Quill必需的内置模块，会自动启动，可以配置但不能取消。
