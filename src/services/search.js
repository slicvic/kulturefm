import countriesSvc from './countries.js'
import soundCloudSvc from './soundcloud'
import _ from 'lodash'

const findRandomTrack = function() {
    return findRandomTrackFrom(countriesSvc.random())
}

const findRandomTrackFrom = function(country) {
    return new Promise((resolve, reject) => {
        soundCloudSvc.findTracks({
            genres: countriesSvc.randomGenreFrom(country), 
            limit: 200
        }).then(tracks => {
            const randomTrack = _.sample(_.shuffle(tracks))
            randomTrack.country = country
            resolve({
                track: randomTrack
            })
        }).catch(e => reject(e))
    })
}

export default {
    findRandomTrack,
    findRandomTrackFrom
}