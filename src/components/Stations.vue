<template>
    <div class="stations">
        <h2>Stations</h2>
        <ul>
            <li v-for="station in stations" :key="station.name">
                <a href="#" @click.prevent="handleStationClick(station)">{{ station.name }}</a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'stations',
        props: {
            stations: {
                type: Array,
                default: []
            }
        },
        methods: {
            handleStationClick(station) {
                this.$emit('station-click', station)
            }
        }
    }
</script>