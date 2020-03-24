<template>
    <div class="wrapper white--text">
        <h1 class="font-weight-black display-2">MyEvents</h1>
        <p class="title">Find personalized music events with Spotify</p>
        <v-btn link :href="loginLink" rounded x-large color="secondary">Login to Spotify</v-btn>
    </div>
</template>

<script>
    import config from "../config.js";

    export default {
        name: "Home",
        computed: {
            loginLink: function () {
                let redirect_uri = window.location.href + "events";
                return config.apiUrl + "authenticate?redirect_uri=" + redirect_uri;
            }
        },
        created() {
            // remove Spotify access_token and refresh_token from localStorage so user will be logged out first
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        }
    }
</script>

<style scoped>
    .wrapper {
        text-align: center;
        padding-top: 10vh;
    }
</style>