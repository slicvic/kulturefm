<template>
    <div class="welcome-component d-flex justify-content-center">
        <div class="align-self-center">
            <h1 class="logo">kulture.fm</h1>
            <button
                class="start-btn btn btn-link"
                title="Start culturalizing"
                :disabled="loading"
                @click="onStartClick">
                <i :class="{'fa': true, 'fa-fw': true, 'fa-play-circle': !loading, 'fa-spinner fa-spin': loading}"></i>
            </button>
        </div>
    </div>
</template>

<style>
.welcome-component {
    position: absolute;
    z-index: 3000;
    width: 100%;
    height: 100%;
    background: #000;
    color: #fff;
    text-align: center;
}
.welcome-component .logo {
    font-size: 6.5rem;
    height: 95px;
}
.welcome-component .start-btn {
    font-size: 6rem;
}
.welcome-component .start-btn,
.welcome-component .start-btn:disabled {
    color: #476CFB;
    opacity: 1;
}
.welcome-component .start-btn:hover {
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