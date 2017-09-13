<template>
  <div class="canvaswrap"
       @mousedown="mousedown"
       @mousemove="mousemove"
       @mouseup="mouseup">
    <canvas width="1050"
            height="1000"
            id="canvas">
    </canvas>
    <canvas-model v-for="model in models"
                  :iscurrent="model.iscurrent"
                  :x="model.x"
                  :y="model.y"
                  :uniqueId="model.uniqueId"
                  :ctrlline="model.ctrlline">
    </canvas-model>
  </div>
</template>

<script>
import $ from 'jquery'
import _ from 'underscore'
import createjs from 'EaselJS'
import CanvasModel from './CanvasModel'
import operateModels from '../mixins/operateModels.js'
import draw from '../mixins/draw.js'
import emitter from '../mixins/emitter.js'

export default {
  name: 'super-canvas',

  mixins:[operateModels, draw],

  components:{
    CanvasModel
  },

  created(){
    emitter.on("toStorage",()=>{
      let models = this.models
      let containerp = this.containerp

      localStorage.setItem("vue_sketch_data", JSON.stringify({models, containerp}))
    })

    emitter.on("fromStorage",()=>{
      var data = JSON.parse(localStorage.getItem("vue_sketch_data"))
        , x = data.containerp.x
        , y = data.containerp.y

      this.isFetch = true
      this.resetData()
      this.changeContainer({x, y})
      this.fetchModels(data.models)
    })
  },

  mounted(){
    this.stage = new createjs.Stage("canvas")
    this.container = new createjs.Container()
    this.stage.enableMouseOver()
    this.stage.addChild(this.container)
    this.stage.update()
  },

  data () {
    return this.getInitialData()
  },

  watch: {
    models: {
      handler: function(models){
        if (models.length > this.modelslength){

          var model = models[models.length - 1]
          this.drawCircle(model, model)

          if (model.ctrlline){
            this.createCtrlline(model)
          }

          if (models[models.length - 2] !== void 0){
            var lastmodel = models[models.length - 2]
            console.log(this.isFetch)
            this.drawLine(model, lastmodel, this.isFetch)
          }
        } else if (models.length === 0){
          this.container.removeAllChildren()
          this.stage.update()
        } else if (models.length < this.modelslength){
          this.simpleremove(this.removedtarget)
        }
        this.modelslength = models.length
      },
      deep: true
    },
    containerp: {
      handler: function({x, y}){
        this.container.set({x, y})
        this.stage.update()
      },
      deep: true
    },
    removedtarget: function(val){
      var model = val.model
        , index = _.indexOf(this.models, model)

      if (index !==0 && index !== this.models.length-1){
        this.drawLine(this.models[index-1], this.models[index+1])
      }

      if (model.iscurrent&& this.models.length>1){
        if (index === this.models.length-1){
          var currentmodel = this.models[this.models.length-2]
        } else {
          var currentmodel = this.models[this.models.length-1]
        }

        var ctrlline = _.clone(currentmodel.ctrlline)

        if (ctrlline !== void 0 && !model.ctrllineRemoved) {
          ctrlline.hide = false
          currentmodel.ctrlline = ctrlline
        }
        currentmodel.iscurrent = true
      }

      this.models = _.without(this.models, model)
    }
  },

  methods:{
    mousedown(e){
      if (this.$store.state.preventEvent){
        e.preventDefault()
        this.$store.dispatch("changePreventEvent", false)
        return
      }

      if (this.$store.state.status !== 'line'){
        return
      }

      var x = e.pageX - $(e.target).offset().left - this.containerp.x
        , y = e.pageY - $(e.target).offset().top - this.containerp.y
        , model = {
          iscurrent:true,
          ctrlline: void 0,
          x,
          y
        }

      this.isFetch = false

      this.addPoint({
        model,
        fetch: false,
        models: this.models,
      })

      this.ismousedown = true
    },
    mouseup(e){
      this.isFetch = false
      this.$store.dispatch('changeDragging', false)
      this.ismousedown = false
    },
    mousemove(e){
      var status = this.$store.state.status
      this.isFetch = false

      if (this.ismousedown && (status === 'line'|| status === 'ctrlline')){
        var x = e.pageX - $(e.target).offset().left - this.containerp.x
          , y = e.pageY - $(e.target).offset().top - this.containerp.y

        this.mirrorCtrlline({x,y})
      }
    },
    getInitialData(){
      return {
        models:[],
        modelslength:0,
        removedtarget:null,
        ismousedown: false,
        containerp:{
          x:0,
          y:0
        }
      }
    },
    resetData(){
      Object.assign(this.$data, this.getInitialData())
    },
  },
}
</script>

<style>
.canvaswrap{
	overflow: hidden;
	margin-left: 15px;
	margin-top: 30px;
	display: inline-block;
	flex-grow: 1;
	border:2px solid #eee;
	position: relative;
}

canvas{
	position: absolute;
	top:0;
	cursor: crosshair;
}

#canvas.unable{
	cursor:not-allowed;
}

#canvas.remove{
	cursor: url("../assets/remove.png"), auto;
}

#canvas.ctrlline{
	cursor: url("../assets/ctrlline.png"), auto;
}

#canvas.move{
	cursor: move
}
</style>
