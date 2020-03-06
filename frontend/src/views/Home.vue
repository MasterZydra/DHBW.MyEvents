<template>
    <div style="text-align: center">
        <h1>MyEvents</h1>
        <p>Find personalized music events with Spotify</p>
        <v-btn link :href="loginLink">Login to Spotify</v-btn>
    </div>
</template>

<script>
    import config from "../config.js";
    import router from "../router";
    export default {
        name: "Home",
        computed: {
            loginLink: function () {
                return config.apiUrl + "authenticate";
            }
        },
    }
</script>

<style scoped>

</style>