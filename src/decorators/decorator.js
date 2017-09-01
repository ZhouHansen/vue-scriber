import $ from 'jquery'

export const movable = function(target, supercanvas) {
  target.on("pressmove", function(evt) {
    if (supercanvas.$store.state.status !== 'move'){
      return
    }

    var x = evt.stageX - target.model.x
      , y = evt.stageY - target.model.y

    supercanvas.changeContainer({x, y})
  })
}

export const cursurable = function(target, supercanvas) {
  target.on("mouseover", function() {
    if (supercanvas.$store.state.status === 'move'){
      $("#canvas").addClass("move")
    }

    if (supercanvas.$store.state.status === 'remove'){
      $("#canvas").addClass("remove")
    }

    if (supercanvas.$store.state.status === 'line' && !target.model.iscurrent) {
      $("#canvas").addClass("unable")
    }

    if (supercanvas.$store.state.status === 'ctrlline' && !target.model.iscurrent) {
      $("#canvas").addClass("ctrlline")
    }
  })

  target.on("mouseout", function(){
    $("#canvas").removeClass("remove unable ctrlline move")
  })
}

export const removable = function(target, supercanvas) {
  target.on("mousedown", function(){
    if (supercanvas.$store.state.status === 'remove'){
      supercanvas.removeModel(target)
    }
  })
}

export const ctrlRemovable = function(target, supercanvas) {
  target.on("mousedown", function(){
    if (supercanvas.$store.state.status === 'remove'){
      supercanvas.removeCtrl(target.model)
    }
  })

  target.on("mouseover", function() {
    if (supercanvas.$store.state.status === 'remove'){
      $("#canvas").addClass("remove")
    }
  })

  target.on("mouseout", function(){
    $("#canvas").removeClass("remove")
  })
}

export const ctrlable = function(target, supercanvas) {
  target.on("click", function(){
    supercanvas.$store.dispatch('changePreventEvent', true)

    if (supercanvas.$store.state.status === 'ctrlline'){
      supercanvas.changeCurrent(target)
    }
  })

  target.on("pressmove", function(e) {
    supercanvas.$store.dispatch('changePreventEvent', true)

    if (target.model.iscurrent && supercanvas.$store.state.status === 'ctrlline') {
      supercanvas.$store.dispatch('changeMirror', true)

      var x = e.stageX - supercanvas.containerp.x
        , y = e.stageY - supercanvas.containerp.y

      supercanvas.mirrorCtrlline({x,y})
    }
  })

  target.on("pressup", function() {
    supercanvas.$store.dispatch('changeMirror', false)
    supercanvas.$store.dispatch('changeDragging', false)
  })

}

export const draggable = (function(){
  var innerfunc = function({target, supercanvas, e}){
    supercanvas.$store.dispatch("changePreventEvent", true)

    if (target.model.iscurrent &&
      supercanvas.$store.state.status === 'line' &&
      !supercanvas.$store.state.isMirror) {
      var x = e.stageX - supercanvas.container.x
        , y = e.stageY - supercanvas.container.y

      supercanvas.basicCtrlline({
        model: target.model,
        ctrlline: {
          x,
          y,
          isMirror: false,
          hide: false,
        }
      })
    }
  }

  return function(target, supercanvas){
    target.on("mousedown", function(e) {
      innerfunc({target, supercanvas, e})
    })

    target.on("pressmove", function(e) {
      innerfunc({target, supercanvas, e})
    })

    target.on("pressup", function(){
      supercanvas.$store.dispatch("changePreventEvent", false)
      supercanvas.$store.dispatch("changeDragging", false)
    })
  }
})()
