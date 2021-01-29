import { isPrimitive, generateKey } from './toolbox'
import parseComponentValue from './parseComponentValue'

const generateComponentKey = name => generateKey(name)
const modifyOptions = target => (key, value) => {
  target[key] = value
}
const modifyOptionsItem = (target, property) => (key, value) => {
  target[property][key] = value
}

function parseProperties (target = {}) {
  Object.keys(target).forEach(key => {
    const value = target[key]

    if (!isPrimitive(value)) {
      try {
        target[key] = JSON.parse(value)
      } catch (ex) {
        target[key] = value
      }
    }
  })
}

export default function parseComponentConfigure (config) {
  const {
    component: componentType,
    label,
    name,
    value,
    attrs,
    tip,
    rules = {},
    when,
    hooks,
    dataSource
  } = config
  const options = {}
  const setOption = modifyOptions(options)
  const setAttr = modifyOptionsItem(options, 'attrs')

  parseProperties(rules)
  parseProperties(attrs)
  setOption('isFirstRender', true)
  setOption('componentKey', generateComponentKey(name))
  setOption('name', name)
  // 组件属性集合
  setOption('attrs', {
    ...attrs,
    label
    // rules: parseRules(rules, { name, label })
  })

  if (rules.required) {
    setAttr('required', true)
  }

  if (typeof tip === 'string') {
    setAttr('tip', tip)
  }

  // 用于判断组件的创建与销毁
  setOption('when', form => {
    if (typeof when === 'string' && when !== '') {
      const obj = {}

      Object.defineProperty(obj, {
        get (key) {
          return form[key]
        }
      })

      // eslint-disable-next-line no-new-func
      return new Function('form', `try { return ${when} } catch (ex) { console.error(ex) }`)(obj)
    }

    return true
  })

  setOption('value', parseComponentValue(componentType, value, dataSource))

  // 确定真实组件名称
  switch (componentType) {
    case 'Input': // 输入框
      setOption('componentName', 'PolymerInputField')
      break
    case 'Textarea': // 输入框
      setOption('componentName', 'PolymerInputField')
      setAttr('type', 'textarea')
      // 如果设置了自动适配高度，但是没有设置rows，则默认为1
      if (attrs.autosize && !attrs.rows) {
        setAttr('rows', 1)
      }
      break
    case 'Select': // 选择框
      setOption('componentName', 'PolymerSelectField')
      break
    case 'DateTime': // 日期选择框
      setOption('componentName', 'PolymerDateTimeField')
      break
    case 'Switch':
      setOption('componentName', 'PolymerSwitchField')
      break
    case 'Address': // 地址选择框
      setOption('componentName', 'PolymerAddressField')
      break
    case 'Upload': // 常规的图片上传
      setOption('componentName', 'PolymerUploadField')
      break
    case 'IDCardUpload': // 身份证上传
      setOption('componentName', 'PolymerIDCardUploadField')
      break
    case 'ExitEntryPermitUpload': // 港澳台上传
      setOption('componentName', 'PolymerExitEntryPermitUploadField')
      break
    case 'BankCardUpload': // 银行卡上传
      setOption('componentName', 'PolymerBankCardUploadField')
      break
    case 'TelVerifyCode': // 手机验证码
      setOption('componentName', 'PolymerTelVerifyCodeField')
      break
    default: // 默认组件
      setOption('componentName', componentType)
  }

  return options
}
