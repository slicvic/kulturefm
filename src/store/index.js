import Vue from 'vue'
import Vuex from 'vuex'
import countriesSvc from '../services/countries.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        playlist: [],
        currentTrackIndex: -1,
        nextDestination: null
    },
    getters: {
        currentTrack(state) {
            return state.playlist[state.currentTrackIndex]
        },
        currentLocation(state, getters) {
            return getters.currentTrack ? getters.currentTrack.country : null
        }
    },
    mutations: {
        playTrack(state, track) {
            state.playlist.push(track)
            state.currentTrackIndex = state.playlist.length - 1
        },
        playPrevTrack(state) {
            const prevIndex = state.currentTrackIndex - 1
            if (state.playlist[prevIndex]) {
                state.currentTrackIndex = prevIndex
            } else {
                throw Error('Invalid track index ' + prevIndex)
            }
        },
        setNextDestination(state, country) {
            state.nextDestination = country
        }
    },
    actions: {
        playTrack(context, track) {
            context.commit('playTrack', track)
            context.commit('setNextDestination', countriesSvc.randomNotEqualTo(track.country))
        },
        playPrevTrack(context) {
            context.commit('playPrevTrack')
        }
    }
  })