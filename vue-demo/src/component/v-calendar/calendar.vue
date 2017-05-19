<style lang="sass" scoped>
    
</style>

<template lang="jade">
    v-translate
        section.v-calender-wrap
            v-touch.v-calender-mask(tag="div")
            section.v-calendar-modal
                header.v-calendar-head
                    v-touch.v-calendar-btn(tag="button", @tap="cancel")
                    v-touch.v-calendar-btn(tag="button", @tap="confirm")
                    v-touch.v-calendar-btn(tag="button", @tap="confirm")
                main.v-calendar-main
                    div.v-calendar-content
                        div.v-calendar-area
                        v-wheel(:items="yearItems", selected-item="year", @change="changeYear")
                        v-wheel(:items="monthItems", selected-item="month", @change="changeMonth")
                        v-wheel(:items="dateItems", selected-item="date", @change="changeDate")
</template>

<script lang="babel" type="text/ecmascript-6">
    import vueTouch from 'vue-touch';

    import wheel from './wheel.vue';

    Vue.use(vueTouch);
    
    export default {
        data () {

            let yearItems = [];
            let now = new Date(this.defaultDate);
            let min = new Date(1970);
            let [minYear, maxYear] = range;

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
                monthItems,
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
                default: () => {
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
            setYear (year) {

                this.year = year;
            },
            setMonth (month) {

                this.month = month;
            },
            setDate (date) {

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
            close () {

                this.$emit('update:show', false);
            }
        }
    }
</script>
