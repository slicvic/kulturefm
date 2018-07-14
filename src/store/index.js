import Vue from 'vue'
import Vuex from 'vuex'
import stationSvc from '../services/stations.js'
import soundcloudSvc from '../services/soundcloud.js'
import _ from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        stations: stationSvc.getStations(),
        selectedStation: null, 
        view: 'stations' // stations, player
    },
    getters: {
    },
    mutations: {
        setStation(state, station) {
            state.selectedStation = station
            state.view = 'player'
        }
    },
    actions: {
        setStation(context, station) {
            soundcloudSvc.findTracksByGenre(station.name)
                .then((tracks) => {
                    const stationCloned = _.cloneDeep(station);
                    stationCloned.tracks = tracks;
                    context.commit('setStation', stationCloned) // calls mutation
                });
        }
    }
  })