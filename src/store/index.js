import Vue from 'vue'
import Vuex from 'vuex'
import countriesSvc from '../services/countries.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tracks: [],
        currentTrackIndex: -1,
        nextDestination: null
    },
    getters: {
        currentTrack(state) {
            return state.tracks[state.currentTrackIndex]
        },
        currentLocation(state, getters) {
            return getters.currentTrack ? getters.currentTrack.country : null
        }
    },
    mutations: {
        addAndPlayTrack(state, track) {
            state.tracks.push(track)
            state.currentTrackIndex = state.tracks.length - 1
        },
        playTrackByIndex(state, index) {
            if (index >= 0 && index <= state.tracks.length - 1) {
                state.currentTrackIndex = index
            } else {
                throw new Error('Invalid track index ' + index)
            }
        },
        playPrevTrack(state) {
            const prevIndex = state.currentTrackIndex - 1
            if (prevIndex >= 0 && prevIndex <= state.tracks.length - 1) {
                state.currentTrackIndex = prevIndex
            } else {
                throw new Error('Invalid track index ' + prevIndex)
            }
        },
        setNextDestination(state, country) {
            state.nextDestination = country
        }
    },
    actions: {
        addAndPlayTrack(context, track) {
            context.commit('addAndPlayTrack', track)
            context.commit('setNextDestination', countriesSvc.randomNotEqualTo(track.country))
        },
        playPrevTrack(context) {
            context.commit('playPrevTrack')
        }
    }
  })