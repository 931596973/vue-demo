<template>
  <div id="app">
    <!-- <car-manage> -->
    <!-- </car-manage> -->
    <router-view></router-view>
  </div>
</template>

<script>
import carManage from './components/carManage.vue'

export default {
  name: 'App',
  components: {
    // carManage
  }
}
</script>

<style>
</style>
