import Vue from 'vue'
import Vuex from 'vuex'
import stationSvc from '../services/stations.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        stations: stationSvc.getStations(),
    },
    getters: {
    }
  })