<template>
    <div class="about-component">
        <span class="logo">kulture.fm</span> with <i class="fa fa-heart"></i> by <a target="_blank" href="http://slicvic.com" class="text-dark primary-font">slicvic.com</a>
    </div>
</template>

<style>
.about-component {
    position: fixed;
    bottom: 60px;
    right: 15px;
}
.about-component .logo {
    font-size: 3.125rem;
}
.about-component a {
    text-decoration: underline;
    font-size: 2rem;
}
</style>

<script>
export default {
    name: 'about-component'
}
</script>

