<template>
  <div class="container">
    <button-store></button-store>
    <div class="flex-box">
      <super-button></super-button>
      <super-canvas></super-canvas>
    </div>
  </div>
</template>

<script>
import ButtonStore from './components/ButtonStore'
import SuperButton from './components/SuperButton'
import SuperCanvas from './components/SuperCanvas'
import store from './store'

export default {
  name: 'app',
  store,
  components: {
    ButtonStore,
    SuperButton,
    SuperCanvas,
  }
}
</script>

<style>
.flex-box{
	display: flex;
}

.container {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
