/**
 * Created by sky on 16/10/13.
 * Ajax Level 1 Implemention
 */

(function(global) {
  "use strict";

  // Ajax 构造函数
  function Ajax(options) {
    this._setting = Ajax.extend(
      {},
      Ajax.defaultSettings,
      /* 全局设置 */ global.ajax.setup,
      options
    );
    this.init();
  }

  // 基础参数设置
  Ajax.defaultSettings = {
    /* Params */
    url: "",
    method: "GET",
    data: null,
    dataType: "",
    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    // accepts: null,
    // converters: null,
    async: true,
    user: "",
    password: "",
    cache: true,
    headers: null,
    context: null,

    /* Callback Function */
    beforeSend: null,
    success: null,
    error: null,
    complete: null
  };

  // 常用工具集
  Ajax.util = {
    getBaseType: function(o) {
      return Object.prototype.toString
        .call(o)
        .slice(8, -1)
        .toLowerCase();
    },
    isObject: function(o) {
      return this.getBaseType(o) === "object";
    },
    isFunction: function(fn) {
      return typeof fn === "function";
    },
    isString: function(str) {
      return typeof str === "string";
    }
  };

  /**
   * 数据扩展合并（浅拷贝）
   * @param target
   * @return {Object}
   */
  Ajax.extend = function(target) {
    var len = arguments.length,
      item,
      key,
      i = 1;

    if (len == 0) {
      return {};
    }

    if (Ajax.util.isObject(target)) {
      target = {};
    }

    for (; i < len; i++) {
      item = arguments[i];
      if (
        !Ajax.util.isObject(item) ||
        item === Ajax ||
        item === Ajax.prototype ||
        target === item
      ) {
        continue;
      }
      for (key in item) {
        if (item.hasOwnProperty(key)) {
          target[key] = item[key];
        }
      }
    }

    return target;
  };

  /** GET
   * 如果是GET请求，将参数添加到url上
   * @param url
   * @param params
   * @return {String}
   */
  Ajax.addURLParams = function(url, params, cache) {
    var name, value;

    if (!Ajax.util.isString(url)) {
      throw new Error("url必须是字符串!");
    }

    if (Ajax.util.isObject(params)) {
      // 将参数追加到url后面
      for (name in params) {
        value = params[name];

        if (params.hasOwnProperty(name)) {
          url += url.indexOf("?") == -1 ? "?" : "&";
          url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
        }
      }
    }

    // 是否添加缓存
    if (cache) {
      url += url.indexOf("?") == -1 ? "?" : "&";
      url += "_=" + new Date().getTime();
    }

    return url;
  };

  /**
   * 设置自定义header
   * @param xhr
   * @param headers
   */
  Ajax.setRequestHeaders = function(xhr, headers) {
    var key, value;

    if (Ajax.util.isObject(headers)) {
      for (key in headers) {
        value = headers[key];

        // 如果 key 不是 header 的自有属性或者 value 为 undefined，则跳过
        if (!headers.hasOwnProperty(key) || value === undefined) {
          continue;
        }

        // 设置自定义的头部信息
        xhr.setRequestHeader(key, value);
      }
    }
  };

  /**
   * 处理并返回处理后的响应数据
   * @param xhr
   * @return {*}
   */
  Ajax.getResponseData = function(xhr) {
    var result;

    if (xhr.responseType === "json") {
      result = xhr.response;
    } else {
      try {
        result = JSON.parse(xhr.responseText);
      } catch (ex) {
        result = xhr.responseText;
      }
    }

    return result;
  };

  Ajax.prototype = {
    constructor: Ajax,
    /**
     * 初始化
     */
    init: function() {
      var self = this,
        setting = self._setting,
        url = setting.url,
        method = setting.method,
        data = setting.data === undefined ? null : setting.data;

      // 创建XMLHttpRequest实例
      var xhr = new XMLHttpRequest();
      self.xhr = xhr;

      // 监听 readystatuschange 事件
      self._onreadyStateChange();

      // 非法url处理
      if (!(Ajax.util.isString(url) && url != "")) {
        url = global.location.href;
      }

      // 如果不是post请求，则认为是get请求
      if (method.toLowerCase() != "post") {
        url = Ajax.addURLParams(url, data, setting.cache);
        data = null;
      }

      xhr.open(method, url, setting.async, setting.user, setting.password);
      // 如果为get请求，data 为 null
      xhr.send(data);
    },
    /**
     * 中止ajax请求
     */
    abort: function() {
      var xhr = this.xhr;
      if (Ajax.util.isObject(xhr)) {
        xhr.abort();
        xhr = null;
      }
    },
    /**
     * 监听 readystatechange 事件
     * @private
     */
    _onreadyStateChange: function() {
      var self = this;

      // 绑定 readystatechange 事件
      self.xhr.onreadystatechange = function() {
        switch (self.xhr.readyState) {
          // 未初始化。尚未调用 open 方法。
          case 0:
            break;
          // 启动。已经调用 open 方法，但尚未调用send方法。
          case 1:
            self._open();
            break;
          // 发送。已经调用 send 方法，但尚未接收到响应。
          case 2:
            break;
          // 接收。已经接收到部分响应数据。
          case 3:
            break;
          // 完成。已经接收到全部响应数据，而且已经可以在客户端使用了。
          case 4:
            self._finish();
            break;
        }
      };
    },
    /**
     * readyState 1
     * open 方法启动后，send 方法启动前，才能设置 http header 头信息
     * @private
     */
    _open: function() {
      var self = this,
        xhr = self.xhr,
        setting = self._setting,
        beforeSend = setting.beforeSend,
        headers = Ajax.extend({}, setting.headers, {
          "X-Requested-With": "XMLHttpRequest"
        });

      if (setting.method.toLowerCase() === "get") {
        delete headers["Content-Type"];
      } else {
        headers["Content-Type"] = setting.contentType;
      }

      // 设置自定义头部信息
      Ajax.setRequestHeaders(xhr, headers);
      xhr.responseType = setting.dataType;
      Ajax.util.isFunction(beforeSend) && beforeSend.call(setting.context, xhr);
    },
    /**
     * readyState 4
     * 整个请求已经完成，结果已经返回，客户端可以访问
     * @private
     */
    _finish: function() {
      var self = this,
        setting = self._setting,
        xhr = self.xhr,
        context = setting.context,
        success = setting.success,
        error = setting.error,
        complete = setting.complete,
        status = xhr.status,
        statusText = xhr.statusText,
        responseData;

      try {
        if ((status >= 200 && status < 300) || status == 304) {
          // 响应成功
          responseData = Ajax.getResponseData(xhr);
          Ajax.util.isFunction(success) &&
            success.call(context, responseData, statusText, xhr);
        } else {
          // 响应失败
          Ajax.util.isFunction(error) &&
            error.call(context, responseData, statusText, xhr);
        }
        // 响应完成
        Ajax.util.isFunction(complete) &&
          complete.call(context, statusText, xhr);
      } catch (ex) {
        console.error(ex);
      }
    }
  };

  /**
   * EXPORTS
   * @param options
   * @return {*}
   */
  var ajax = function(options) {
    // 返回 ajax 实例
    return new Ajax(options);
  };

  global.ajax = ajax;
})(window);
