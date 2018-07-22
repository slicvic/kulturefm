<template>
    <div class="player-container">
        <player :tracks="tracks"></player>
    </div>
</template>

<script>
import Player from './Player.vue'

export default {
    name: 'player-container',
    computed: {
        tracks() {
            return this.$store.getters.currentStation ? this.$store.getters.currentStation.tracks : []
        }
    },
    components: {
        Player
    }
}
</script>

<style>
    .player-container {
        position: fixed;
        bottom: 0;
        width: 100%;
        background-color: #f5f5f5;
        padding: 10px
    }
</style>
