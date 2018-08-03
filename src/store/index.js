import Vue from 'vue'
import Vuex from 'vuex'
import countriesSvc from '../services/countries.js'
import soundcloudSvc from '../services/soundcloud.js'
import _ from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        playlist: [],
        currentTrackIndex: -1,
        countries: [],
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
        addTrack(state, track) {
            state.playlist.push(track)
        },
        setCurrentTrackIndex(state, index) {
            state.currentTrackIndex = index
        },
        setNextDestination(state, country) {
            state.nextDestination = country
        },
        setCountries(state, countries) {
            state.countries = countries
        }
    },
    actions: {
        loadCountries(context) {
            return new Promise((resolve, reject) => {
                    countriesSvc.all()
                        .then(countries => {
                            context.commit('setCountries', countries)
                            resolve(countries)
                        }).catch(e => reject(e))
                })
        },
        play({commit, state}, {track, country}) {
            commit('addTrack', Object.assign(track, {country}))
            commit('setCurrentTrackIndex', state.playlist.length - 1)
            let nextDestination = null
            const last3Locations = [
                state.playlist.length ? state.playlist[state.playlist.length - 1].country.code : null,
                state.playlist.length > 1 ? state.playlist[state.playlist.length - 2].country.code : null,
                state.playlist.length > 2 ? state.playlist[state.playlist.length - 3].country.code : null
            ]
            do {
                nextDestination =  _.sample(_.shuffle(state.countries))
            } while (last3Locations.includes(nextDestination.code))
            commit('setNextDestination', nextDestination)
        },
        playNext({dispatch, state}) {
            return dispatch('playRandom', {country: state.nextDestination})
        },
        playPrev({commit, state}) {
            commit('setCurrentTrackIndex', state.currentTrackIndex - 1)
        },
        playRandom({dispatch, state}, {country = null} = {}) {
            return new Promise((resolve, reject) => {
                    country = country || _.sample(_.shuffle(state.countries))
                    const keyword = _.sample(_.shuffle(country.artists))
                    soundcloudSvc.findTracks({
                        q: keyword,
                        limit: 200
                    }).then(tracks => {
                        const track = _.sample(_.shuffle(tracks))
                        dispatch('play', {track, country})
                        resolve(track)
                    }).catch(e => reject(e))
                })        
        }
    }
})