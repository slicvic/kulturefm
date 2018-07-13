import Vue from 'vue'
import Vuex from 'vuex'
import stationSvc from '../services/stations.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        stations: stationSvc.getStations(),
        currentStation: null,
        stationTracks: null,
        player: 'hidden' // hidden, playing, paused, stopped
    },
    getters: {
    },
    mutations: {
        setStation(state, station) {
            state.currentStation = station
        }
    },
    actions: {
        setStation(context, station) {
            context.commit('setStation', station) // call mutation
        }
    }
  })