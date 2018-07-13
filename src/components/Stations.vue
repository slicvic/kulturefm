<template>
    <div class="stations">
        <h2>Stations</h2>
        <ul>
            <li v-for="station in stations" :key="station.name">
                <a href="#" @click.prevent="change(station)">{{ station.title }}</a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'stations',
        data: function() {
            return {
                stations: []
            }
        },
        created: function() {
            this.stations = this.$store.state.stations
        },
        methods: {
            change: function(station) {
                this.$emit('change', station)
            }
        }
    }
</script>