/**
 * @author Sky
 * @email lihaizh_cn@foxmail.com
 * @create date 2017-05-20 03:14:47
 * @modify date 2017-05-20 03:14:47
 * @desc 日历组件
*/
<style lang="sass" scoped>
    
</style>

<template lang="pug">
    section.v-calender-wrap(v-show="show")
        v-touch.v-calender-mask(tag="div")
        section.v-calendar-modal
            header.v-calendar-head
                v-touch.v-calendar-btn(tag="button", @tap="cancel") 取消
                v-touch.v-calendar-btn(tag="button", @tap="confirm") 确认
                v-touch.v-calendar-btn(tag="button", @tap="restore") 重置
            main.v-calendar-main
                div.v-calendar-content
                    div.v-calendar-area
                    wheel(:items="yearItems", selected-item="year", @change="changeYear")
                    wheel(:items="monthItems", selected-item="month", @change="changeMonth")
                    wheel(:items="dateItems", selected-item="date", @change="changeDate")
</template>

<script lang="babel">
    import Vue from 'vue';
    import vueTouch from 'vue-touch';

    import Wheel from './wheel.vue';

    Vue.use(vueTouch);
    
    export default {
        name: 'calendar',
        data () {

            let yearItems = [];
            let now = new Date(this.defaultDate);
            let min = new Date(1970);
            let [minYear, maxYear] = this.range;

            if (now.getTime() < min) {
                now = min;
            }

            let year = now.getFullYear();

            if (!minYear || minYear < 1970) {
                minYear = 1970;
            }

            let month = now.getMonth() + 1;
            let date = now.getDate();

            if (maxYear) {

                if (maxYear < year) {

                    year = maxYear;
                    month = data = 1;
                }
            } else {

                maxYear = year;
        }

            for (let y = minYear; y <= maxYear; y++) {
                yearItems.push(y);
            }

            let baseDateItems = [];

            for (let d = 1; d <= 28; d++) {
                baseDateItems.push(d);
            }

            return {
                yearItems,
                monthItems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                dateItems: [],
                baseDateItems,
                year,
                month,
                date
            }
        },
        props: {
            range: {
                type: Array,
                default: function () {
                    return [1970, new Date().getFullYear()];
                }
            },
            deafultDate: {
                type: Number,
                default: Date.now()
            },
            format: {
                type: String,
                default: 'yyyy-MM-dd'
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        components: {
            Wheel
        },
        created () {

            this.getDateItems(this.year, this.month);
        },
        methods: {
            getDateItems (year, month) {

                let specialDateItems = [];

                if (month === 2) {

                    if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
                        specialDateItems.push(29);
                    }
                } else if ([4, 6, 9, 11].indexOf(month)) {

                    specialDateItems.push(29, 30);
                } else {

                    specialDateItems.push(29, 30, 31);
                }

                this.dateItems = [...this.baseDateItems, ...specialDateItems];
            },
            changeYear (year) {

                this.year = year;
            },
            changeMonth (month) {

                this.month = month;
            },
            changeDate (date) {

                this.date = date;
            },
            confirm () {

                let map = {
                    'y': this.year,
                    'M': this.month + 1,
                    'd': this.date
                }

                let exportDate = this.format.replace(/[yMd]+/g, (match) => {
                    let seed = match[0];
                    let value;

                    if (seed === 'y') {

                        value = '' + map.y;
                        value = value.substr(value.length - match.length);
                    } else {

                        value = '0' + map[seed];
                        value = value.substr(value.length - 2);
                    }

                    return value;
                });

                this.$emit('export', exportDate);
                this.close();
            },
            restore () {

                this.$emit('export', '');
            },
            cancel () {
                
                this.close();
            },
            close () {

                this.$emit('update:show', false);
            }
        }
    }
</script>
