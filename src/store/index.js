import Vue from 'vue'
import Vuex from 'vuex'
import stationSvc from '../services/stations.js'
import soundcloudSvc from '../services/soundcloud.js'
import _ from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        stations: stationSvc.getStations(),
        currentStation: null
    },
    getters: {
        currentStation(state) {
            return state.currentStation
        }
    },
    mutations: {
        setStation(state, station) {
            state.currentStation = station
        }
    },
    actions: {
        setStation(context, station) {
            context.commit('setStation', station)
        },
    }
  })