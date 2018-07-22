import config from '../config/index.js'

SC.initialize({
    client_id: config.soundCloud.api.clientId
})

export default {
    streamTrack(trackId) {
        return SC.stream('/tracks/' + trackId)
    },
    findTracks({
        q = null, 
        tags = null, 
        genres = null, 
        successCallback = () => {}, 
        failureCallback = () => {}
    }) {
        const params = {
            limit: 200
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

        return SC.get('/tracks', params)
            .then(tracks => successCallback(tracks.filter(t => t.streamable == true)))
            .catch(failureCallback)
    }
}
