import Toolbox from '../library/utils/Toolbox'
import { catchError } from "../library/utils/Toast"
import EnvConfig from "../library/config/index"

const BASE_URL = EnvConfig.baseUrl

// 判断是否是完整的http(s)请求
const URL_EXP = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/

/**
 * 解析options
 * @param {object} options requestOptions
 * @return {object} requestOptions
 */
function parseOptions(options = {}) {
  if (!URL_EXP.test(options.url)) {
    options.url = Toolbox.jointUrl(BASE_URL + options.url, options.params)
    delete options.params
  }

  const headers = {}
  const openId = wx.getStorageSync("__CT_OPEN_ID__")

  if (openId) {
    headers.openId = openId
  }

  options.header = Object.assign(headers, options.header)

  return options
}

/**
 * 解析response
 * @param {Promise} promise
 */
function transformResponse (promise, hasToast) {
  return promise
    .then(result => {
      let data = result.data

      if (typeof result.data === 'string') {
        try {
          data = JSON.parse(result.data)
        } catch(ex) {
          data = result.data
        }
      }

      if (data?.success) {
        return Promise.resolve(data.value)
      }

      return Promise.reject(data)
    })
    .catch((error) => {
      if (hasToast !== false) {
        catchError(error?.message)
      }

      return Promise.reject(error)
    });
}

/**
 * 工具方法
 */
const HttpUtils = {
  showLoadingCount: 0,
  showLoading(hasLoading) {
    if (hasLoading) {
      wx.showLoading({
        title: "加载中",
        mask: true,
        success: () => {
          HttpUtils.showLoadingCount++
        }
      })
    }
  },
  hideLoading(hasLoading) {
    if (hasLoading) {
      HttpUtils.showLoadingCount--

      if (HttpUtils.showLoadingCount <= 0) {
        HttpUtils.showLoadingCount = 0

        if (typeof wx.hideLoading === "function") {
          wx.hideLoading()
        }
      }
    }
  }
}

/**
 * request请求
 * @param {object} options
 */
export function request(options = {}) {
  // 自定义可选项
  const { hasLoading, hasToast } = options

  HttpUtils.showLoading(hasLoading)

  delete options.hasLoading
  delete options.hasToast

  const promise = new Promise((resolve, reject) => {
    wx.request({
      ...parseOptions(options),
      success: (result) => {
        HttpUtils.hideLoading(hasLoading)
        resolve(result)
      },
      fail: (error) => {
        HttpUtils.hideLoading(hasLoading)
        reject(error)
      }
    });
  });

  return transformResponse(promise, hasToast)
}

/**
 * 上传文件
 * @param {object} options
 */
export function uploadFile(options = {}) {
  const { hasLoading, hasToast } = options

  HttpUtils.showLoading(hasLoading)

  delete options.hasLoading
  delete options.hasToast

  const promise = new Promise((resolve, reject) => {
    wx.uploadFile({
      name: 'file',
      ...parseOptions(options),
      success: (result) => {
        HttpUtils.hideLoading(hasLoading)
        resolve(result)
      },
      fail: (error) => {
        HttpUtils.hideLoading(hasLoading)
        reject(error)
      }
    });
  });

  return transformResponse(promise, hasToast)
}

/**
 * Get请求
 * @param {object} options
 */
export function get(options = {}) {
  return request({ ...options, method: "GET" })
}

/**
 * Post请求
 * @param {object} options
 */
export function post(options = {}) {
  return request({
    ...options,
    method: "POST",
    header: {
      ...options.header,
      "content-type": "application/json"
    }
  })
}

export default {
  BASE_URL,
  request,
  uploadFile,
  get,
  post
}
