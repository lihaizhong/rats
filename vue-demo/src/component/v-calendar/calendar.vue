<style scoped>
    
</style>

<template>
    <v-translate>
        <section class="v-calendar-wrap">
            <v-touch tag="div" class="v-calendar-mask"></v-touch>
            <section class="v-calendar-modal">
                <header class="v-calendar-head">
                    <v-touch tag="button" class="v-calendar-btn" @tap="button"></v-touch>
                    <v-touch tag="button" class="v-calendar-btn"></v-touch>
                    <v-touch tag="button" class="v-calendar-btn"></v-touch>
                </header>
                <main class="v-calendar-main">
                    <div class="v-calendar-content">
                        <div class="v-calendar-area"></div>
                        <v-wheel :items="yearItems" selected-item="year" @change="changeYear"></v-wheel>
                        <v-wheel :items="monthItems" selected-item="month" @change="changeMonth"></v-wheel>
                        <v-wheel :items="dateItems" selected-item="date" @change="changeDate"></v-wheel>
                    </div>
                </main>
            </section>
        </section>
    </v-translate>
</template>

<script lang="babel">
    import vueTouch from 'vue-touch';

    import wheel from './wheel.vue';

    Vue.use(vueTouch);
    
    export default {
        data: function () {

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
                default: [1970, new Date().getFullYear()],
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
        created: function () {

            this.getDateItems(this.year, this.month);
        },
        methods: {
            getDateItems: function (year, month) {

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
            setYear: function (year) {

                this.year = year;
            },
            setMonth: function (month) {

                this.month = month;
            },
            setDate: function (date) {

                this.date = date;
            },
            confirm: function () {

                let map = {
                    'y': this.year,
                    'M': this.month + 1,
                    'd': this.date
                }

                let exportDate = this.format.replace(/[yMd]+/g, function (match) {
                    let seed = match[0];
                    let value;

                    if (seed === 'y') {

                        value = '' + map.y;
                        value = match.length === 2 ?
                                value.substr(value.length - 2) :
                                value.substr(value.length - 4)
                    } else {

                        value = '0' + map[seed];
                        value = value.substr(value.length - 2);
                    }

                    return value;
                }.bind(this));

                this.$emit('export', exportDate);
                this.close();
            },
            restore: function () {

                this.$emit('export', '');
            },
            close: function () {

                this.$emit('update:show', false);
            }
        }
    }
</script>
