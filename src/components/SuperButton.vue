<template>
  <div class="draw">
    <button v-for="button in buttons"
            type="button"
            :class="button.class"
            :id="button.id"
            @click="changeStatus(button.id)">
      {{ button.text }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'super-button',
  data(){
    return {
      buttons: [
        {
          text:'画线',
          id:'line',
          class:'btn btn-outline-success',
        },
        {
          text:'选点',
          id:'ctrlline',
          class:'btn btn-outline-success',
        },
        {
          text:'移动',
          id:'move',
          class:'btn btn-outline-success',
        },
        {
          text:'删除',
          id:'remove',
          class:'btn btn-outline-danger',
        }
      ]
    }
  },
  methods: {
    changeStatus(status){
      this.$store.dispatch('changeStatus', status)
    },
  }
}
</script>

<style>
.draw{
	margin-top: 30px;
	display: inline-block;
}
.draw button{
	display: block;
	margin-bottom: 20px;
	float: left;
	clear: both;
}

.draw #remove{
	margin-bottom: 300px;
}
</style>
