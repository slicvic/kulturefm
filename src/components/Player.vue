<template>
    <div class="player">
        <h2>Player</h2>
        <ul>
            <li v-for="track in tracks" :key="track.id">{{ track.title }}</li>
        </ul>
        <button v-show="currentTrack" @click="togglePlay">{{ paused ? 'Play' : 'Pause'}}</button>
    </div>
</template>

<script>
import soundcloudSvc from '../services/soundcloud.js'
let audioPlayer = null

export default {
    name: 'player',
    props: {
        tracks: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            paused: false,
            currentTrack: null
        }
    },
    created() {
        const self = this;
        if (this.tracks.length) {
            soundcloudSvc.playTrack(this.tracks[0].id)
                .then((_audioPlayer) => {
                    audioPlayer = _audioPlayer
                    audioPlayer.play().then(function() {
                        console.log(audioPlayer)
                        console.log('Playback started!')
                        self.currentTrack = self.tracks[0].id
                    }).catch(function(e) {
                        console.error('Playback rejected. Try calling play() from a user interaction.', e)
                    });
                })
        }
    },
    methods: {
        togglePlay() {
            if (this.paused) {
                this.paused = false
                audioPlayer.play()
            } else {
                this.paused = true
                audioPlayer.pause()
            }
        }
    }
}
</script>
