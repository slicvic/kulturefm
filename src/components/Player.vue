<template>
    <div class="player-component">
        <div class="inner container-fluid">
            <div class="row">
                <div class="col-md-4">
                    <div class="media track-info" v-if="currentTrack">
                        <img class="track-cover-img" v-if="currentTrack.artwork_url" :src="currentTrack.artwork_url">
                        <i class="fa fa-music track-cover-ico" v-if="!currentTrack.artwork_url"></i>
                        <div class="media-body align-self-center ml-3 track-title-container">
                            <h6 class="mt-0 track-title" :title="currentTrack.title">{{ currentTrack.title }}</h6>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 text-center">
                    <button
                        class="player-control btn btn-link"
                        title="Skip to previous track"
                        :disabled="!canSkipToPrev"
                        @click="prev">
                        <i class="fa fa-fw fa-step-backward"></i>
                    </button>
                    <button
                        class="player-control btn btn-link"
                        :disabled="!canPlayOrPause"
                        :title="[isPlaying ? 'Pause' : 'Play']"
                        @click="togglePlay">
                        <i :class="['fa-3x', isPlaying ? 'fa fa-fw fa-pause-circle' : 'fa fa-fw fa-play-circle']"></i>
                    </button>
                    <button
                        class="player-control btn btn-link"
                        title="Skip to next track"
                        :disabled="!canSkipToNext"
                        @click="next">
                        <i class="fa fa-fw fa-step-forward"></i>
                    </button>
                </div>
                <div class="col-md-4 text-right align-self-center">
                    <button
                        class="player-control btn btn-link"
                        title="Restart track"
                        :disabled="!canRestart"
                        @click="restart">
                        <i class="fa fa-fw fa-redo-alt"></i>
                    </button>
                    <button
                        class="player-control btn btn-link"
                        :title="[muted ? 'Unmute' : 'Mute']"
                        @click="toggleMute">
                        <i :class="[muted ? 'fa fa-fw fa-volume-off' : 'fa fa-fw fa-volume-up']"></i>
                    </button>
                    <span class="next-stop" v-if="nextCountry">
                        <span class="font-weight-light">Next stop</span> <i class="fa fa-map-marker-alt"></i> <strong>{{ nextCountry.name.common }}</strong>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.player-component {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    background-color: rgba(0, 0, 0, 0.8);
}
.player-component .inner {
    padding-left: 0;
}
.player-component .track-info {
    height: 100%;
}
.player-component .track-cover-img {
    width: 60px;
    height: 60px;
    background: #000;
}
.player-component .track-cover-ico {
    font-size: 3.125rem;
    color: #777;
    height: 100%;
    padding: 5px;
}
.player-component .track-title-container {
    overflow: hidden;
}
.player-component .track-title {
    color: #ccc;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.player-component .next-stop {
    color: #ccc;
}
.player-component .player-control {
    color: #476cfb;
}
.player-component .player-control:hover {
    color: #3033ab;
}
.player-component .player-control:disabled {
    color: #3e4e88;
}
</style>

<script>
import soundcloudSvc from '../services/soundcloud.js'

/**
 * INTERNAL STATES.
 */
const State = {
    IDLE: 'idle',
    LOADING: 'loading',
    PLAYING: 'playing',
    PAUSED: 'paused',
    FINISHED: 'finished',
    ERROR: 'error',
}

export default {
    name: 'player-component',
    data() {
        return {
            state: State.IDLE,
            muted: false,
            audioObj: null,
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
        nextCountry() {
            return this.$store.state.nextCountry
        },
    },
    watch: {
        currentTrack(track) {
            this.loadTrack(track)
                .then(() => this.play())
                .catch(console.error)
        },
    },
    methods: {
        next() {
            this.state = State.LOADING
            this.$store.dispatch('playNext')
        },
        prev() {
            this.$store.dispatch('playPrev')
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
            this.state === State.PAUSED ? this.play() : this.pause()
        },
        loadTrack(track) {
            if (this.audioObj) {
                this.audioObj.kill()
            }

            return new Promise((resolve, reject) => {
                soundcloudSvc
                    .streamTrack(track.id)
                    .then((player) => {
                        this.audioObj = player
                        if (this.muted) {
                            this.audioObj.setVolume(0)
                        }
                        this.audioObj.on('state-change', (state) => {
                            switch (state) {
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
                    })
                    .catch((e) => {
                        this.state = State.ERROR
                        reject(e)
                    })
            })
        },
    },
}
</script>
