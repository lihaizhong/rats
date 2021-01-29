// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../node_modules/tapable/lib/util-browser.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

exports.deprecate = function (fn, msg) {
  var once = true;
  return function () {
    if (once) {
      console.warn("DeprecationWarning: " + msg);
      once = false;
    }

    return fn.apply(this, arguments);
  };
};
},{}],"../../node_modules/tapable/lib/Hook.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var util = require("util");

var deprecateContext = util.deprecate(function () {}, "Hook.context is deprecated and will be removed");

var CALL_DELEGATE = function () {
  this.call = this._createCall("sync");
  return this.call.apply(this, arguments);
};

var CALL_ASYNC_DELEGATE = function () {
  this.callAsync = this._createCall("async");
  return this.callAsync.apply(this, arguments);
};

var PROMISE_DELEGATE = function () {
  this.promise = this._createCall("promise");
  return this.promise.apply(this, arguments);
};

var Hook = /*#__PURE__*/function () {
  function Hook() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

    _classCallCheck(this, Hook);

    this._args = args;
    this.name = name;
    this.taps = [];
    this.interceptors = [];
    this._call = CALL_DELEGATE;
    this.call = CALL_DELEGATE;
    this._callAsync = CALL_ASYNC_DELEGATE;
    this.callAsync = CALL_ASYNC_DELEGATE;
    this._promise = PROMISE_DELEGATE;
    this.promise = PROMISE_DELEGATE;
    this._x = undefined;
    this.compile = this.compile;
    this.tap = this.tap;
    this.tapAsync = this.tapAsync;
    this.tapPromise = this.tapPromise;
  }

  _createClass(Hook, [{
    key: "compile",
    value: function compile(options) {
      throw new Error("Abstract: should be overridden");
    }
  }, {
    key: "_createCall",
    value: function _createCall(type) {
      return this.compile({
        taps: this.taps,
        interceptors: this.interceptors,
        args: this._args,
        type: type
      });
    }
  }, {
    key: "_tap",
    value: function _tap(type, options, fn) {
      if (typeof options === "string") {
        options = {
          name: options.trim()
        };
      } else if (_typeof(options) !== "object" || options === null) {
        throw new Error("Invalid tap options");
      }

      if (typeof options.name !== "string" || options.name === "") {
        throw new Error("Missing name for tap");
      }

      if (typeof options.context !== "undefined") {
        deprecateContext();
      }

      options = Object.assign({
        type: type,
        fn: fn
      }, options);
      options = this._runRegisterInterceptors(options);

      this._insert(options);
    }
  }, {
    key: "tap",
    value: function tap(options, fn) {
      this._tap("sync", options, fn);
    }
  }, {
    key: "tapAsync",
    value: function tapAsync(options, fn) {
      this._tap("async", options, fn);
    }
  }, {
    key: "tapPromise",
    value: function tapPromise(options, fn) {
      this._tap("promise", options, fn);
    }
  }, {
    key: "_runRegisterInterceptors",
    value: function _runRegisterInterceptors(options) {
      for (var interceptor of this.interceptors) {
        if (interceptor.register) {
          var newOptions = interceptor.register(options);

          if (newOptions !== undefined) {
            options = newOptions;
          }
        }
      }

      return options;
    }
  }, {
    key: "withOptions",
    value: function withOptions(options) {
      var _this = this;

      var mergeOptions = function (opt) {
        return Object.assign({}, options, typeof opt === "string" ? {
          name: opt
        } : opt);
      };

      return {
        name: this.name,
        tap: function (opt, fn) {
          return _this.tap(mergeOptions(opt), fn);
        },
        tapAsync: function (opt, fn) {
          return _this.tapAsync(mergeOptions(opt), fn);
        },
        tapPromise: function (opt, fn) {
          return _this.tapPromise(mergeOptions(opt), fn);
        },
        intercept: function (interceptor) {
          return _this.intercept(interceptor);
        },
        isUsed: function () {
          return _this.isUsed();
        },
        withOptions: function (opt) {
          return _this.withOptions(mergeOptions(opt));
        }
      };
    }
  }, {
    key: "isUsed",
    value: function isUsed() {
      return this.taps.length > 0 || this.interceptors.length > 0;
    }
  }, {
    key: "intercept",
    value: function intercept(interceptor) {
      this._resetCompilation();

      this.interceptors.push(Object.assign({}, interceptor));

      if (interceptor.register) {
        for (var i = 0; i < this.taps.length; i++) {
          this.taps[i] = interceptor.register(this.taps[i]);
        }
      }
    }
  }, {
    key: "_resetCompilation",
    value: function _resetCompilation() {
      this.call = this._call;
      this.callAsync = this._callAsync;
      this.promise = this._promise;
    }
  }, {
    key: "_insert",
    value: function _insert(item) {
      this._resetCompilation();

      var before;

      if (typeof item.before === "string") {
        before = new Set([item.before]);
      } else if (Array.isArray(item.before)) {
        before = new Set(item.before);
      }

      var stage = 0;

      if (typeof item.stage === "number") {
        stage = item.stage;
      }

      var i = this.taps.length;

      while (i > 0) {
        i--;
        var x = this.taps[i];
        this.taps[i + 1] = x;
        var xStage = x.stage || 0;

        if (before) {
          if (before.has(x.name)) {
            before.delete(x.name);
            continue;
          }

          if (before.size > 0) {
            continue;
          }
        }

        if (xStage > stage) {
          continue;
        }

        i++;
        break;
      }

      this.taps[i] = item;
    }
  }]);

  return Hook;
}();

