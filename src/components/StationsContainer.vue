<template>
    <div class="stations-container">
        <stations :stations="stations" @station-click="handleStationClick"></stations>
    </div>
</template>

<script>
    import Stations from './Stations.vue'

    export default {
        name: 'stations-container',
        created() {
            this.stations = this.$store.state.stations
        },
        data() {
            return {
                stations: []
            }
        },
        components: {
            Stations
        },
        methods: {
            handleStationClick(station) {
                this.$store.dispatch('setStation', station)
            }
        }
    }
</script>