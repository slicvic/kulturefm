<template>
    <div class="app">
        <h1>VueRadio</h1>
        <stations-container></stations-container>
        <player-container></player-container>
    </div>
</template>

<script>
    import StationsContainer from './components/StationsContainer.vue'
    import PlayerContainer from './components/PlayerContainer.vue'

    export default {
        name: 'app',
        components: {
            StationsContainer,
            PlayerContainer
        }
    }
    
</script>