Object.setPrototypeOf(Hook.prototype, null);
module.exports = Hook;
},{"util":"../../node_modules/tapable/lib/util-browser.js"}],"../../node_modules/tapable/lib/HookCodeFactory.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HookCodeFactory = /*#__PURE__*/function () {
  function HookCodeFactory(config) {
    _classCallCheck(this, HookCodeFactory);

    this.config = config;
    this.options = undefined;
    this._args = undefined;
  }

  _createClass(HookCodeFactory, [{
    key: "create",
    value: function create(options) {
      this.init(options);
      var fn;

      switch (this.options.type) {
        case "sync":
          fn = new Function(this.args(), '"use strict";\n' + this.header() + this.contentWithInterceptors({
            onError: function (err) {
              return "throw ".concat(err, ";\n");
            },
            onResult: function (result) {
              return "return ".concat(result, ";\n");
            },
            resultReturns: true,
            onDone: function () {
              return "";
            },
            rethrowIfPossible: true
          }));
          break;

        case "async":
          fn = new Function(this.args({
            after: "_callback"
          }), '"use strict";\n' + this.header() + this.contentWithInterceptors({
            onError: function (err) {
              return "_callback(".concat(err, ");\n");
            },
            onResult: function (result) {
              return "_callback(null, ".concat(result, ");\n");
            },
            onDone: function () {
              return "_callback();\n";
            }
          }));
          break;

        case "promise":
          var errorHelperUsed = false;
          var content = this.contentWithInterceptors({
            onError: function (err) {
              errorHelperUsed = true;
              return "_error(".concat(err, ");\n");
            },
            onResult: function (result) {
              return "_resolve(".concat(result, ");\n");
            },
            onDone: function () {
              return "_resolve();\n";
            }
          });
          var code = "";
          code += '"use strict";\n';
          code += this.header();
          code += "return new Promise((function(_resolve, _reject) {\n";

          if (errorHelperUsed) {
            code += "var _sync = true;\n";
            code += "function _error(_err) {\n";
            code += "if(_sync)\n";
            code += "_resolve(Promise.resolve().then((function() { throw _err; })));\n";
            code += "else\n";
            code += "_reject(_err);\n";
            code += "};\n";
          }

          code += content;

          if (errorHelperUsed) {
            code += "_sync = false;\n";
          }

          code += "}));\n";
          fn = new Function(this.args(), code);
          break;
      }

      this.deinit();
      return fn;
    }
  }, {
    key: "setup",
    value: function setup(instance, options) {
      instance._x = options.taps.map(function (t) {
        return t.fn;
      });
    }
    /**
     * @param {{ type: "sync" | "promise" | "async", taps: Array<Tap>, interceptors: Array<Interceptor> }} options
     */

  }, {
    key: "init",
    value: function init(options) {
      this.options = options;
      this._args = options.args.slice();
    }
  }, {
    key: "deinit",
    value: function deinit() {
      this.options = undefined;
      this._args = undefined;
    }
  }, {
    key: "contentWithInterceptors",
    value: function contentWithInterceptors(options) {
      var _this = this;

      if (this.options.interceptors.length > 0) {
        var onError = options.onError;
        var onResult = options.onResult;
        var onDone = options.onDone;
        var code = "";

        for (var i = 0; i < this.options.interceptors.length; i++) {
          var interceptor = this.options.interceptors[i];

          if (interceptor.call) {
            code += "".concat(this.getInterceptor(i), ".call(").concat(this.args({
              before: interceptor.context ? "_context" : undefined
            }), ");\n");
          }
        }

        code += this.content(Object.assign(options, {
          onError: onError && function (err) {
            var code = "";

            for (var _i = 0; _i < _this.options.interceptors.length; _i++) {
              var _interceptor = _this.options.interceptors[_i];

              if (_interceptor.error) {
                code += "".concat(_this.getInterceptor(_i), ".error(").concat(err, ");\n");
              }
            }

            code += onError(err);
            return code;
          },
          onResult: onResult && function (result) {
            var code = "";

            for (var _i2 = 0; _i2 < _this.options.interceptors.length; _i2++) {
              var _interceptor2 = _this.options.interceptors[_i2];

              if (_interceptor2.result) {
                code += "".concat(_this.getInterceptor(_i2), ".result(").concat(result, ");\n");
              }
            }

            code += onResult(result);
            return code;
          },
          onDone: onDone && function () {
            var code = "";

            for (var _i3 = 0; _i3 < _this.options.interceptors.length; _i3++) {
              var _interceptor3 = _this.options.interceptors[_i3];

              if (_interceptor3.done) {
                code += "".concat(_this.getInterceptor(_i3), ".done();\n");
              }
            }

            code += onDone();
            return code;
          }
        }));
        return code;
      } else {
        return this.content(options);
      }
    }
  }, {
    key: "header",
    value: function header() {
      var code = "";

      if (this.needContext()) {
        code += "var _context = {};\n";
      } else {
        code += "var _context;\n";
      }

      code += "var _x = this._x;\n";

      if (this.options.interceptors.length > 0) {
        code += "var _taps = this.taps;\n";
        code += "var _interceptors = this.interceptors;\n";
      }

      return code;
    }
  }, {
    key: "needContext",
    value: function needContext() {
      for (var tap of this.options.taps) {
        if (tap.context) return true;
      }

      return false;
    }
  }, {
    key: "callTap",
    value: function callTap(tapIndex, _ref) {
      var {
        onError: onError,
        onResult: onResult,
        onDone: onDone,
        rethrowIfPossible: rethrowIfPossible
      } = _ref;
      var code = "";
      var hasTapCached = false;

      for (var i = 0; i < this.options.interceptors.length; i++) {
        var interceptor = this.options.interceptors[i];

        if (interceptor.tap) {
          if (!hasTapCached) {
            code += "var _tap".concat(tapIndex, " = ").concat(this.getTap(tapIndex), ";\n");
            hasTapCached = true;
          }

          code += "".concat(this.getInterceptor(i), ".tap(").concat(interceptor.context ? "_context, " : "", "_tap").concat(tapIndex, ");\n");
        }
      }

      code += "var _fn".concat(tapIndex, " = ").concat(this.getTapFn(tapIndex), ";\n");
      var tap = this.options.taps[tapIndex];

      switch (tap.type) {
        case "sync":
          if (!rethrowIfPossible) {
            code += "var _hasError".concat(tapIndex, " = false;\n");
            code += "try {\n";
          }

          if (onResult) {
            code += "var _result".concat(tapIndex, " = _fn").concat(tapIndex, "(").concat(this.args({
              before: tap.context ? "_context" : undefined
            }), ");\n");
          } else {
            code += "_fn".concat(tapIndex, "(").concat(this.args({
              before: tap.context ? "_context" : undefined
            }), ");\n");
          }

          if (!rethrowIfPossible) {
            code += "} catch(_err) {\n";
            code += "_hasError".concat(tapIndex, " = true;\n");
            code += onError("_err");
            code += "}\n";
            code += "if(!_hasError".concat(tapIndex, ") {\n");
          }

          if (onResult) {
            code += onResult("_result".concat(tapIndex));
          }

          if (onDone) {
            code += onDone();
          }

          if (!rethrowIfPossible) {
            code += "}\n";
          }

          break;

        case "async":
          var cbCode = "";
          if (onResult) cbCode += "(function(_err".concat(tapIndex, ", _result").concat(tapIndex, ") {\n");else cbCode += "(function(_err".concat(tapIndex, ") {\n");
          cbCode += "if(_err".concat(tapIndex, ") {\n");
          cbCode += onError("_err".concat(tapIndex));
          cbCode += "} else {\n";

          if (onResult) {
            cbCode += onResult("_result".concat(tapIndex));
          }

          if (onDone) {
            cbCode += onDone();
          }

          cbCode += "}\n";
          cbCode += "})";
          code += "_fn".concat(tapIndex, "(").concat(this.args({
            before: tap.context ? "_context" : undefined,
            after: cbCode
          }), ");\n");
          break;

        case "promise":
          code += "var _hasResult".concat(tapIndex, " = false;\n");
          code += "var _promise".concat(tapIndex, " = _fn").concat(tapIndex, "(").concat(this.args({
            before: tap.context ? "_context" : undefined
          }), ");\n");
          code += "if (!_promise".concat(tapIndex, " || !_promise").concat(tapIndex, ".then)\n");
          code += "  throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise".concat(tapIndex, " + ')');\n");
          code += "_promise".concat(tapIndex, ".then((function(_result").concat(tapIndex, ") {\n");
          code += "_hasResult".concat(tapIndex, " = true;\n");

          if (onResult) {
            code += onResult("_result".concat(tapIndex));
          }

          if (onDone) {
            code += onDone();
          }

          code += "}), function(_err".concat(tapIndex, ") {\n");
          code += "if(_hasResult".concat(tapIndex, ") throw _err").concat(tapIndex, ";\n");
          code += onError("_err".concat(tapIndex));
          code += "});\n";
          break;
      }

      return code;
    }
  }, {
    key: "callTapsSeries",
    value: function callTapsSeries(_ref2) {
      var _this2 = this;

      var {
        onError: onError,
        onResult: onResult,
        resultReturns: resultReturns,
        onDone: onDone,
        doneReturns: doneReturns,
        rethrowIfPossible: rethrowIfPossible
      } = _ref2;
      if (this.options.taps.length === 0) return onDone();
      var firstAsync = this.options.taps.findIndex(function (t) {
        return t.type !== "sync";
      });
      var somethingReturns = resultReturns || doneReturns;
      var code = "";
      var current = onDone;
      var unrollCounter = 0;

      var _loop = function (j) {
        var i = j;
        var unroll = current !== onDone && (_this2.options.taps[i].type !== "sync" || unrollCounter++ > 20);

        if (unroll) {
          unrollCounter = 0;
          code += "function _next".concat(i, "() {\n");
          code += current();
          code += "}\n";

          current = function () {
            return "".concat(somethingReturns ? "return " : "", "_next").concat(i, "();\n");
          };
        }

        var done = current;

        var doneBreak = function (skipDone) {
          if (skipDone) return "";
          return onDone();
        };

        var content = _this2.callTap(i, {
          onError: function (error) {
            return onError(i, error, done, doneBreak);
          },
          onResult: onResult && function (result) {
            return onResult(i, result, done, doneBreak);
          },
          onDone: !onResult && done,
          rethrowIfPossible: rethrowIfPossible && (firstAsync < 0 || i < firstAsync)
        });

        current = function () {
          return content;
        };
      };

      for (var j = this.options.taps.length - 1; j >= 0; j--) {
        _loop(j);
      }

      code += current();
      return code;
    }
  }, {
    key: "callTapsLooping",
    value: function callTapsLooping(_ref3) {
      var {
        onError: onError,
        onDone: onDone,
        rethrowIfPossible: rethrowIfPossible
      } = _ref3;
      if (this.options.taps.length === 0) return onDone();
      var syncOnly = this.options.taps.every(function (t) {
        return t.type === "sync";
      });
      var code = "";

      if (!syncOnly) {
        code += "var _looper = (function() {\n";
        code += "var _loopAsync = false;\n";
      }

      code += "var _loop;\n";
      code += "do {\n";
      code += "_loop = false;\n";

      for (var i = 0; i < this.options.interceptors.length; i++) {
        var interceptor = this.options.interceptors[i];

        if (interceptor.loop) {
          code += "".concat(this.getInterceptor(i), ".loop(").concat(this.args({
            before: interceptor.context ? "_context" : undefined
          }), ");\n");
        }
      }

      code += this.callTapsSeries({
        onError: onError,
        onResult: function (i, result, next, doneBreak) {
          var code = "";
          code += "if(".concat(result, " !== undefined) {\n");
          code += "_loop = true;\n";
          if (!syncOnly) code += "if(_loopAsync) _looper();\n";
          code += doneBreak(true);
          code += "} else {\n";
          code += next();
          code += "}\n";
          return code;
        },
        onDone: onDone && function () {
          var code = "";
          code += "if(!_loop) {\n";
          code += onDone();
          code += "}\n";
          return code;
        },
        rethrowIfPossible: rethrowIfPossible && syncOnly
      });
      code += "} while(_loop);\n";

      if (!syncOnly) {
        code += "_loopAsync = true;\n";
        code += "});\n";
        code += "_looper();\n";
      }

      return code;
    }
  }, {
    key: "callTapsParallel",
    value: function callTapsParallel(_ref4) {
      var _this3 = this;

      var {
        onError: onError,
        onResult: onResult,
        onDone: onDone,
        rethrowIfPossible: rethrowIfPossible,
        onTap = function (i, run) {
          return run();
        }
      } = _ref4;

      if (this.options.taps.length <= 1) {
        return this.callTapsSeries({
          onError: onError,
          onResult: onResult,
          onDone: onDone,
          rethrowIfPossible: rethrowIfPossible
        });
      }

      var code = "";
      code += "do {\n";
      code += "var _counter = ".concat(this.options.taps.length, ";\n");

      if (onDone) {
        code += "var _done = (function() {\n";
        code += onDone();
        code += "});\n";
      }

      var _loop2 = function (i) {
        var done = function () {
          if (onDone) return "if(--_counter === 0) _done();\n";else return "--_counter;";
        };

        var doneBreak = function (skipDone) {
          if (skipDone || !onDone) return "_counter = 0;\n";else return "_counter = 0;\n_done();\n";
        };

        code += "if(_counter <= 0) break;\n";
        code += onTap(i, function () {
          return _this3.callTap(i, {
            onError: function (error) {
              var code = "";
              code += "if(_counter > 0) {\n";
              code += onError(i, error, done, doneBreak);
              code += "}\n";
              return code;
            },
            onResult: onResult && function (result) {
              var code = "";
              code += "if(_counter > 0) {\n";
              code += onResult(i, result, done, doneBreak);
              code += "}\n";
              return code;
            },
            onDone: !onResult && function () {
              return done();
            },
            rethrowIfPossible: rethrowIfPossible
          });
        }, done, doneBreak);
      };

      for (var i = 0; i < this.options.taps.length; i++) {
        _loop2(i);
      }

      code += "} while(false);\n";
      return code;
    }
  }, {
    key: "args",
    value: function args() {
      var {
        before: before,
        after: after
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var allArgs = this._args;
      if (before) allArgs = [before].concat(allArgs);
      if (after) allArgs = allArgs.concat(after);

      if (allArgs.length === 0) {
        return "";
      } else {
        return allArgs.join(", ");
      }
    }
  }, {
    key: "getTapFn",
    value: function getTapFn(idx) {
      return "_x[".concat(idx, "]");
    }
  }, {
    key: "getTap",
    value: function getTap(idx) {
      return "_taps[".concat(idx, "]");
    }
  }, {
    key: "getInterceptor",
    value: function getInterceptor(idx) {
      return "_interceptors[".concat(idx, "]");
    }
  }]);

  return HookCodeFactory;
}();

