<template>
    <div class="welcome d-flex justify-content-center">
        <div class="align-self-center">
            <h1>Kulture.fm</h1>
            <button
                class="welcome__start-btn btn btn-link"
                title="Start culturalizing"
                v-if="!loading"
                @click="onStartClick">
                <i class="fas fa-fw fa-play-circle"></i>
            </button>
            <i v-if="loading" class="welcome__loading fas fa-spinner fa-spin"></i> 
        </div>
    </div>
</template>

<style>
    .welcome {
        position: absolute;
        z-index: 3000;
        width: 100%;
        height: 100%;
        background: #000;
        color: #fff;
        text-align: center;
    }
    .welcome__start-btn {
        font-size: 6rem;
    }
    .welcome__loading {
        font-size: 6rem;  
    }
</style>

<script>
export default {
    name: 'welcome-component',
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onStartClick() {
            this.$emit('start-click')
        }
    }
}
</script>
  