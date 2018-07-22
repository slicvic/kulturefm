<template>
    <div class="stations-list">
        <ul>
            <li v-for="station in stations" :key="station.name">
                <a href="#" @click.prevent="handleItemSelect(station)">{{ station.name }}</a>
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
            handleItemSelect(station) {
                this.$emit('item-select', station)
            }
        }
    }
</script>