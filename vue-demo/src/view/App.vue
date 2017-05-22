<style lang="sass" scoped>
    
</style>

<template lang="pug">
    section#app
        input(@focus="openCalendar", :value="date")
        calendar(:show.sync="show")
</template>

<script lang="babel">

    import Calendar from '../component/v-calendar/calendar.vue';

    export default {
        name: 'app',
        data () {
            return {
                date: '',
                show: false
            }
        },
        components: {
            Calendar
        },
        methods: {
            openCalendar () {
                this.show = true;
            }
        }
    }
</script>
