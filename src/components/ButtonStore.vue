<template>
  <div>
    <button type="button"
            class="btn btn-outline-primary crud"
            id="fetch"
            @click="fetch"
            :blur="!fetchable"
            :disabled="!fetchable|| !savable">
      Fetch
    <pulse-loader :loading="!fetchable" color="#0275d8" size="5px"></pulse-loader>
    </button>
    <button type="button"
            class="btn btn-outline-warning crud"
            id="save"
            @click="save"
            :blur="!savable"
            :disabled="!fetchable|| !savable">
      Save
    <pulse-loader :loading="!savable" color="#f0ad4e" size="5px"></pulse-loader>
    </button>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import emitter from '../mixins/emitter.js'

export default {
  name: 'ButtonStore',
  data () {
    return {
      fetchable: true,
      savable: true,
    }
  },
  components:{
    PulseLoader
  },
  methods:{
    fetch(){
      this.fetchable = false

      setTimeout(()=>{
        emitter.emit("fromStorage")
        this.savable = true
        this.fetchable = true
      }, 500)
    },
    save(){
      this.savable = false

      setTimeout(()=>{
        emitter.emit("toStorage")
        this.savable = true
        this.fetchable = true
      }, 500)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
button{
  cursor: pointer;
}

#save{
	float: right
}

#save:focus{
	outline:0 !important;
}

#fetch:focus{
	outline:0 !important;
}

.v-spinner{
  display: inline-block;
  margin-left: 5px;
}
</style>
