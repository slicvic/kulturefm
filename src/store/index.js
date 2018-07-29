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
        currentLocation: null,
        nextDestination: null
    },
    getters: {
        currentTrack(state) {
            return state.playlist[state.currentTrackIndex]
        }
    },
    mutations: {
        play(state, {track, country}) {
            state.playlist.push(track)
            state.currentTrackIndex = state.playlist.length - 1
            state.currentLocation = country
            state.nextDestination = _.sample(state.countries)
        },
        playPrev(state) {
            const prevIndex = state.currentTrackIndex - 1
            if (state.playlist[prevIndex]) {
                state.currentTrackIndex = prevIndex
            } else {
                throw Error('Invalid track index (' + prevIndex + ')')
            }
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
                            const shuffledCountries = _.shuffle(countries)
                            context.commit('setCountries', shuffledCountries)
                            resolve()
                        }).catch(e => reject(e))
                })
        },
        play(context, {track, country}) {
            context.commit('play', {track, country})
        },
        playPrev(context) {
            context.commit('playPrev')
        },
        getRandomCountry({state}) {
            return new Promise((resolve, reject) => {
                    const country = _.sample(state.countries)
                    if (country.details) {
                        resolve(country)
                    } else {
                        countriesSvc.detailsByCountryCode(country.code)
                            .then(details => {
                                country.details = details
                                resolve(country)
                            }).catch(e => reject(e))
                    }
                })
        },
        playRandom({commit, dispatch}) {
            return new Promise((resolve, reject) => {
                dispatch('getRandomCountry')
                    .then(country => {
                        const genre = _.sample(_.shuffle(country.genres))
                        soundcloudSvc.findTracks({
                            genres: genre,
                            limit: 200
                        }).then(tracks => {
                            const track = _.sample(_.shuffle(tracks))
                            commit('play', {track, country})
                            resolve()
                        }).catch(e => reject(e))
                    }).catch(e => reject(e))
                })
        }
    }
})