module.exports = HookCodeFactory;
},{}],"../../node_modules/tapable/lib/SyncHook.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Hook = require("./Hook");

var HookCodeFactory = require("./HookCodeFactory");

var SyncHookCodeFactory = /*#__PURE__*/function (_HookCodeFactory) {
  _inherits(SyncHookCodeFactory, _HookCodeFactory);

  var _super = _createSuper(SyncHookCodeFactory);

  function SyncHookCodeFactory() {
    _classCallCheck(this, SyncHookCodeFactory);

    return _super.apply(this, arguments);
  }

  _createClass(SyncHookCodeFactory, [{
    key: "content",
    value: function content(_ref) {
      var {
        onError: onError,
        onDone: onDone,
        rethrowIfPossible: rethrowIfPossible
      } = _ref;
      return this.callTapsSeries({
        onError: function (i, err) {
          return onError(err);
        },
        onDone: onDone,
        rethrowIfPossible: rethrowIfPossible
      });
    }
  }]);

  return SyncHookCodeFactory;
}(HookCodeFactory);

var factory = new SyncHookCodeFactory();

var TAP_ASYNC = function () {
  throw new Error("tapAsync is not supported on a SyncHook");
};

var TAP_PROMISE = function () {
  throw new Error("tapPromise is not supported on a SyncHook");
};

