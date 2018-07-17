<template>
    <div class="stations">
        <h2>Stations</h2>
        <ul>
            <li v-for="station in stations" :key="station.name">
                <a href="#" @click.prevent="$emit('station-click', station)">{{ station.title }}</a>
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
        }
    }
</script>