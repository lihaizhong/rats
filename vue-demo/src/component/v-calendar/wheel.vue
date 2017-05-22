<style lang="sass" scoped>
    
</style>

<template lang="pug">
    section.v-wheel-wrap
        v-touch.v-wheel-content(tag="div", @panup="wheel", @pandown="wheel")
            ul.v-wheel-select(ref="options", @panup="wheel", @pandown="wheel")
                li.v-wheel-option(v-for="item in items") {{ item }}
        .v-wheel-content-shadow
            .v-wheel-content-mask
            ul.v-wheel-select(:style="scrollStyle")
                li.v-wheel-option(v-for="item in items") {{ item }}
</template>

<script lang="babel">
    
    export default {
        name: 'wheel',
        data () {
            return {
                baseHeight: 30,
                scrollTop: 0,
                minScrollTop: 0,
                maxScrollTop: 0,
                delay: 200,
                timer: null
            }
        },
        props: {
            items: {
                type: Array,
                default () {
                    return [];
                }
            },
            selectedItem: {
                type: [Number, String],
                default: ''
            }
        },
        computed: {
            scrollStyle () {
                return `transform: translate3d(0, ${this.scrollTop}, 0);`;
            }
        },
        created () {
            if (this.selectedItem) {
                let index = this.items.indexOf(this.selectedItem);

                if (index !== -1) {
                    this.scrollTop = 0 - this.baseHeight * index;
                }
            }
        },
        mounted () {
            this.maxScrollTop = this.$refs.options.clientHeight;
        },
        methods: {
            wheel (evt) {
                let distance = evt.distance / 10;

                switch (evt.type) {
                    case 'panup':
                        this.scrollTop -=distance;
                        break;
                    case 'pandown':
                        this.scrollTop += distance;
                        break;
                };

                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }

                this.timer = setTimeout(function () {

                    if (this.scrollTop > this.minScrollTop) {

                        this.scrollTop = this.minScrollTop;
                    } else if (this.scrollTop < this.maxScrollTop) {

                        this.scrollTop = this.maxScrollTop + this.baseHeight;
                    } else {

                        let mod = this.scrollTop % this.baseHeight;

                        if (mod !== 0) {

                            let half = base / 2;
                            if (mod > half) {

                                this.scrollTop -= (mod - base);
                            } else {

                                this.scrollTop -= mod;
                            }
                        }
                    }

                    let index = 0 - this.scrollTop / this.baseHeight;
                    let item = this.items[index];

                    this.timer = null;
                    this.$emit('change', item);
                }.bind(this), this.delay);
            }
        }
    }
</script>
