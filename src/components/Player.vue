<template>
    <div class="player">
        <h2>Player</h2>
        <button :disabled="!canGoToPrevTrack" @click="prev">Prev</button>
        <button :disabled="!isPlayingOrPaused" @click="togglePlay">{{ playBtnText }}</button>
        <button :disabled="!canGoToNextTrack" @click="next">Next</button>
        <ul>
            <li v-for="track in tracks" :key="track.id">{{ track.title }}</li>
        </ul>
    </div>
</template>

<script>
import soundcloudSvc from '../services/soundcloud.js'

const Status = {
    READY: 'ready',
    LOADING: 'loading',
    PLAYING: 'playing',
    PAUSED: 'paused',
    ENDED: 'ended',
    ERROR: 'error'
}

export default {
    name: 'player',
    created() {

    },
    props: {
        tracks: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            status: Status.READY,
            currentTrack: null,
            currentTrackIndex: -1,
            audioPlayer: null,
            muted: false
        }
    },
    watch: {
        status(newStatus, oldStatus) {
            if (this.audioPlayer) {
                if (newStatus === Status.PLAYING) {
                    this.audioPlayer.play()
                } else {
                    this.audioPlayer.pause()
                }
            } else {
                // Do nothing
            }
        },
        tracks() {
            if (this.trackCount) {
                this.playTrackByIndex(0)
            } else {
                this.status = Status.READY
                this.currentTrack = null
                this.currentTrackIndex = -1
            }
        }
    },
    computed: {
        playBtnText() {
            return this.status === Status.PLAYING ? 'Pause' : 'Play'
        },
        isPlayingOrPaused() {
            return [Status.PLAYING, Status.PAUSED].includes(this.status)
        },
        canGoToNextTrack() {
            return (this.currentTrackIndex < this.lastTrackIndex) 
                && [Status.PLAYING, Status.PAUSED, Status.ERROR].includes(this.status)
        },
        canGoToPrevTrack() {
            return (this.currentTrackIndex > 0) 
                && [Status.PLAYING, Status.PAUSED, Status.ENDED, Status.ERROR].includes(this.status)
        },
        trackCount() {
            return this.tracks.length
        },
        lastTrackIndex() {
            return this.trackCount - 1
        }
    },
    methods: {
        isStatus(status) {
            return this.status === status
        },
        setStatus(status) {
            this.status = status
        },
        togglePlay() {
            this.setStatus(this.isStatus(Status.PLAYING) ? Status.PAUSED : Status.PLAYING)
        },
        next() {
            this.playTrackByIndex(this.currentTrackIndex + 1)
        },
        prev() {
            this.playTrackByIndex(this.currentTrackIndex - 1)
        },
        playTrackByIndex(index) {
            this.setStatus(Status.LOADING)
            const trackToPlay = this.tracks[index]
            this.audioPlayer = null

            if (trackToPlay) {
                this.currentTrackIndex = index
                this.currentTrack = trackToPlay
                soundcloudSvc.streamTrack(trackToPlay.id)
                    .then(player => {
                        this.audioPlayer = player
                        this.audioPlayer.play().then(() => {
                            this.setStatus(Status.PLAYING)
                        }).catch(e => {
                            this.setStatus(Status.ERROR)
                        })
                    }).catch(e => {
                        this.setStatus(Status.ERROR)
                    })
            } else {
                throw new Error('Invalid track index: ' + index)
            }
        }
    }
}
</script>
