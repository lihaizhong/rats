<style lang="sass" scoped>

</style>

<template>
  <section id="app">
    <input type="text" @focus="openCalendar" v-model="date">
    <calendar :show="show" @export="exportDate" @update:show="val => show = val"></calendar>
  </section>
</template>

<script lang="babel">
  import Calendar from '../component/v-calendar/calendar.vue'

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
        this.show = true
      },
      exportDate (date) {
        this.date = date
      }
    }
  }
</script>
