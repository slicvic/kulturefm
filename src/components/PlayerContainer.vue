<template>
    <div class="player-container">
        <player :tracks="station.tracks"></player>
    </div>
</template>

<script>
import Player from './Player.vue'

export default {
    name: 'player-container',
    computed: {
        station() {
            return this.$store.state.selectedStation
        }
    },
    components: {
        Player
    }
}
</script>
