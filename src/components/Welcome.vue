<template>
    <div class="welcome d-flex justify-content-center">
        <div class="align-self-center">
            <h1>KultureFM</h1>
            <button
                class="welcome__start-btn btn btn-link"
                title="Start culturalizing"
                v-if="!loading"
                @click="onStartClick">
                <i class="fas fa-fw fa-play-circle"></i>
            </button>
            <i v-if="loading" class="welcome__spinner fa fa-spinner fa-spin"></i> 
        </div>
    </div>
</template>

<style>
    .welcome {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 1000;
        color: #fff;
        text-align: center;
    }

    .welcome__start-btn {
        font-size: 6rem;
    }

    .welcome__spinner {
        font-size: 6rem;  
    }
</style>

<script>
export default {
    name: 'welcome',
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
  