<template>
    <div class="stations-container">
        <h2>Stations</h2>
        <stations-search-form @submit="handleSearchFormSubmit"></stations-search-form>
        <stations-list :stations="stations" @item-click="handleStationSelect"></stations-list>
    </div>
</template>

<script>
    import StationsSearchForm from './StationsSearchForm.vue'
    import StationsList from './StationsList.vue'
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
            StationsList,
            StationsSearchForm
        },
        methods: {
            handleSearchFormSubmit(values) {
                console.log(values)
            },
            handleStationSelect(station) {
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