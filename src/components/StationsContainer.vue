<template>
    <div class="stations-container">
        <stations :stations="stations" @station-click="handleStationClick"></stations>
    </div>
</template>

<script>
    import Stations from './Stations.vue'
    import soundcloudSvc from '../services/soundcloud.js'

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
                soundcloudSvc.findTracks({
                    tags: station.keywords.join(','),
                    successCallback: tracks => {
                        if (tracks.length) {
                            const stationWithTracks = Object.assign({}, station)
                            stationWithTracks.tracks = tracks
                            this.$store.dispatch('setStation', stationWithTracks)
                        } else {
                            alert('Sorry, no tracks found.')
                        }
                    }
                })
            }
        }
    }
</script>