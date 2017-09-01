import _ from 'underscore'
import {
  movable,
  cursurable,
  removable,
  ctrlable,
  draggable,
  ctrlRemovable,
} from '../decorators/decorator.js'

function drawcurve(g, x2, y2, lastmodel, model) {

  if (lastmodel.ctrlline && (!model.ctrlline || (model.ctrlline && !model.ctrlline.isMirror))) {
    g.quadraticCurveTo(lastmodel.ctrlline.x, lastmodel.ctrlline.y, x2, y2)
  } else if (!lastmodel.ctrlline && model.ctrlline && model.ctrlline.isMirror) {
    g.quadraticCurveTo(model.ctrlline.x, model.ctrlline.y, x2, y2)
  } else if (lastmodel.ctrlline && model.ctrlline && model.ctrlline.isMirror) {
    g.bezierCurveTo(lastmodel.ctrlline.x, lastmodel.ctrlline.y, model.ctrlline.x, model.ctrlline.y, x2, y2);
  } else {
    g.lineTo(x2, y2)
  }
}

export default {
  methods:{
    drawCircle({x, y, uniqueId, iscurrent}, model){
      var circle = new createjs.Shape()

      circle.graphics.setStrokeStyle(1).beginStroke("#000000")

      if (iscurrent) {
        circle.graphics.beginFill("#000")
      } else {
        circle.graphics.beginFill("#fff")
      }

      circle.graphics.drawCircle(0, 0, 3)

      circle.x = x
      circle.y = y
      circle.uniqueId = uniqueId
      circle.model = model
      circle.name = "circle"

      movable(circle, this)
      cursurable(circle, this)
      removable(circle, this)
      ctrlable(circle, this)
      draggable(circle, this)

      this.container.addChild(circle)

      this.stage.update()
    },
    drawLine(model, lastmodel){
      var line = new createjs.Shape()

      line.graphics.setStrokeStyle(1)
      line.graphics.beginStroke("#000")
      line.graphics.moveTo(model.x, model.y)
      drawcurve(line.graphics, lastmodel.x, lastmodel.y, lastmodel, model)
      line.graphics.lineTo(lastmodel.x, lastmodel.y)
      line.uniqueIds = [lastmodel.uniqueId, model.uniqueId]
      line.models = [lastmodel, model]
      line.time = 0
      line.name = "line"

      this.container.addChildAt(line, 0)
      this.stage.update()

      return line
    },
    changeLine(model){

      var lines = _.filter(this.container.children, function(inner){
        if (inner.name === "line"){
          if (_.contains(inner.uniqueIds, model.uniqueId)){
            return true
          }
        }
      })

      _.each(lines, line=>{
        var x1 = line.models[0].x
          , y1 = line.models[0].y
          , x2 = line.models[1].x
          , y2 = line.models[1].y

        if (line.time === 0) {
          line.graphics.clear()
          line.time++
        }

        line.time--
        line.graphics.setStrokeStyle(1)
        line.graphics.beginStroke("#000")
        line.graphics.moveTo(x1, y1)

        if (model.uniqueId === line.models[0].uniqueId) {
          console.log(model.uniqueId)
          drawcurve(line.graphics, x2, y2, model, line.models[1])
        } else {
          drawcurve(line.graphics, x2, y2, line.models[0], model)
        }

        this.stage.update()
      })
    },
    drawCurrent(iscurrent, uniqueId){
      var target = _.findWhere(this.container.children, {uniqueId,name:"circle"})
        , color = iscurrent ? "#000" : "#fff"

      target.graphics.beginFill(color).drawCircle(0, 0, 3)
      this.stage.update()
    },
    simpleremove(target){
      var targets = _.filter(this.container.children, function(inner){
        var isLine = _.contains(inner.uniqueIds, target.uniqueId)
          , isCtrl = (inner.uniqueId === target.uniqueId)&& (inner.name === "square"|| inner.name === "ctrlline")

        if (isLine|| isCtrl){
          return true
        }
      })

      this.container.removeChild(target)

      _.each(targets, inner=>{
        this.container.removeChild(inner)
      })

      this.stage.update()
    },
    drawSquare(x, y, uniqueId, model, isMirror){
      var square = new createjs.Shape()

      square.graphics.setStrokeStyle(1).beginStroke("#f46c51").beginFill("#f46c51").drawRect(-2, -2, 4, 4)

      if (!isMirror) {
        square.x = x
        square.y = y
      } else {
        square.x = 2 * model.x - x
        square.y = 2 * model.y - y
      }
      square.uniqueId = uniqueId
      square.model = model
      square.isMirror = isMirror
      square.name = "square"
      ctrlRemovable(square, this)
      if (model.ctrlline.hide){
        square.graphics.clear()
      }

      this.container.addChild(square)

      this.stage.update()

      return square
    },
    changeSquare(model){
      var squares = _.where(this.container.children,{
        uniqueId:model.uniqueId,
        name:"square"
      })

      _.each(squares, square=>{

        if (_.isEmpty(model.ctrlline)){
          this.container.removeChild(square)
        } else if (model.ctrlline.hide === false){

          square.graphics.setStrokeStyle(1).beginStroke("#f46c51").beginFill("#f46c51").drawRect(-2, -2, 4, 4)

          if (!square.isMirror){
            square.x = model.ctrlline.x
            square.y = model.ctrlline.y
          } else {
            square.x = 2 * model.x - model.ctrlline.x
            square.y = 2 * model.y - model.ctrlline.y
          }
        } else {
          square.graphics.clear()
        }

        this.stage.update()

      })
    },
    drawCtrlline(x1, y1, x2, y2, uniqueId, model, isMirror){
      var line = new createjs.Shape()

      line.graphics.setStrokeStyle(1)
      line.graphics.beginStroke("#f46c51")

      if (!isMirror) {
        line.graphics.moveTo(x1, y1)
        line.graphics.lineTo(x2, y2)
      } else {
        line.graphics.moveTo(x1, y1)
        line.graphics.lineTo(2 * x1 - x2, 2 * y1 - y2)
      }

      line.uniqueId = uniqueId
      line.model = model
      line.time = 0
      line.isMirror = isMirror
      line.name = "ctrlline"

      if (model.ctrlline.hide){
        line.graphics.clear()
      }

      this.container.addChildAt(line, 0)

      this.stage.update()

      return line
    },
    changeCtrlline(model){
      var ctrllines = _.where(this.container.children,{
        uniqueId:model.uniqueId,
        name:"ctrlline"
      })

      _.each(ctrllines, ctrlline=>{

        if (_.isEmpty(model.ctrlline)) {
          this.container.removeChild(ctrlline)
        } else if (model.ctrlline.hide === false){
          if (ctrlline.time == 0){
            ctrlline.graphics.clear()
            ctrlline.time++
          }

          ctrlline.time--
          ctrlline.graphics.setStrokeStyle(1)
          ctrlline.graphics.beginStroke("#f46c51")

          if (!ctrlline.isMirror) {
            ctrlline.graphics.moveTo(model.x, model.y)
            ctrlline.graphics.lineTo(model.ctrlline.x, model.ctrlline.y)
          } else {
            ctrlline.graphics.moveTo(model.x, model.y)
            ctrlline.graphics.lineTo(2 * model.x - model.ctrlline.x, 2 * model.y - model.ctrlline.y)
          }
        } else {
          ctrlline.graphics.clear()
        }

        this.stage.update()

      })
    },
    createCtrlline(model){
      var x = model.ctrlline.x
        , y = model.ctrlline.y
        , x2 = model.x
        , y2 = model.y
        , uniqueId = model.uniqueId
        , isMirror = model.ctrlline.isMirror

      this.drawSquare(x, y, uniqueId, model, false)
      this.drawCtrlline(x2, y2, x, y, uniqueId, model, false)

      if (isMirror){

        this.drawSquare(x, y, uniqueId, model, true)
        this.drawCtrlline(x2, y2, x, y, uniqueId, model, true)
      }
    }
  }
}
