<template>
    <div class="stations-list">
        <div class="d-flex flex-wrap justify-content-center">
            <div class="stations-list__item card" v-for="station in stations" :key="station.name">
                <a href="#" class="card-body" @click.prevent="onItemClick(station)">
                    <div>{{ station.name }}</div>
                </a>
            </div>
        </div>
    </div>
</template>

<style>
    .stations-list__item {
        width: 300px;
        height: 300px;
        border: 1px solid red;
    }

    .stations-list__item a {
        text-decoration: none;
    }

    .stations-list__item a,
    .stations-list__item a:active,
    .stations-list__item a:visited {
        color: #000;
    }
</style>

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
            onItemClick(station) {
                this.$emit('item-click', station)
            }
        }
    }
</script>