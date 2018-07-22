<template>
    <div class="stations-list">
        <ul>
            <li v-for="station in stations" :key="station.name">
                <a href="#" @click.prevent="handleItemClick(station)">{{ station.name }}</a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'stations-list',
        props: {
            stations: {
                type: Array,
                default: []
            }
        },
        methods: {
            handleItemClick(station) {
                this.$emit('item-click', station)
            }
        }
    }
</script>