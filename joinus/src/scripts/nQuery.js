/**
 * Created by sky on 2017/4/11.
 */

(function () {

    "use strict";

    var arr = [],
        slice = arr.prototype.slice;

    var nQuery = function (selector, context) {
        return nQuery.fn.init(selector, context);
    };

    nQuery.fn = nQuery.prototype = {
        nquery: '1.0.0',

        constructor: nQuery,

        length: 0
    }

    var rquickExpr = /^(?:\s*<(\w+)>\s*|\.([\w_-]+)|#([\w-]+))$/,

        init = nQuery.fn.init = function (selector, context) {
            var match, $$selector;

            if (!selector) {
                return this;
            }

            if (typeof selector === 'string') {
                match = rquickExpr.exec(selector);
                if (match) {
                    if (match[1]) {

                    } else if (match[2]) {

                    } else if (match[3]) {
                        $$selector = document.getElementById(match[1]);

                        if ($$selector) {
                            this[0] = $$selector;
                            this.length = 1;
                            return this;
                        }
                    }
                }

            } else if (selector.nodeType) {
                this[0] = selector;
                this.length = 1;
                return this;
            }

            return this;
        }

    nQuery.prototype = nQuery.fn;

})()