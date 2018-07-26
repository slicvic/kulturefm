<template>
    <div class="app">
        <welcome v-if="showWelcomeScreen" :loading="showWelcomeScreenLoading" @start-click="onStartClick"></welcome>
        <div class="container">
            <h1>Kulture.fm</h1>
        </div>
        <div class="player-container">
            <player></player>
        </div>
    </div>
</template>

<style>
    .player-container {
        position: fixed;
        bottom: 0;
        width: 100%;
        background-color: #f5f5f5;
    }
</style>

<script>
    import Welcome from './components/Welcome.vue'
    import Player from './components/Player.vue'
    import searchSvc from './services/search.js'

    export default {
        name: 'app',
        data() {
            return {
                showWelcomeScreen: true,
                showWelcomeScreenLoading: false
            }
        },
        components: {
            Welcome,
            Player
        },
        methods: {
            onStartClick() {
                this.showWelcomeScreenLoading = true
                searchSvc.findRandomTrack()
                    .then(response => {
                        this.$store.dispatch('addAndPlayTrack', response.track)
                        this.showWelcomeScreen = false
                    })
                    .catch(e => { 
                        throw Error(e)
                    })
                
            }
        }
    }
</script>