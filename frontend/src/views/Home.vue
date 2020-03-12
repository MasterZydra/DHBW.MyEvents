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
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        }
    }
</script>

<style scoped>
    .background {
        width: 100%;
        height: 100%;
        background-color: #509BF5;
        background-image: -webkit-gradient(linear, left top, left bottom, from(#C074B2), to(#8AB5E8));
        background-image: linear-gradient(#C074B2, #8AB5E8);
    }
    .wrapper {
        text-align: center;
        padding-top: 10vh;
    }
</style>