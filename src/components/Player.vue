<template>
    <div class="player">
        <div class="player_inner container-fluid">
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
                        <i class="fas fa-fw fa-step-backward"></i>
                    </button>
                    <button
                        class="player__control player__control--play btn btn-link"
                        :disabled="!canPlayOrPause"
                        :title="[isPlaying ? 'Pause' : 'Play']"
                        @click="togglePlay">
                        <i :class="[isPlaying ? 'fas fa-fw fa-pause-circle' : 'fas fa-fw fa-play-circle']"></i>
                    </button>
                    <button
                        class="player__control btn btn-link"
                        title="Skip to next destination"
                        :disabled="!canSkipToNext"
                        @click="next">
                        <i class="fas fa-fw fa-step-forward"></i>
                    </button>
                </div>
                <div class="col-md-4 text-center text-md-right align-self-center">
                    <button
                        class="player__control btn btn-link"
                        title="Restart track"
                        :disabled="!canRestart"
                        @click="restart">
                        <i class="fas fa-fw fa-redo-alt"></i>
                    </button>
                    <button
                        class="player__control btn btn-link"
                        :title="[muted ? 'Unmute' : 'Mute']"
                        @click="toggleMute">
                        <i :class="[muted ? 'fas fa-fw fa-volume-off' : 'fas fa-fw fa-volume-up']"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .player_inner {
        padding-left: 0;
    }
    
    .player__control--play {
        font-size: 3rem;
    }

    .player__track-info img {
        width: 86px;
        height: 86px;
    }
</style>

<script>
import searchSvc from '../services/search.js'
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
    data() {
        return {
            state: State.IDLE,
            muted: false,
            audioObject: null
        }
    },
    watch: {
        currentTrackIndex(index) {
            this.loadTrack(index).then(() => this.play())
        }
    },
    computed: {
        tracks() {
            return this.$store.state.tracks
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
        }
    },
    methods: {
        next() {
            this.state = State.LOADING
            searchSvc.findRandomTrackFrom(this.$store.state.nextDestination)
                .then(response => this.$store.dispatch('addAndPlayTrack', response.track))
                .catch(e => { 
                    throw new Error(e)
                })
        },
        prev() {
            this.$store.dispatch('playPrevTrack')
        },
        play() {
            this.audioObject.play()
        },
        pause() {
            this.audioObject.pause()
        },
        restart() {
            this.audioObject.seek(0)
        },
        toggleMute() {
            this.muted = !this.muted
            this.audioObject.setVolume(this.muted ? 0 : 1)
        },
        togglePlay() {
            (this.state === State.PAUSED) ? this.play() : this.pause()
        },
        loadTrack(index) {
            if (this.audioObject) {
                this.audioObject.kill()
            }
            return new Promise((resolve, reject) => {
                const trackToPlay = this.tracks[index]
                soundcloudSvc.streamTrack(trackToPlay.id)
                    .then(player => {
                        this.audioObject = player
                        if (this.muted) {
                            this.audioObject.setVolume(0)
                        }
                        this.audioObject.on('state-change', (state) => {
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