var COMPILE = function (options) {
  factory.setup(this, options);
  return factory.create(options);
};

function SyncHook() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var hook = new Hook(args, name);
  hook.constructor = SyncHook;
  hook.tapAsync = TAP_ASYNC;
  hook.tapPromise = TAP_PROMISE;
  hook.compile = COMPILE;
  return hook;
}

SyncHook.prototype = null;
module.exports = SyncHook;
},{"./Hook":"../../node_modules/tapable/lib/Hook.js","./HookCodeFactory":"../../node_modules/tapable/lib/HookCodeFactory.js"}],"../../node_modules/tapable/lib/SyncBailHook.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Hook = require("./Hook");

var HookCodeFactory = require("./HookCodeFactory");

var SyncBailHookCodeFactory = /*#__PURE__*/function (_HookCodeFactory) {
  _inherits(SyncBailHookCodeFactory, _HookCodeFactory);

  var _super = _createSuper(SyncBailHookCodeFactory);

  function SyncBailHookCodeFactory() {
    _classCallCheck(this, SyncBailHookCodeFactory);

    return _super.apply(this, arguments);
  }

  _createClass(SyncBailHookCodeFactory, [{
    key: "content",
    value: function content(_ref) {
      var {
        onError: onError,
        onResult: onResult,
        resultReturns: resultReturns,
        onDone: onDone,
        rethrowIfPossible: rethrowIfPossible
      } = _ref;
      return this.callTapsSeries({
        onError: function (i, err) {
          return onError(err);
        },
        onResult: function (i, result, next) {
          return "if(".concat(result, " !== undefined) {\n").concat(onResult(result), ";\n} else {\n").concat(next(), "}\n");
        },
        resultReturns: resultReturns,
        onDone: onDone,
        rethrowIfPossible: rethrowIfPossible
      });
    }
  }]);

  return SyncBailHookCodeFactory;
}(HookCodeFactory);

var factory = new SyncBailHookCodeFactory();

var TAP_ASYNC = function () {
  throw new Error("tapAsync is not supported on a SyncBailHook");
};

var TAP_PROMISE = function () {
  throw new Error("tapPromise is not supported on a SyncBailHook");
};

var COMPILE = function (options) {
  factory.setup(this, options);
  return factory.create(options);
};

function SyncBailHook() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var hook = new Hook(args, name);
  hook.constructor = SyncBailHook;
  hook.tapAsync = TAP_ASYNC;
  hook.tapPromise = TAP_PROMISE;
  hook.compile = COMPILE;
  return hook;
}

SyncBailHook.prototype = null;
module.exports = SyncBailHook;
},{"./Hook":"../../node_modules/tapable/lib/Hook.js","./HookCodeFactory":"../../node_modules/tapable/lib/HookCodeFactory.js"}],"../../node_modules/tapable/lib/SyncWaterfallHook.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Hook = require("./Hook");

var HookCodeFactory = require("./HookCodeFactory");

