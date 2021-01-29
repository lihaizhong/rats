import { isValidProperty } from './toolbox'

const parseSelectValues = (values, dataSource = []) => {
  if (values instanceof Array) {
    let list = dataSource

    values.forEach(value => {
      if (!value.name) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i]

          if (item.id === value.id) {
            value.name = item.name
            list = item.children || []
            break
          }
        }
      }
    })

    return values
  }

  return null
}

export default function parseComponentValue (componentType, value, dataSource = []) {
  switch (componentType) {
    case 'Input': // 输入框
    case 'Textarea': // 输入框
    case 'TelVerifyCode': // 手机验证码
      if (!['number', 'string'].includes(typeof value)) {
        return ''
      }

      break
    case 'Select': // 选择框
      if (!isValidProperty(value)) {
        return null
      }

      try {
        return parseSelectValues(JSON.parse(value), dataSource)
      } catch (ex) {
        console.error('Initial Select Component Error', ex)
        return null
      }
    case 'DateTime': // 日期选择框
      // 判断是否是有效的时间数据
      if (!['number', 'string'].includes(typeof value)) {
        return null
      }

      break
    case 'Switch':
      if (!['number', 'boolean'].includes(typeof value)) {
        return false
      }

      break
    case 'Address': // 地址选择框
      if (!isValidProperty(value)) {
        return null
      }

      try {
        return JSON.parse(value)
      } catch (ex) {
        console.error('Initial Address Component Error', ex)
        return null
      }
    case 'Upload': // 常规的图片上传
    case 'IDCardUpload': // 身份证上传
    case 'ExitEntryPermitUpload': // 港澳台上传
    case 'BankCardUpload': // 银行卡上传
      if (!['string'].includes(typeof value)) {
        return ''
      }

      break
    default: // 默认组件
  }

  return value
}
