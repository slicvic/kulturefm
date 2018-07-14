import config from '../config/index.js'

SC.initialize({
    client_id: config.soundCloud.api.clientId
})

export default {
    findTracksByGenre(genre) {
        return SC.get('/tracks', {genres: genre});
    },
    playTrack(trackId) {
        return SC.stream('/tracks/' + trackId);
    }
}