var SyncWaterfallHookCodeFactory = /*#__PURE__*/function (_HookCodeFactory) {
  _inherits(SyncWaterfallHookCodeFactory, _HookCodeFactory);

  var _super = _createSuper(SyncWaterfallHookCodeFactory);

  function SyncWaterfallHookCodeFactory() {
    _classCallCheck(this, SyncWaterfallHookCodeFactory);

    return _super.apply(this, arguments);
  }

  _createClass(SyncWaterfallHookCodeFactory, [{
    key: "content",
    value: function content(_ref) {
      var _this = this;

      var {
        onError: onError,
        onResult: onResult,
        resultReturns: resultReturns,
        rethrowIfPossible: rethrowIfPossible
      } = _ref;
      return this.callTapsSeries({
        onError: function (i, err) {
          return onError(err);
        },
        onResult: function (i, result, next) {
          var code = "";
          code += "if(".concat(result, " !== undefined) {\n");
          code += "".concat(_this._args[0], " = ").concat(result, ";\n");
          code += "}\n";
          code += next();
          return code;
        },
        onDone: function () {
          return onResult(_this._args[0]);
        },
        doneReturns: resultReturns,
        rethrowIfPossible: rethrowIfPossible
      });
    }
  }]);

  return SyncWaterfallHookCodeFactory;
}(HookCodeFactory);

var factory = new SyncWaterfallHookCodeFactory();

var TAP_ASYNC = function () {
  throw new Error("tapAsync is not supported on a SyncWaterfallHook");
};

var TAP_PROMISE = function () {
  throw new Error("tapPromise is not supported on a SyncWaterfallHook");
};

var COMPILE = function (options) {
  factory.setup(this, options);
  return factory.create(options);
};

function SyncWaterfallHook() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  if (args.length < 1) throw new Error("Waterfall hooks must have at least one argument");
  var hook = new Hook(args, name);
  hook.constructor = SyncWaterfallHook;
  hook.tapAsync = TAP_ASYNC;
  hook.tapPromise = TAP_PROMISE;
  hook.compile = COMPILE;
  return hook;
}

SyncWaterfallHook.prototype = null;
module.exports = SyncWaterfallHook;
},{"./Hook":"../../node_modules/tapable/lib/Hook.js","./HookCodeFactory":"../../node_modules/tapable/lib/HookCodeFactory.js"}],"../../node_modules/tapable/lib/SyncLoopHook.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Hook = require("./Hook");

var HookCodeFactory = require("./HookCodeFactory");

var SyncLoopHookCodeFactory = /*#__PURE__*/function (_HookCodeFactory) {
  _inherits(SyncLoopHookCodeFactory, _HookCodeFactory);

  var _super = _createSuper(SyncLoopHookCodeFactory);

  function SyncLoopHookCodeFactory() {
    _classCallCheck(this, SyncLoopHookCodeFactory);

    return _super.apply(this, arguments);
  }

  _createClass(SyncLoopHookCodeFactory, [{
    key: "content",
    value: function content(_ref) {
      var {
        onError: onError,
        onDone: onDone,
        rethrowIfPossible: rethrowIfPossible
      } = _ref;
      return this.callTapsLooping({
        onError: function (i, err) {
          return onError(err);
        },
        onDone: onDone,
        rethrowIfPossible: rethrowIfPossible
      });
    }
  }]);

  return SyncLoopHookCodeFactory;
}(HookCodeFactory);

var factory = new SyncLoopHookCodeFactory();

var TAP_ASYNC = function () {
  throw new Error("tapAsync is not supported on a SyncLoopHook");
};

var TAP_PROMISE = function () {
  throw new Error("tapPromise is not supported on a SyncLoopHook");
};

var COMPILE = function (options) {
  factory.setup(this, options);
  return factory.create(options);
};

function SyncLoopHook() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var hook = new Hook(args, name);
  hook.constructor = SyncLoopHook;
  hook.tapAsync = TAP_ASYNC;
  hook.tapPromise = TAP_PROMISE;
  hook.compile = COMPILE;
  return hook;
}

SyncLoopHook.prototype = null;
module.exports = SyncLoopHook;
},{"./Hook":"../../node_modules/tapable/lib/Hook.js","./HookCodeFactory":"../../node_modules/tapable/lib/HookCodeFactory.js"}],"../../node_modules/tapable/lib/AsyncParallelHook.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Hook = require("./Hook");

var HookCodeFactory = require("./HookCodeFactory");

var AsyncParallelHookCodeFactory = /*#__PURE__*/function (_HookCodeFactory) {
  _inherits(AsyncParallelHookCodeFactory, _HookCodeFactory);

  var _super = _createSuper(AsyncParallelHookCodeFactory);

  function AsyncParallelHookCodeFactory() {
    _classCallCheck(this, AsyncParallelHookCodeFactory);

    return _super.apply(this, arguments);
  }

  _createClass(AsyncParallelHookCodeFactory, [{
    key: "content",
    value: function content(_ref) {
      var {
        onError: onError,
        onDone: onDone
      } = _ref;
      return this.callTapsParallel({
        onError: function (i, err, done, doneBreak) {
          return onError(err) + doneBreak(true);
        },
        onDone: onDone
      });
    }
  }]);

  return AsyncParallelHookCodeFactory;
}(HookCodeFactory);

var factory = new AsyncParallelHookCodeFactory();

var COMPILE = function (options) {
  factory.setup(this, options);
  return factory.create(options);
};

function AsyncParallelHook() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var hook = new Hook(args, name);
  hook.constructor = AsyncParallelHook;
  hook.compile = COMPILE;
  hook._call = undefined;
  hook.call = undefined;
  return hook;
}

AsyncParallelHook.prototype = null;
module.exports = AsyncParallelHook;
},{"./Hook":"../../node_modules/tapable/lib/Hook.js","./HookCodeFactory":"../../node_modules/tapable/lib/HookCodeFactory.js"}],"../../node_modules/tapable/lib/AsyncParallelBailHook.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Hook = require("./Hook");

var HookCodeFactory = require("./HookCodeFactory");

