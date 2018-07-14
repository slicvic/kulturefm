<template>
    <div class="app">
        <h1>VueRadio</h1>
        <stations v-if="view == 'stations'"></stations>
        <player-container v-if="view == 'player'"></player-container>
    </div>
</template>

<script>
    import Stations from './components/Stations.vue'
    import PlayerContainer from './components/PlayerContainer.vue'

    export default {
        name: 'app',
        computed: {
            view() {
                return this.$store.state.view 
            }
        },
        components: {
            Stations,
            PlayerContainer
        }
    }
    
</script>