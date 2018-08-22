<template>
    <div class="welcome d-flex justify-content-center">
        <div class="align-self-center">
            <h1 class="logo">kulture.fm</h1>
            <button
                class="welcome-start-btn btn btn-link"
                title="Start culturalizing"
                :disabled="loading"
                @click="onStartClick">
                <i :class="{'fa': true, 'fa-fw': true, 'fa-play-circle': !loading, 'fa-spinner fa-spin': loading}"></i>
            </button>
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
.welcome .logo {
    font-size: 5.5rem;
    height: 90px;
}
.welcome-start-btn {
    font-size: 6rem;
}
.welcome-start-btn,
.welcome-start-btn:disabled {
    color: #476CFB;
    opacity: 1;
}
.welcome-start-btn:hover {
    color: #3033AB;
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
  