import config from '../config/index.js'

SC.initialize({
    client_id: config.soundcloud.api.clientId
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
                SC.get('/tracks', params)
                    .then(tracks => resolve(tracks.filter(t => t.streamable == streamable)))
                    .catch(e => reject(e))
            })
    }
}