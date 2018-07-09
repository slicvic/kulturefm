<template>
    <div class="app">
        <h1>VueRadio</h1>
        <stations :stations="stations" @selectStation="onSelectStation"></stations>
    </div>
</template>

<script>
    import Stations from './components/Stations.vue'

    export default {
        name: 'app',
        data: function() {
            return {
                stations: [
                    {
                        name: 'rock',
                        title: 'Rock & Roll'
                    }
                ]
            }
        },
        methods: {
            onSelectStation: function(station) {
                console.log('selected station', station)
            }
        },
        components: {
            Stations
        }
    }
    
</script>