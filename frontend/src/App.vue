<template>
  <v-content>
    <v-container>
      <router-view></router-view>
    </v-container>
  </v-content>
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
</style>