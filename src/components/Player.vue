<template>
    <div class="player">
        <button :disabled="!canSkipToPrev" @click="prev" class="btn btn-secondary" title="Skip to previous"><i class="fas fa-fw fa-step-backward"></i></button>
        <button :disabled="!canPlayOrPause" @click="togglePlay" class="btn btn-secondary" :title="[isPlaying ? 'Pause' : 'Play']" ><i :class="[isPlaying ? 'fas fa-fw fa-pause' : 'fas fa-fw fa-play']"></i></button>
        <button :disabled="!canSkipToNext" @click="next" class="btn btn-secondary" title="Skip to next"><i class="fas fa-fw fa-step-forward"></i></button>
        <button :disabled="!canRestart" @click="restart" class="btn btn-secondary" title="Restart track"><i class="fas fa-fw fa-redo"></i></button>
        <button @click="toggleMute" class="btn btn-secondary" :title="[muted ? 'Unmute' : 'Mute']"><i :class="[muted ? 'fas fa-fw fa-volume-off' : 'fas fa-fw fa-volume-up']"></i></button>
        <span>{{ currentTrack ? currentTrack.title : '' }}</span>
    </div>
</template>

<script>
import soundcloudSvc from '../services/soundcloud.js'

let audioObj = null

const State = {
    IDLE: 'idle',
    LOADING: 'loading',
    PLAYING: 'playing',
    PAUSED: 'paused',
    FINISHED: 'finished',
    ERROR: 'error'
}

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
            state: State.IDLE,
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
               this.setInitialState()
            }
        }
    },
    computed: {
        isPlaying() {
            return this.state === State.PLAYING
        },
        canPlayOrPause() {
            return [State.PLAYING, State.PAUSED, State.FINISHED].includes(this.state)
        },
        canRestart() {
            return [State.PLAYING].includes(this.state)
        },
        canSkipToNext() {
            return (this.currentTrackIndex < this.lastTrackIndex) 
                && [State.PLAYING, State.PAUSED, State.ERROR].includes(this.state)
        },
        canSkipToPrev() {
            return (this.currentTrackIndex > 0) 
                && [State.PLAYING, State.PAUSED, State.FINISHED, State.ERROR].includes(this.state)
        },
        trackCount() {
            return this.tracks.length
        },
        lastTrackIndex() {
            return this.trackCount - 1
        }
    },
    methods: {
        setInitialState() {
            this.pause()
            this.state = State.IDLE
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
            try {
                audioObj.play()
            } catch(e) {}
        },
        pause() {
            try {
                audioObj.pause()
            } catch(e) {}
        },
        restart() {
            try {
                audioObj.seek(0)
            } catch(e) {}
        },
        toggleMute() {
            this.muted = !this.muted
            try {
                audioObj.setVolume(this.muted ? 0 : 1)
            } catch(e) {}
        },
        togglePlay() {
            if (this.state === State.PAUSED) {
                this.play()
            } else {
                this.pause()
            }
        },
        loadTrack(index) {
            this.pause()
            this.state = State.LOADING

            return new Promise((resolve, reject) => {
                const trackToPlay = this.tracks[index]

                if (trackToPlay) {
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
                                        this.state = State.PAUSED
                                        break
                                    case 'playing':
                                        this.state = State.PLAYING
                                        break
                                    case 'loading':
                                        this.state = State.LOADING
                                        break
                                    case 'ended':
                                        this.state = State.FINISHED
                                        this.next()
                                        break
                                    case 'error':
                                    default:
                                        this.state = State.ERROR
                                        break
                                }
                            })
                            resolve()
                        }).catch(e => {
                            this.state = State.ERROR
                            reject(e)
                        })
                } else if (index > this.lastTrackIndex) {
                    this.state = State.FINISHED
                    reject('Finished playing tracks')
                } else {
                    this.state = State.ERROR
                    reject('Invalid track index ' + index)
                }
            })
        }
    }
}
</script>
