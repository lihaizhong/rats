<style lang="sass" scoped>
    
</style>

<template>
    <section class="v-wheel-wrap">
        <v-touch tag="div" class="v-wheel-content" @panup="wheel" @pandown="wheel">
            <ul class="v-wheel-select" ref="options" :style="scrollStyle">
                <li class="v-wheel-option" v-for="item in items">{{ item }}</li>
            </ul>
        </v-touch>
        <div class="v-wheel-content-shadow">
            <div class="v-wheel-mask"></div>
            <ul class="v-wheel-select" :style="scrollStyle">
                <li class="v-wheel-option" v-for="item in items">{{ item }}</li>
            </ul>
        </div>
    </section>
</template>

<script lang="babel">
    
    export default {
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

                if (index === -1) {
                    index = 0;
                }

                this.scrollTop = 0 - this.baseHeight * index;
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


                }.bind(this), this.delay);
            }
        }
    }
</script>
