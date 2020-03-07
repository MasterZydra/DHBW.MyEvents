<template>
  <v-app>
    <v-navigation-drawer app></v-navigation-drawer>
    
    <v-app-bar color="primary" class="white--text" app>MyEvents</v-app-bar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>

<style>
  * {
    font-family: "Roboto", sans-serif;
  }
  .v-content {
    background-color: #509BF5;
    background-image: linear-gradient(#C074B2, #8AB5E8);
  }
</style>