var AsyncParallelBailHookCodeFactory = /*#__PURE__*/function (_HookCodeFactory) {
  _inherits(AsyncParallelBailHookCodeFactory, _HookCodeFactory);

  var _super = _createSuper(AsyncParallelBailHookCodeFactory);

  function AsyncParallelBailHookCodeFactory() {
    _classCallCheck(this, AsyncParallelBailHookCodeFactory);

    return _super.apply(this, arguments);
  }

  _createClass(AsyncParallelBailHookCodeFactory, [{
    key: "content",
    value: function content(_ref) {
      var {
        onError: onError,
        onResult: onResult,
        onDone: onDone
      } = _ref;
      var code = "";
      code += "var _results = new Array(".concat(this.options.taps.length, ");\n");
      code += "var _checkDone = function() {\n";
      code += "for(var i = 0; i < _results.length; i++) {\n";
      code += "var item = _results[i];\n";
      code += "if(item === undefined) return false;\n";
      code += "if(item.result !== undefined) {\n";
      code += onResult("item.result");
      code += "return true;\n";
      code += "}\n";
      code += "if(item.error) {\n";
      code += onError("item.error");
      code += "return true;\n";
      code += "}\n";
      code += "}\n";
      code += "return false;\n";
      code += "}\n";
      code += this.callTapsParallel({
        onError: function (i, err, done, doneBreak) {
          var code = "";
          code += "if(".concat(i, " < _results.length && ((_results.length = ").concat(i + 1, "), (_results[").concat(i, "] = { error: ").concat(err, " }), _checkDone())) {\n");
          code += doneBreak(true);
          code += "} else {\n";
          code += done();
          code += "}\n";
          return code;
        },
        onResult: function (i, result, done, doneBreak) {
          var code = "";
          code += "if(".concat(i, " < _results.length && (").concat(result, " !== undefined && (_results.length = ").concat(i + 1, "), (_results[").concat(i, "] = { result: ").concat(result, " }), _checkDone())) {\n");
          code += doneBreak(true);
          code += "} else {\n";
          code += done();
          code += "}\n";
          return code;
        },
        onTap: function (i, run, done, doneBreak) {
          var code = "";

          if (i > 0) {
            code += "if(".concat(i, " >= _results.length) {\n");
            code += done();
            code += "} else {\n";
          }

          code += run();
          if (i > 0) code += "}\n";
          return code;
        },
        onDone: onDone
      });
      return code;
    }
  }]);

  return AsyncParallelBailHookCodeFactory;
}(HookCodeFactory);

var factory = new AsyncParallelBailHookCodeFactory();

var COMPILE = function (options) {
  factory.setup(this, options);
  return factory.create(options);
};

function AsyncParallelBailHook() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var hook = new Hook(args, name);
  hook.constructor = AsyncParallelBailHook;
  hook.compile = COMPILE;
  hook._call = undefined;
  hook.call = undefined;
  return hook;
}

AsyncParallelBailHook.prototype = null;
module.exports = AsyncParallelBailHook;
},{"./Hook":"../../node_modules/tapable/lib/Hook.js","./HookCodeFactory":"../../node_modules/tapable/lib/HookCodeFactory.js"}],"../../node_modules/tapable/lib/AsyncSeriesHook.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Hook = require("./Hook");

var HookCodeFactory = require("./HookCodeFactory");

var AsyncSeriesHookCodeFactory = /*#__PURE__*/function (_HookCodeFactory) {
  _inherits(AsyncSeriesHookCodeFactory, _HookCodeFactory);

  var _super = _createSuper(AsyncSeriesHookCodeFactory);

  function AsyncSeriesHookCodeFactory() {
    _classCallCheck(this, AsyncSeriesHookCodeFactory);

    return _super.apply(this, arguments);
  }

  _createClass(AsyncSeriesHookCodeFactory, [{
    key: "content",
    value: function content(_ref) {
      var {
        onError: onError,
        onDone: onDone
      } = _ref;
      return this.callTapsSeries({
        onError: function (i, err, next, doneBreak) {
          return onError(err) + doneBreak(true);
        },
        onDone: onDone
      });
    }
  }]);

  return AsyncSeriesHookCodeFactory;
}(HookCodeFactory);

var factory = new AsyncSeriesHookCodeFactory();

var COMPILE = function (options) {
  factory.setup(this, options);
  return factory.create(options);
};

function AsyncSeriesHook() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var hook = new Hook(args, name);
  hook.constructor = AsyncSeriesHook;
  hook.compile = COMPILE;
  hook._call = undefined;
  hook.call = undefined;
  return hook;
}

AsyncSeriesHook.prototype = null;
module.exports = AsyncSeriesHook;
},{"./Hook":"../../node_modules/tapable/lib/Hook.js","./HookCodeFactory":"../../node_modules/tapable/lib/HookCodeFactory.js"}],"../../node_modules/tapable/lib/AsyncSeriesBailHook.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Hook = require("./Hook");

var HookCodeFactory = require("./HookCodeFactory");

var AsyncSeriesBailHookCodeFactory = /*#__PURE__*/function (_HookCodeFactory) {
  _inherits(AsyncSeriesBailHookCodeFactory, _HookCodeFactory);

  var _super = _createSuper(AsyncSeriesBailHookCodeFactory);

  function AsyncSeriesBailHookCodeFactory() {
    _classCallCheck(this, AsyncSeriesBailHookCodeFactory);

    return _super.apply(this, arguments);
  }

  _createClass(AsyncSeriesBailHookCodeFactory, [{
    key: "content",
    value: function content(_ref) {
      var {
        onError: onError,
        onResult: onResult,
        resultReturns: resultReturns,
        onDone: onDone
      } = _ref;
      return this.callTapsSeries({
        onError: function (i, err, next, doneBreak) {
          return onError(err) + doneBreak(true);
        },
        onResult: function (i, result, next) {
          return "if(".concat(result, " !== undefined) {\n").concat(onResult(result), "\n} else {\n").concat(next(), "}\n");
        },
        resultReturns: resultReturns,
        onDone: onDone
      });
    }
  }]);

  return AsyncSeriesBailHookCodeFactory;
}(HookCodeFactory);

var factory = new AsyncSeriesBailHookCodeFactory();

var COMPILE = function (options) {
  factory.setup(this, options);
  return factory.create(options);
};

function AsyncSeriesBailHook() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var hook = new Hook(args, name);
  hook.constructor = AsyncSeriesBailHook;
  hook.compile = COMPILE;
  hook._call = undefined;
  hook.call = undefined;
  return hook;
}

