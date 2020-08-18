<template>
    <div class="app-component">
        <welcome-component v-if="showWelcomeScreen" :loading="isLoading" @start-click="onStartClick"></welcome-component>
        <google-map-component></google-map-component>
        <player-component></player-component>
        <about-component></about-component>
    </div>
</template>

<style>
body {
    font-family: 'Roboto', sans-serif;
}
.logo, .font-primary {
    font-family: 'Hi Melody', cursive;
}
</style>

<script>
    import WelcomeComponent from './Welcome.vue'
    import OpenLayersMap from './OpenLayersMap.vue'
    import PlayerComponent from './Player.vue'
    import AboutComponent from './About.vue'

    export default {
        name: 'app-component',
        data() {
            return {
                showWelcomeScreen: true,
                isLoading: false
            }
        },
        components: {
            WelcomeComponent,
            OpenLayersMap,
            PlayerComponent,
            AboutComponent
        },
        methods: {
            onStartClick() {
                this.isLoading = true
                
                this.$store.dispatch('loadCountries')
                    .then(() => {
                        this.$store.dispatch('playRandom')
                            .then(() => {
                                this.showWelcomeScreen = false
                                this.isLoading = false
                            })
                            .catch(e => {
                                this.isLoading = false
                            })
                    })
                    .catch(e => {
                        this.isLoading = false
                    })
            }
        }
    }
</script>