/**
 * Created by sky on 2017/5/14.
 */

var calendarWheel = {
    template: '#calendarWheel',
    data: function () {
        var style = {}, index, itemHeight = 30, offsetY = 0;

        if (this.selectedItem) {
            index = this.items.indexOf(this.selectedItem);
            index === -1 && (index = 0);
            offsetY = 0 - itemHeight * index;
            style['transform'] = 'translate3d(0, ' + offsetY + 'px, 0)';
        }

        return {
            style: style,
            offsetY: offsetY,
            minOffsetY: 0,
            maxOffsetY: 0,
            timer: null
        }
    },
    props: {
        'items': {
            type: Array
        },
        'selectedItem': {
            type: [String, Number],
            default: ''
        }
    },
    mounted: function () {
        this.maxOffsetY = 0 - this.$refs.options.clientHeight || 0;
    },
    computed: {
        wheelStyle: function () {
            var styleStr = JSON.stringify(this.style),
                len = styleStr.length;

            // 去掉`{}`和`""`
            return styleStr.substring(1, len - 2).replace(/"/g, '');
        }
    },
    watch: {
        offsetY: function () {
            this.style['transform'] = 'translate3d(0, ' + this.offsetY + 'px, 0)';
        }
    },
    methods: {
        select: function (event) {
            var distance = event.distance / 10;

            if (event.type === 'panup') {

                this.offsetY -= distance;
            } else if (event.type === 'pandown') {

                this.offsetY += distance;
            }


            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            this.timer = setTimeout(function () {

                var base = 30, half, mod, item, index;

                // 微调offsetY
                if (this.offsetY > this.minOffsetY) {

                    this.offsetY = this.minOffsetY;
                } else if (this.offsetY < this.maxOffsetY) {

                    this.offsetY = this.maxOffsetY + base;
                } else {

                    half = base / 2;
                    mod = this.offsetY % base;

                    if (mod > half) {

                        this.offsetY = this.offsetY - mod + base;
                    } else if (mod < half) {

                        this.offsetY = this.offsetY - mod;
                    }
                }

                // 获取item值
                index = -this.offsetY / 30;
                item = this.items[index];

                timer = null;
                this.$emit('change', item);
            }.bind(this), 200);
        }
    }
}

Vue.component('v-calendar', {
    template: '#calendar',
    data: function () {

        var now = new Date(this.defaultDate),
            year = now.getFullYear(),
            month, date, y, d,
            yearItems = [],
            commonDateItems = [],
            dateItems = [],
            minYear = this.range[0],
            maxYear = this.range[1];

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

        for (d = 1; d < 29; d++) {
            commonDateItems.push(d);
        }

        return {
            yearItems: yearItems,
            monthItems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            dateItems: [],
            commonDateItems: commonDateItems,
            year: year,
            month: month,
            date: date
        }
    },
    props: {
        defaultDate: {
            type: Number,
            default: Date.now()
        },
        range: {
            type: Array,
            default: function () {
                return [1970, new Date().getFullYear()]
            }
        },
        format: {
            type: String,
            default: 'YYYY-MM-DD'
        },
        show: {
            type: Boolean,
            default: false,
        }
    },
    components: {
        'v-calendar-wheel': calendarWheel
    },
    created: function () {

        // 根据年份和月份，处理日期
        this.getDateItemsByMonth(this.year, this.month);
    },
    computed: {
        checkFormat: function () {
            if (!/^(?:Y{2}|Y{4})\S+M{1,2}\S+D{1,2}\S*$/.test(this.format)) {
                throw new Error('format属性格式有误，请传入正确格式！例如：YYYY-MM-DD');
            }

            return this.format;
        }
    },
    methods: {
        getDateItemsByMonth: function (year, month) {

            var extraDateItems = [];

            if (month === 2) {

                // 判断是否是瑞年
                if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                    extraDateItems.push(29);
                }
            } else if ([1, 3, 5, 7, 8, 10, 12].indexOf(month)) {

                extraDateItems.push(29, 30, 31);
            } else {

                extraDateItems.push(29, 30);
            }

            this.dateItems = this.commonDateItems.concat(extraDateItems);
        },
        confirm: function () {

            var exportDate = this.checkFormat.replace(/([YMD]+)/g, function (match) {
                var seed = match.substr(0, 1),
                    value;

                switch(seed) {
                    case 'Y':
                        value = match.length == 2 ? this.year.substr(this.year.length - 3) : this.year;
                        break;
                    case 'M':
                        value = this.month;
                        break;
                    case 'D':
                        value = this.date;
                        break;
                }

                return value;
            }.bind(this));

            this.$emit('export', exportDate);
            this.close();
        },
        restore: function () {

            this.$emit('export', '');
        },
        cancel: function () {

            this.close();
        },
        close: function () {
            this.$emit('close');
        },
        changeYear: function (year) {
            this.year = year;
        },
        changeMonth: function (month) {
            this.month = month;
        },
        changeDate: function (date) {
            this.date = date;
        }
    }
})