AsyncSeriesBailHook.prototype = null;
module.exports = AsyncSeriesBailHook;
},{"./Hook":"../../node_modules/tapable/lib/Hook.js","./HookCodeFactory":"../../node_modules/tapable/lib/HookCodeFactory.js"}],"../../node_modules/tapable/lib/AsyncSeriesLoopHook.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Hook = require("./Hook");

var HookCodeFactory = require("./HookCodeFactory");

var AsyncSeriesLoopHookCodeFactory = /*#__PURE__*/function (_HookCodeFactory) {
  _inherits(AsyncSeriesLoopHookCodeFactory, _HookCodeFactory);

  var _super = _createSuper(AsyncSeriesLoopHookCodeFactory);

  function AsyncSeriesLoopHookCodeFactory() {
    _classCallCheck(this, AsyncSeriesLoopHookCodeFactory);

    return _super.apply(this, arguments);
  }

  _createClass(AsyncSeriesLoopHookCodeFactory, [{
    key: "content",
    value: function content(_ref) {
      var {
        onError: onError,
        onDone: onDone
      } = _ref;
      return this.callTapsLooping({
        onError: function (i, err, next, doneBreak) {
          return onError(err) + doneBreak(true);
        },
        onDone: onDone
      });
    }
  }]);

  return AsyncSeriesLoopHookCodeFactory;
}(HookCodeFactory);

var factory = new AsyncSeriesLoopHookCodeFactory();

var COMPILE = function (options) {
  factory.setup(this, options);
  return factory.create(options);
};

function AsyncSeriesLoopHook() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var hook = new Hook(args, name);
  hook.constructor = AsyncSeriesLoopHook;
  hook.compile = COMPILE;
  hook._call = undefined;
  hook.call = undefined;
  return hook;
}

AsyncSeriesLoopHook.prototype = null;
module.exports = AsyncSeriesLoopHook;
},{"./Hook":"../../node_modules/tapable/lib/Hook.js","./HookCodeFactory":"../../node_modules/tapable/lib/HookCodeFactory.js"}],"../../node_modules/tapable/lib/AsyncSeriesWaterfallHook.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Hook = require("./Hook");

var HookCodeFactory = require("./HookCodeFactory");

var AsyncSeriesWaterfallHookCodeFactory = /*#__PURE__*/function (_HookCodeFactory) {
  _inherits(AsyncSeriesWaterfallHookCodeFactory, _HookCodeFactory);

  var _super = _createSuper(AsyncSeriesWaterfallHookCodeFactory);

  function AsyncSeriesWaterfallHookCodeFactory() {
    _classCallCheck(this, AsyncSeriesWaterfallHookCodeFactory);

    return _super.apply(this, arguments);
  }

  _createClass(AsyncSeriesWaterfallHookCodeFactory, [{
    key: "content",
    value: function content(_ref) {
      var _this = this;

      var {
        onError: onError,
        onResult: onResult,
        onDone: onDone
      } = _ref;
      return this.callTapsSeries({
        onError: function (i, err, next, doneBreak) {
          return onError(err) + doneBreak(true);
        },
        onResult: function (i, result, next) {
          var code = "";
          code += "if(".concat(result, " !== undefined) {\n");
          code += "".concat(_this._args[0], " = ").concat(result, ";\n");
          code += "}\n";
          code += next();
          return code;
        },
        onDone: function () {
          return onResult(_this._args[0]);
        }
      });
    }
  }]);

  return AsyncSeriesWaterfallHookCodeFactory;
}(HookCodeFactory);

var factory = new AsyncSeriesWaterfallHookCodeFactory();

var COMPILE = function (options) {
  factory.setup(this, options);
  return factory.create(options);
};

function AsyncSeriesWaterfallHook() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  if (args.length < 1) throw new Error("Waterfall hooks must have at least one argument");
  var hook = new Hook(args, name);
  hook.constructor = AsyncSeriesWaterfallHook;
  hook.compile = COMPILE;
  hook._call = undefined;
  hook.call = undefined;
  return hook;
}

AsyncSeriesWaterfallHook.prototype = null;
module.exports = AsyncSeriesWaterfallHook;
},{"./Hook":"../../node_modules/tapable/lib/Hook.js","./HookCodeFactory":"../../node_modules/tapable/lib/HookCodeFactory.js"}],"../../node_modules/tapable/lib/HookMap.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var util = require("util");

var defaultFactory = function (key, hook) {
  return hook;
};

var HookMap = /*#__PURE__*/function () {
  function HookMap(factory) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

    _classCallCheck(this, HookMap);

    this._map = new Map();
    this.name = name;
    this._factory = factory;
    this._interceptors = [];
  }

  _createClass(HookMap, [{
    key: "get",
    value: function get(key) {
      return this._map.get(key);
    }
  }, {
    key: "for",
    value: function _for(key) {
      var hook = this.get(key);

      if (hook !== undefined) {
        return hook;
      }

      var newHook = this._factory(key);

      var interceptors = this._interceptors;

      for (var i = 0; i < interceptors.length; i++) {
        newHook = interceptors[i].factory(key, newHook);
      }

      this._map.set(key, newHook);

      return newHook;
    }
  }, {
    key: "intercept",
    value: function intercept(interceptor) {
      this._interceptors.push(Object.assign({
        factory: defaultFactory
      }, interceptor));
    }
  }]);

  return HookMap;
}();

HookMap.prototype.tap = util.deprecate(function (key, options, fn) {
  return this.for(key).tap(options, fn);
}, "HookMap#tap(key,…) is deprecated. Use HookMap#for(key).tap(…) instead.");
HookMap.prototype.tapAsync = util.deprecate(function (key, options, fn) {
  return this.for(key).tapAsync(options, fn);
}, "HookMap#tapAsync(key,…) is deprecated. Use HookMap#for(key).tapAsync(…) instead.");
HookMap.prototype.tapPromise = util.deprecate(function (key, options, fn) {
  return this.for(key).tapPromise(options, fn);
}, "HookMap#tapPromise(key,…) is deprecated. Use HookMap#for(key).tapPromise(…) instead.");
module.exports = HookMap;
},{"util":"../../node_modules/tapable/lib/util-browser.js"}],"../../node_modules/tapable/lib/MultiHook.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Hook = require("./Hook");

