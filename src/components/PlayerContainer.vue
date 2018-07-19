<template>
    <div class="player-container">
        <player :tracks="currentStation.tracks || []"></player>
    </div>
</template>

<script>
import Player from './Player.vue'

export default {
    name: 'player-container',
    computed: {
        currentStation() {
            return this.$store.state.currentStation || {}
        }
    },
    components: {
        Player
    }
}
</script>
