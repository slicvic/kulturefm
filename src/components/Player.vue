<template>
    <div class="player">
        <div class="player__inner container-fluid">
            <div class="row">
                <div class="col-md-4">
                    <div class="player__track-info media" v-if="currentTrack">
                        <img class="mr-3" :src="currentTrack.artwork_url">
                        <div class="media-body align-self-center">
                            <h6 class="mt-0">{{ currentTrack.title }}</h6>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 text-center">
                    <button
                        class="player__control btn btn-link"
                        title="Revisit previous location"
                        :disabled="!canSkipToPrev"
                        @click="prev">
                        <i class="fa fa-fw fa-step-backward"></i>
                    </button>
                    <button
                        class="player__control player__control--play btn btn-link"
                        :disabled="!canPlayOrPause"
                        :title="[isPlaying ? 'Pause' : 'Play']"
                        @click="togglePlay">
                        <i :class="['fa-3x', isPlaying ? 'fa fa-fw fa-pause-circle' : 'fa fa-fw fa-play-circle']"></i>
                    </button>
                    <button
                        class="player__control btn btn-link"
                        title="Skip to next destination"
                        :disabled="!canSkipToNext"
                        @click="next">
                        <i class="fa fa-fw fa-step-forward"></i>
                    </button>
                </div>
                <div class="col-md-4 text-right align-self-center">
                    <button
                        class="player__control btn btn-link"
                        title="Restart track"
                        :disabled="!canRestart"
                        @click="restart">
                        <i class="fa fa-fw fa-redo-alt"></i>
                    </button>
                    <button
                        class="player__control btn btn-link"
                        :title="[muted ? 'Unmute' : 'Mute']"
                        @click="toggleMute">
                        <i :class="[muted ? 'fa fa-fw fa-volume-off' : 'fa fa-fw fa-volume-up']"></i>
                    </button>
                    <span v-if="nextDestination">
                        <span class="font-weight-light">Next stop</span> <i class="fa fa-map-marker-alt"></i> <strong>{{ nextDestination.name }}</strong>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .player {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 60px;
        background-color: #f5f5f5;
    }
    .player__inner {
        padding-left: 0;
    }
    .player__track-info img {
        width: 60px;
        height: 60px;
    }
</style>

<script>
import searchSvc from '../services/search.js'
import soundcloudSvc from '../services/soundcloud.js'

/**
 * Internal states.
 */
const State = {
    IDLE: 'idle',
    LOADING: 'loading',
    PLAYING: 'playing',
    PAUSED: 'paused',
    FINISHED: 'finished',
    ERROR: 'error'
}

export default {
    name: 'player-component',
    data() {
        return {
            state: State.IDLE,
            muted: false,
            audioObj: null
        }
    },
    watch: {
        currentTrackIndex(index) {
            this.loadTrack(index).then(() => this.play())
        }
    },
    computed: {
        playlist() {
            return this.$store.state.playlist
        },
        currentTrack() {
            return this.$store.getters.currentTrack
        },
        currentTrackIndex() {
            return this.$store.state.currentTrackIndex
        },
        isPlaying() {
            return this.state === State.PLAYING
        },
        canPlayOrPause() {
            return [State.PLAYING, State.PAUSED].includes(this.state)
        },
        canRestart() {
            return [State.PLAYING].includes(this.state)
        },
        canSkipToNext() {
            return ![State.IDLE, State.LOADING].includes(this.state)
        },
        canSkipToPrev() {
            return this.currentTrackIndex > 0
        },
        nextDestination() {
            return this.$store.state.nextDestination
        }
    },
    methods: {
        next() {
            this.state = State.LOADING
            searchSvc.findRandomTrackFrom(this.$store.state.nextDestination)
                .then(response => this.$store.dispatch('playTrack', response.track))
                .catch(e => { 
                    throw Error(e)
                })
        },
        prev() {
            this.$store.dispatch('playPrevTrack')
        },
        play() {
            this.audioObj.play()
        },
        pause() {
            this.audioObj.pause()
        },
        restart() {
            this.audioObj.seek(0)
        },
        toggleMute() {
            this.muted = !this.muted
            this.audioObj.setVolume(this.muted ? 0 : 1)
        },
        togglePlay() {
            (this.state === State.PAUSED) ? this.play() : this.pause()
        },
        loadTrack(index) {
            if (this.audioObj) {
                this.audioObj.kill()
            }
            return new Promise((resolve, reject) => {
                const trackToPlay = this.playlist[index]
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
                }
            )
        }
    }
}
</script>
