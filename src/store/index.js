import Vue from 'vue'
import Vuex from 'vuex'
import countriesSvc from '../services/countries.js'
import soundCloudSvc from '../services/soundcloud.js'
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
        play(state, track) {
            state.playlist.push(track)
            state.currentTrackIndex = state.playlist.length - 1
        },
        playPrev(state) {
            const prevIndex = state.currentTrackIndex - 1
            if (state.playlist[prevIndex]) {
                state.currentTrackIndex = prevIndex
            } else {
                throw Error('Invalid track index (' + prevIndex + ')')
            }
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
                    countriesSvc.all().then(countries => {
                        const shuffledCountries = _.shuffle(countries)
                        context.commit('setCountries', shuffledCountries)
                        resolve()
                    }).catch(e => reject(e))
                })
        },
        play({commit, state}, track) {
            commit('play', track)
            commit('setNextDestination', _.sample(state.countries))
        },
        playPrev(context) {
            context.commit('playPrev')
        },
        playRandom({commit, state}) {
            return new Promise((resolve, reject) => {
                    const randomCountry = _.sample(state.countries)
                    const randomGenre = _.sample(_.shuffle(randomCountry.genres))
                    soundCloudSvc.findTracks({
                        genres: randomGenre,
                        limit: 200
                    }).then(tracks => {
                        const randomTrack = _.sample(_.shuffle(tracks))
                        randomTrack.country = randomCountry
                        commit('play', randomTrack)
                        resolve()
                    }).catch(e => reject(e))
                })
        }
    }
})