<template>
    <div class="stations-container">
        <h2>Stations</h2>
        <stations-search-form @submit="onSearchSubmit"></stations-search-form>
        <stations-list :stations="stations" @item-click="onStationSelect"></stations-list>
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
            onSearchSubmit(values) {
                if (values.searchTerm) {
                    soundcloudSvc.findTracks({
                        q: values.searchTerm,
                        successCallback: tracks => {
                            if (tracks.length) {
                              const station = {
                                  name: values.searchTerm,
                                  keywords: [],
                                  tracks: tracks
                              }
                              this.$store.dispatch('setStation', station)
                            } else {
                                alert(`Couldn't find any tracks. Please try again.`)
                            }
                        }
                    })
                }
            },
            onStationSelect(station) {
                soundcloudSvc.findTracks({
                    tags: station.keywords.join(','),
                    successCallback: tracks => {
                        if (tracks.length) {
                            const stationWithTracks = Object.assign({}, station)
                            stationWithTracks.tracks = tracks
                            this.$store.dispatch('setStation', stationWithTracks)
                        } else {
                            alert('Playback error. Please try again.')
                        }
                    }
                })
            }
        }
    }
</script>