<template>
    <div class="app">
        <h1>VueRadio</h1>
        <stations :stations="stations" @selectStation="onSelectStation"></stations>
        <player :tracks="tracks"></player>
    </div>
</template>

<script>
    import Stations from './components/Stations.vue'
    import Player from './components/Player.vue'
    import * as stationSvc from './services/stations.js'

    export default {
        name: 'app',
        data: function() {
            return {
                stations: stationSvc.getStations(),
                tracks: []
            }
        },
        methods: {
            onSelectStation: function(station) {
                console.log('selected station', station)
            }
        },
        components: {
            Stations,
            Player
        }
    }
    
</script>