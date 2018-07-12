<template>
    <div class="player">
        <h2>Player</h2>
    </div>
</template>

<script>
export default {
    name: 'player',
    props: {
        tracks: {
            type: Array,
            required: true
        }
    }
}
</script>
