<template>
    <div class="app">
        <h1>VueRadio</h1>
        <stations @change="changeStation"></stations>
        <player v-if="showPlayer"></player>
    </div>
</template>

<script>
    import Stations from './components/Stations.vue'
    import Player from './components/Player.vue'

    export default {
        name: 'app',
        data: function() {
            return {
                showPlayer: false
            }
        },
        methods: {
            changeStation: function(station) {
                console.log(station)
            }
        },
        components: {
            Stations,
            Player
        }
    }
    
</script>