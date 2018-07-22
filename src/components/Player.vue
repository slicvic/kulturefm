<template>
    <div class="player">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4">
                    <div class="track-info media" v-if="currentTrack">
                        <img class="mr-3 img-thumbnail" :src="currentTrack.artwork_url">
                        <div class="media-body align-self-center">
                            <h6 class="mt-0">{{ currentTrack.title }}</h6>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 text-center">
                    <button :disabled="!canSkipToPrev" @click="prev" class="player-control btn btn-link" title="Skip to previous"><i class="fas fa-fw fa-step-backward"></i></button>
                    <button :disabled="!canPlayOrPause" @click="togglePlay" class="player-control player-control-play btn btn-link" :title="[isPlaying ? 'Pause' : 'Play']" ><i :class="[isPlaying ? 'fas fa-fw fa-pause-circle' : 'fas fa-fw fa-play-circle']"></i></button>
                    <button :disabled="!canSkipToNext" @click="next" class="player-control btn btn-link" title="Skip to next"><i class="fas fa-fw fa-step-forward"></i></button>
                </div>
                <div class="col-md-4 text-center text-md-right align-self-center">
                    <button :disabled="!canRestart" @click="restart" class="player-control btn btn-link" title="Restart track"><i class="fas fa-fw fa-redo-alt"></i></button>
                    <button @click="toggleMute" class="player-control btn btn-link" :title="[muted ? 'Unmute' : 'Mute']"><i :class="[muted ? 'fas fa-fw fa-volume-off' : 'fas fa-fw fa-volume-up']"></i></button>
                </div>
            </div>
        </div>

    </div>
</template>

<style>
    .player-control-play {
        font-size: 3rem;
    }

    .player .track-info img {
        width: 86px;
        height: 86px;
    }
</style>

<script>
import soundcloudSvc from '../services/soundcloud.js'

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
            currentTrackIndex: 0,
            muted: false,
            audioObj: null
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
            return this.trackCount && !this.isLastTrack
        },
        canSkipToPrev() {
            return this.trackCount && !this.isFirstTrack
        },
        currentTrackNumber() {
            return this.currentTrackIndex + 1
        },
        trackCount() {
            return this.tracks.length
        },
        lastTrackIndex() {
            return this.trackCount - 1
        },
        isLastTrack() {
            return this.currentTrackIndex === this.lastTrackIndex
        },
        isFirstTrack() {
            return this.currentTrackIndex === 0
        }
    },
    methods: {
        setInitialState() {
            this.pause()
            this.state = State.IDLE
            this.currentTrack = null
            this.currentTrackIndex = 0
        },
        next() {
            this.loadTrack(this.currentTrackIndex + 1).then(() => this.play())
        },
        prev() {
            this.loadTrack(this.currentTrackIndex - 1).then(() => this.play())
        },
        play() {
            try {
                this.audioObj.play()
            } catch(e) {}
        },
        pause() {
            try {
                this.audioObj.pause()
            } catch(e) {}
        },
        restart() {
            try {
                this.audioObj.seek(0)
            } catch(e) {}
        },
        toggleMute() {
            this.muted = !this.muted
            try {
                this.audioObj.setVolume(this.muted ? 0 : 1)
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

            return new Promise((resolve, reject) => {
                const trackToPlay = this.tracks[index]
                if (trackToPlay) {
                    this.currentTrackIndex = index
                    this.currentTrack = trackToPlay

                    soundcloudSvc.streamTrack(trackToPlay.id)
                        .then(player => {
                            this.audioObj = player
                            if (this.muted) {
                                this.audioObj.setVolume(0)
                            }
                            this.audioObj.on('state-change', (state) => {
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
