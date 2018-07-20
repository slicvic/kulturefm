<template>
    <div class="player">
        <h2>Player</h2>
        <button :disabled="!canGoToPrevTrack" @click="prev">Prev</button>
        <button :disabled="!isPlayingOrPaused" @click="togglePlay">{{ playBtnText }}</button>
        <button :disabled="!canGoToNextTrack" @click="next">Next</button>
        <button @click="toggleMute">{{ muted ? 'Unmute' : 'Mute' }}</button>
        <ul>
            <li v-for="track in tracks" :key="track.id">{{ track.title }}</li>
        </ul>
    </div>
</template>

<script>
import soundcloudSvc from '../services/soundcloud.js'

const Status = {
    IDLE: 'idle',
    LOADING: 'loading',
    PLAYING: 'playing',
    PAUSED: 'paused',
    ENDED: 'ended',
    ERROR: 'error'
}

let audioObj = null

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
            status: Status.IDLE,
            currentTrack: null,
            currentTrackIndex: -1,
            muted: false
        }
    },
    watch: {
        tracks() {
            if (this.trackCount) {
                this.loadTrack(0).then(() => this.play())
            } else {
               this.setInitialStatus()
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
        setInitialStatus() {
            this.pause()
            this.status = Status.IDLE
            this.currentTrack = null
            this.currentTrackIndex = -1
        },
        next() {
            this.loadTrack(this.currentTrackIndex + 1).then(() => this.play())
        },
        prev() {
            this.loadTrack(this.currentTrackIndex - 1).then(() => this.play())
        },
        play() {
            if (audioObj) {
                audioObj.play()
            }
        },
        pause() {
            if (audioObj) {
                audioObj.pause()
            }
        },
        toggleMute() {
            this.muted = !this.muted
            if (audioObj) {
                audioObj.setVolume(this.muted ? 0 : 1)
            }
        },
        togglePlay() {
            if (this.status === Status.PAUSED) {
                this.play()
            } else {
                this.pause()
            }
        },
        loadTrack(index) {
            this.pause()

            return new Promise((resolve, reject) => {
                this.status = Status.LOADING

                if (this.tracks[index]) {
                    const trackToPlay = this.tracks[index]
                    this.currentTrackIndex = index
                    this.currentTrack = trackToPlay

                    soundcloudSvc.streamTrack(trackToPlay.id)
                        .then(player => {
                            audioObj = player

                            if (this.muted) {
                                audioObj.setVolume(0)
                            }

                            audioObj.on('state-change', (state) => {
                                switch(state) {
                                    case 'paused':
                                        this.status = Status.PAUSED
                                        break
                                    case 'playing':
                                        this.status = Status.PLAYING
                                        break
                                    case 'loading':console.log(2222)
                                        this.status = Status.LOADING
                                        break
                                    case 'ended':
                                        this.status = Status.ENDED
                                        this.next()
                                        break
                                    case 'error':
                                    default:
                                        this.status = Status.ERROR
                                        break
                                }
                            })
                            resolve()
                        }).catch(e => {
                            this.status = Status.ERROR
                            reject(e)
                        })
                } else if (index > this.lastTrackIndex) {
                    this.status = Status.ENDED
                    reject('Finished playing tracks')
                } else {
                    this.status = Status.ERROR
                    reject('Invalid track index ' + index)
                }
            })
        }
    }
}
</script>