var MultiHook = /*#__PURE__*/function () {
  function MultiHook(hooks) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

    _classCallCheck(this, MultiHook);

    this.hooks = hooks;
    this.name = name;
  }

  _createClass(MultiHook, [{
    key: "tap",
    value: function tap(options, fn) {
      for (var hook of this.hooks) {
        hook.tap(options, fn);
      }
    }
  }, {
    key: "tapAsync",
    value: function tapAsync(options, fn) {
      for (var hook of this.hooks) {
        hook.tapAsync(options, fn);
      }
    }
  }, {
    key: "tapPromise",
    value: function tapPromise(options, fn) {
      for (var hook of this.hooks) {
        hook.tapPromise(options, fn);
      }
    }
  }, {
    key: "isUsed",
    value: function isUsed() {
      for (var hook of this.hooks) {
        if (hook.isUsed()) return true;
      }

      return false;
    }
  }, {
    key: "intercept",
    value: function intercept(interceptor) {
      for (var hook of this.hooks) {
        hook.intercept(interceptor);
      }
    }
  }, {
    key: "withOptions",
    value: function withOptions(options) {
      return new MultiHook(this.hooks.map(function (h) {
        return h.withOptions(options);
      }), this.name);
    }
  }]);

  return MultiHook;
}();

module.exports = MultiHook;
},{"./Hook":"../../node_modules/tapable/lib/Hook.js"}],"../../node_modules/tapable/lib/index.js":[function(require,module,exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

exports.__esModule = true;
exports.SyncHook = require("./SyncHook");
exports.SyncBailHook = require("./SyncBailHook");
exports.SyncWaterfallHook = require("./SyncWaterfallHook");
exports.SyncLoopHook = require("./SyncLoopHook");
exports.AsyncParallelHook = require("./AsyncParallelHook");
exports.AsyncParallelBailHook = require("./AsyncParallelBailHook");
exports.AsyncSeriesHook = require("./AsyncSeriesHook");
exports.AsyncSeriesBailHook = require("./AsyncSeriesBailHook");
exports.AsyncSeriesLoopHook = require("./AsyncSeriesLoopHook");
exports.AsyncSeriesWaterfallHook = require("./AsyncSeriesWaterfallHook");
exports.HookMap = require("./HookMap");
exports.MultiHook = require("./MultiHook");
},{"./SyncHook":"../../node_modules/tapable/lib/SyncHook.js","./SyncBailHook":"../../node_modules/tapable/lib/SyncBailHook.js","./SyncWaterfallHook":"../../node_modules/tapable/lib/SyncWaterfallHook.js","./SyncLoopHook":"../../node_modules/tapable/lib/SyncLoopHook.js","./AsyncParallelHook":"../../node_modules/tapable/lib/AsyncParallelHook.js","./AsyncParallelBailHook":"../../node_modules/tapable/lib/AsyncParallelBailHook.js","./AsyncSeriesHook":"../../node_modules/tapable/lib/AsyncSeriesHook.js","./AsyncSeriesBailHook":"../../node_modules/tapable/lib/AsyncSeriesBailHook.js","./AsyncSeriesLoopHook":"../../node_modules/tapable/lib/AsyncSeriesLoopHook.js","./AsyncSeriesWaterfallHook":"../../node_modules/tapable/lib/AsyncSeriesWaterfallHook.js","./HookMap":"../../node_modules/tapable/lib/HookMap.js","./MultiHook":"../../node_modules/tapable/lib/MultiHook.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _tapable = require("tapable");

function logger(name) {
  return function () {
    var _console;

    for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }

    (_console = console).log.apply(_console, ["%c\u3010".concat(name, "\u3011"), 'color: blue;'].concat(rest));
  };
}
/**
 * 同步钩子
 * SyncHook: 最基本的钩子
 * SyncBailHook: 类似于SyncHook，执行过程中注册的回调返回**非undefined时停止执行**
 * SyncWaterfallHook: 接收至少一个参数，上一个注册的回调返回值会作为下一个注册的回调参数。
 * SyncLoopHook: 有点类似SyncBailHook, 执行过程中注册的回调返回**非undefined时继续执行**
 */


;

(function () {
  var log = logger('Sync Hook');
  var hook = new _tapable.SyncHook(['name']);
  hook.tap('hello', function (name) {
    log("hello, ".concat(name));
  });
  hook.tap('hello again', function (name) {
    log("hello, ".concat(name, ", again"));
  });
  hook.call('sky');
  hook.call('lee');
})()
/**
 * 异步钩子
 * AsyncParallelHook: 异步并行钩子
 * AsyncSeriesHook: 异步串行钩子
 * AsyncParallelBailHook: 执行过程中注册的回调返回非undefined时就会直接执行callAsync或者Promise中的函数（由于并行执行的原因，注册的其他回调依然会执行）
 * AsyncSeriesBailHook: 执行过程中注册的回调返回非undefined时就会直接执行callAsync或者Promise中的函数（由于串行执行的原因，注册的其他回调不会执行）
 * AsyncSeriesWaterfallHook: 与SyncWaterfallHook类似，上一个注册的异步回调执行之后的返回值会传递给下一个注册的回调。
 */
;

(function () {
  var log = logger('Async Parallel Hook');
  var hook = new _tapable.AsyncParallelHook(['name']);
  hook.tapAsync('hello', function (name, done) {
    setTimeout(function () {
      log("hello ".concat(name));
      done();
    }, 2000);
  });
  hook.tapPromise('hello again', function (name) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        log("hello ".concat(name, ", again"));
        resolve();
      }, 1000);
    });
  });
  hook.callAsync('sky', function () {
    log('async parallel hook done!');
  });
})();

(function () {
  var log = logger('Async Series Hook');
  var hook = new _tapable.AsyncSeriesHook(['name']);
  hook.tapAsync('hello', function (name, done) {
    setTimeout(function () {
      log("hello ".concat(name));
      done();
    }, 2000);
  });
  hook.tapPromise('hello again', function (name) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        log("hello ".concat(name, ", again"));
        resolve();
      }, 1000);
    });
  });
  hook.callAsync('sky', function () {
    log('async series hook done!');
  });
})();
},{"tapable":"../../node_modules/tapable/lib/index.js"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58017" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/WebpackTable.e31bb0bc.js.map