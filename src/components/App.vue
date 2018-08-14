<template>
    <div class="app">
        <welcome-component v-if="welcomeScreen" :loading="welcomeScreenLoading" @start-click="onStartClick"></welcome-component>
        <map-component></map-component>
        <player-component></player-component>
    </div>
</template>

<style>
    .app-color1 {
        color: #476CFB;
    }
    .app-color2 {
        color: #3033AB;
    }
    .app-color3 {
        color: #7EBFFD;
    }
    .app-color4 {
        color: #B0CEFD;
    }
    .app-color5 {
        color: #E1DDFC;
    }
    .app-bg1 {
        background-color: #476CFB;
    }
    .app-bg2 {
        background-color: #3033AB;
    }
    .app-bg3 {
        background-color: #7EBFFD;
    }
      .app-bg4 {
        background-color: #B0CEFD;
    }
    .app-bg5 {
        background-color: #E1DDFC;
    }
</style>

<script>
    import WelcomeComponent from './Welcome.vue'
    import MapComponent from './Map.vue'
    import PlayerComponent from './Player.vue'

    export default {
        name: 'app-component',
        data() {
            return {
                welcomeScreen: true,
                welcomeScreenLoading: false
            }
        },
        components: {
            WelcomeComponent,
            MapComponent,
            PlayerComponent
        },
        methods: {
            onStartClick() {
                this.welcomeScreenLoading = true
                
                this.$store.dispatch('loadCountries')
                    .then(() => {
                        this.$store.dispatch('playRandom')
                            .then(() => {
                                this.welcomeScreen = false
                                this.welcomeScreenLoading = false
                            })
                            .catch(e => {
                                console.error(e)
                                this.welcomeScreenLoading = false
                            })
                    })
                    .catch(e => {
                        console.error(e)
                        this.welcomeScreenLoading = false
                    })
            }
        }
    }
</script>