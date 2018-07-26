import config from '../config/index.js'

SC.initialize({
    client_id: config.soundCloud.api.clientId
})

export default {
    streamTrack(trackId) {
        return SC.stream('/tracks/' + trackId)
    },
    findTracks({
        q = '', 
        tags = '', 
        genres = '', 
        limit = 10,
        streamable = true
    }) {
        const params = {
            limit,
            streamable
        }

        if (q) {
            params.q = q
        }

        if (tags) {
            params.tags = tags
        }

        if (genres) {
            params.genres = genres
        }

        return new Promise((resolve, reject) => {
            return SC.get('/tracks', params)
                .then(tracks => {
                    console.log('tracks', tracks)
                    console.log('tracks filtered', tracks.filter(t => t.streamable == streamable))
                    resolve(tracks.filter(t => t.streamable == streamable))
                })
                .catch(e => reject(e))
        })
    }
}