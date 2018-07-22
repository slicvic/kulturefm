<template>
    <div class="stations-search-form">
        <form>
            <input type="text" placeholder="Artist, Genre, Song" v-model="searchTerm" @keyup.enter.prevent="submitForm">
            <button @click.prevent="submitForm">Play</button>
        </form>
    </div>
</template>
<script>
    export default {
        name: 'stations-search-form',
        data() {
            return {
                searchTerm: ''
            }
        },
        methods: {
            submitForm() {
                this.$emit('submit', {searchTerm: this.searchTerm})
            }
        }
    }
</script>