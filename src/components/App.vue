<template>
    <div class="app">
        <welcome-component v-if="welcomeScreen" :loading="welcomeScreenLoading" @start-click="onStartClick"></welcome-component>
        <map-component></map-component>
        <player-component></player-component>
    </div>
</template>

<script>
    import WelcomeComponent from './Welcome.vue'
    import MapComponent from './Map.vue'
    import PlayerComponent from './Player.vue'
    import searchSvc from '../services/search.js'

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

                searchSvc.findRandomTrack()
                    .then(response => {
                        this.$store.dispatch('playTrack', response.track)
                        this.welcomeScreen = false
                    })
                    .catch(e => { 
                        throw Error(e)
                    })
            }
        }
    }
</script>