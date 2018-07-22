<template>
    <div class="stations-search-form">
        <form>
            <input type="text" v-model="searchTerm">
            <button @click.prevent="handleSearchButtonClick">Play</button>
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
            handleSearchButtonClick(v) {
                this.$emit('submit', {searchTerm: this.searchTerm})
            }
        }
    }
</script>