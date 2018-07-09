<template>
    <div class="stations">
        <h1>Stations</h1>
        <ul>
            <li v-for="station in stations" :key="station.name">
                <a href="#"
                    @click.prevent="selectStation(station)">{{ station.title }}</a>
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
                required: true
            }
        },
        methods: {
            selectStation: function(station) {
                this.$emit('selectStation', station)
            }
        }
    }
</script>