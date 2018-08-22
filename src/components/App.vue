<template>
    <div class="app">
        <welcome-component v-if="welcomeScreen" :loading="welcomeScreenLoading" @start-click="onStartClick"></welcome-component>
        <map-component></map-component>
        <player-component></player-component>
    </div>
</template>

<style>
body {
    font-family: 'Roboto', sans-serif;
}
.logo {
    font-family: 'Hi Melody', cursive;
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