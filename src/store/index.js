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
    },
    mutations: {
        setStation(state, station) {
            state.currentStation = station
        }
    },
    actions: {
        setStation(context, station) {
            const successCallback = tracks => {
                const stationClone = _.cloneDeep(station);
                stationClone.tracks = tracks;
                context.commit('setStation', stationClone)
            }
            soundcloudSvc.getTracksByGenre(station.name, successCallback);
        } 
    }
  })