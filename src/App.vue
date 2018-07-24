<template>
    <div class="app">
        <div class="container">
            <h1>VueRadio</h1>
            <stations-container></stations-container>
        </div>
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