<template>
  <div class="flex flex-col items-center justify-center h-full">
    <LineCoder/>
  </div>
</template>

<script>
import LineCoder from './components/LineCoder.vue'

export default {
  name: 'App',
  components: {
    LineCoder
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  @apply h-full w-full;
}
</style>
