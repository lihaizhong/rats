/**
 * @author Sky
 * @email lihaizh_cn@foxmail.com
 * @create date 2017-05-23 01:36:40
 * @modify date 2017-05-23 01:36:40
 * @desc 日历组件
 */

(function() {
  var calendarWheel = {
    template: '<div class="v-calendar-wheel">' +
      '<v-touch tag="div" class="v-calendar-wheel-control" @panup="onpan" @pandown="onpan" @panend="onselect"></v-touch>' +
      '<div class="v-calendar-wheel-inner">' +
      '<div class="v-calendar-wheel-select">' +
      '<ul class="v-calendar-wheel-options" ref="options" :style="wheelStyle">' +
      '<li class="v-calendar-wheel-option" v-for="item in items"><span>{{ item }}</span></li>' +
      "</ul>" +
      "</div>" +
      "</div>" +
      '<div class="v-calendar-wheel-mask" v-pre></div>' +
      '<div class="v-calendar-wheel-inner-bg">' +
      '<div class="v-calendar-wheel-select-bg">' +
      '<ul class="v-calendar-options-bg" :style="wheelStyle">' +
      '<li class="v-calendar-wheel-option-bg" v-for="item in items"><span>{{ item }}</span></li>' +
      "</ul>" +
      "</div>" +
      "</div>" +
      "</div>",
    data: function() {
      var style = {}, index, itemHeight = 30, offsetY = 0;

      if (this.selectedItem) {
        index = this.items.indexOf(this.selectedItem);
        index === -1 && (index = 0);
        offsetY = 0 - itemHeight * index;
        style["transform"] = "translate3d(0, " + offsetY + "px, 0)";
      }

      return {
        style: style,
        offsetY: offsetY,
        minOffsetY: 0,
        maxOffsetY: 0,
        height: itemHeight
      };
    },
    props: {
      items: {
        type: Array
      },
      selectedItem: {
        type: [String, Number],
        default: ""
      }
    },
    updated: function() {
      if (this.maxOffsetY !== this.$refs.options.clientHeight) {
        this.maxOffsetY = 0 - this.$refs.options.clientHeight;
      }
    },
    computed: {
      wheelStyle: function() {
        var styleStr = JSON.stringify(this.style), len = styleStr.length;

        // 去掉`{}`和`""`
        return styleStr.substring(1, len - 2).replace(/"/g, "");
      }
    },
    watch: {
      offsetY: function(nv) {
        this.style["transform"] = "translate3d(0, " + nv + "px, 0)";
      }
    },
    methods: {
      onpan: function(event) {
        var distance = event.distance / 10;

        if (event.type === "panup") {
          this.offsetY -= distance;
        } else if (event.type === "pandown") {
          this.offsetY += distance;
        }
      },
      onselect: function() {
        var base = this.height, half, mod, item, index;

            // 微调offsetY
            if (this.offsetY > this.minOffsetY) {
              this.offsetY = this.minOffsetY;
            } else if (this.offsetY < this.maxOffsetY) {
              this.offsetY = this.maxOffsetY + base;
            } else {
              half = base / 2;
              mod = this.offsetY % base;

              if (mod !== 0) {
                if (mod > half) {
                  this.offsetY -= mod - base;
                } else {
                  this.offsetY -= mod;
                }
              }
            }

            // 获取item值
            index = -this.offsetY / base;
            item = this.items[index];

            this.$emit("update:selectedItem", item);
            this.$emit("change");
      }
    }
  };

  var validator = {
    year: function(y) {
      return y >= 1970;
    },
    month: function(m) {
      return m >= 1 && m <= 12;
    },
    date: function(d) {
      return d >= 1 && d <= 31;
    }
  };

  var calendar = {
    template: '<section v-if="show" class="v-calendar-wrap">' +
      '<v-touch tag="div" class="v-calendar-mask" @tap="close"></v-touch>' +
      '<div class="v-calendar-entity">' +
      '<header class="v-calendar-head">' +
      '<v-touch tag="button" class="v-calendar-cancel-btn" @tap="cancel">取消</v-touch>' +
      '<v-touch tag="button" class="v-calendar-confirm-btn" @tap="confirm">确认</v-touch>' +
      '<v-touch tag="button" class="v-calendar-restore-btn" @tap="restore">重置</v-touch>' +
      "</header>" +
      '<main class="v-calendar-main">' +
      '<div class="v-calendar-wheel-content">' +
      '<div class="v-calendar-wheel-select-area" v-pre></div>' +
      '<v-calendar-wheel v-if="year" :items="yearItems" :selected-item.sync="year" @change="changeDate"></v-calendar-wheel>' +
      '<v-calendar-wheel v-if="month" :items="monthItems" :selected-item.sync="month" @change="changeDate"></v-calendar-wheel>' +
      '<v-calendar-wheel v-if="date" :items="dateItems" :selected-item.sync="date" @change="changeDate"></v-calendar-wheel>' +
      "</div>" +
      "</main>" +
      "</div>" +
      "</section>",
    data: function() {
      var now = new Date(this.defaultDate),
        year = now.getFullYear(),
        hour = now.getHours(),
        minute = now.getMinutes(),
        second = now.getSeconds(),
        month,
        date,
        y,
        d,
        yearItems = [],
        minYear = this.minYear,
        maxYear = this.maxYear;

      if (!minYear || minYear < 1970) {
        minYear = 1970;
      }

      // 处理年份
      if (!maxYear) {
        maxYear = year;
        month = now.getMonth() + 1;
        date = now.getDate();
      } else {
        if (maxYear < year) {
          year = maxYear;
          month = date = 1;
        } else {
          month = now.getMonth() + 1;
          date = now.getDate();
        }
      }

      for (y = minYear; y <= maxYear; y++) {
        yearItems.push(y);
      }

      return {
        yearItems: yearItems,
        monthItems: [],
        dateItems: [],
        year: year,
        month: month,
        date: date,
        hour: hour,
        minute: minute,
        second: second
      };
    },
    props: {
      defaultDate: {
        type: Number,
        default: Date.now()
      },
      minYear: {
        type: Number,
        default: 1970,
        validator: validator.year
      },
      maxYear: {
        type: Number,
        default: new Date().getFullYear(),
        validator: validator.year
      },
      minMonth: {
        type: Number,
        default: 1,
        validator: validator.month
      },
      maxMonth: {
        type: Number,
        default: 12,
        validator: validator.month
      },
      minDate: {
        type: Number,
        default: 1,
        validator: validator.date
      },
      maxDate: {
        type: Number,
        default: 31,
        validator: validator.date
      },
      format: {
        type: String,
        default: "yyyy-MM-dd",
        validator: function(value) {
          if (!/^(?:y{2}|Y{4})\S+M{1,2}\S+d{1,2}\S*$/.test(value)) {
            throw new Error("format属性格式有误，请传入正确格式！例如：YYYY年MM月DD日");
          }

          return true;
        }
      },
      show: {
        type: Boolean,
        default: false,
        required: true
      }
    },
    components: {
      "v-calendar-wheel": calendarWheel
    },
    created: function() {

      this.getMonthRange();
      // 根据年份和月份，处理日期
      this.getDateRange(this.year, this.month);
    },
    computed: {
      exportDate: function() {
        var map = {
          y: this.year,
          M: this.month,
          d: this.date,
          h: this.hour,
          m: this.minute,
          s: this.second
        };

        return this.format.replace(
          /[yMdhms]+/g,
          function(match) {
            var seed = match[0], value;

            if (seed === "y") {
              value = "" + map.y;
              value = value.substr(value.length - match.length);
            } else {
              value = "0" + map[seed];
              value = value.substr(value.length - 2);
            }

            return value;
          }.bind(this)
        );
      }
    },
    watch: {
      month: function(nv, ov) {

        if (nv != ov) {
          this.getDateRange(this.year, nv);
        }
      }
    },
    methods: {
      getMonthRange: function() {

        var month = [], minMonth = this.minMonth, maxMonth = this.maxMonth;

        if (minMonth > maxMonth) {
          minMonth = 1;
        }

        for (var m = minMonth; m <= maxMonth; m++) {
          month.push(m);
        }

        this.monthItems = month;
      },
      getDateRange: function(year, month) {

        var dateItems = [], minDate = this.minDate, maxDate = this.maxDate, d;

        if (minDate > maxDate) {
          minDate = 1;
        }

        if (maxDate > 28) {
          if (month === 2) {

              if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
                if(maxDate > 29) {
                  
                  maxDate = 29;
                }

                if (minDate > 29) {

                  minDate = 29;
                }
              }
          } else if ([4, 6, 9, 11].indexOf(month)) {

              if (maxDate > 30) {

                maxDate = 30;
              }

              if (minDate > 30) {

                minDate = 30
              }
          }
        }

        for (d = minDate; d <= maxDate; d++) {
          dateItems.push(d);
        }

        this.dateItems = dateItems;
      },
      changeDate: function() {
        this.$emit("change", this.year, this.month, this.date, this.hour, this.minute, this.second);
      },
      confirm: function() {

        this.$emit("export", this.exportDate);
        this.close();
      },
      restore: function() {
        this.$emit("export", "");
      },
      cancel: function() {
        this.close();
      },
      close: function() {
        this.$emit("update:show", false);
      }
    }
  };

  // 全局组件创建
  Vue.component("v-calendar", calendar);
})();
