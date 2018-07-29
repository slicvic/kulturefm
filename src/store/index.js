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
        play({commit, state}, {track, fromCountry}) {
            commit('addTrack', Object.assign(track, {country: fromCountry}))
            commit('setCurrentTrackIndex', state.playlist.length - 1)
            commit('setNextDestination', _.sample(_.shuffle(state.countries)))
        },
        playNext({dispatch, state}) {
            return dispatch('playRandom', {fromCountry: state.nextDestination})
        },
        playPrev({commit, state}) {
            commit('setCurrentTrackIndex', state.currentTrackIndex - 1)
        },
        playRandom({dispatch, state}, {fromCountry = null, genre = null} = {}) {
            fromCountry = fromCountry || _.sample(_.shuffle(state.countries))
            genre = genre || _.sample(_.shuffle(fromCountry.music_genres))

            return new Promise((resolve, reject) => {
                    soundcloudSvc.findTracks({
                        genres: genre.code,
                        limit: 200
                    }).then(tracks => {
                        const track = _.sample(_.shuffle(tracks))
                        dispatch('play', {track, fromCountry})
                        resolve(track)
                    }).catch(e => reject(e))
                })        
        }
    }
})