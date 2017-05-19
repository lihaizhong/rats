<style scoped>
    
</style>

<template>
    <section>
        <input type="text" @focus="openCalendar">
        <calendar :show.sync="show"></calendar>
    </section>
</template>

<script lang="babel">

    import calendar from '../component/v-calendar/calendar.vue';

    export default {
        data () {
            return {
                show: false
            }
        },
        components: {
            calendar
        },
        methods: {
            openCalendar () {
                this.show = true;
            }
        }
    }
</script>
