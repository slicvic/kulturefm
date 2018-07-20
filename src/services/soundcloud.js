import config from '../config/index.js'

SC.initialize({
    client_id: config.soundCloud.api.clientId
})

export default {
    getTracksByGenre(genre, successCallback, failureCallback) {
        return SC.get('/tracks', {
                genres: genre,
                limit: 2
            })
            .then(tracks => successCallback(tracks.filter(t => t.streamable == true)))
            .catch(failureCallback)
    },
    streamTrack(trackId) {
        return SC.stream('/tracks/' + trackId);
    }
}
