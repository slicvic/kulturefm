<template>
    <div class="app">
        <h1>VueRadio</h1>
        <stations @change="setStation"></stations>
        <player v-if="showPlayer"></player>
    </div>
</template>

<script>
    import Stations from './components/Stations.vue'
    import Player from './components/Player.vue'

    export default {
        name: 'app',
        data() {
            return {
                showPlayer: false
            }
        },
        methods: {
            setStation(station) {
                this.$store.dispatch('setStation', station)
            }
        },
        components: {
            Stations,
            Player
        }
    }
    
</script>