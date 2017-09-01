<template></template>

<script>
import _ from 'underscore'

export default {
  name:'canvas-model',

  props:['iscurrent', 'x', 'y', 'uniqueId', 'ctrlline'],

  watch:{
    iscurrent(){
      this.$parent.drawCurrent(this.iscurrent, this.uniqueId)
    },

    ctrlline(newctrl, oldctrl){

      if (!_.isEmpty(oldctrl)){

        this.$parent.changeSquare(this)
        this.$parent.changeLine(this)
        this.$parent.changeCtrlline(this)
      } else {
        this.$parent.createCtrlline(this)
      }

    }
  }
}
</script>
