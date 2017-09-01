import _ from 'underscore'
import async from 'async'

export default {
  methods:{
    fetchModels(models){
      if (models.length === 0){
        return
      }

      var addPoint = setInterval(()=>{
        var model = models.shift()

        this.addPoint({
          model,
          fetch: true,
          models: this.models
        })

        if (models.length === 0){
          clearInterval(addPoint)
        }
      },0.001)
    },
    addPoint({model, fetch, models}){
      delete model.uniqueId

      if (!fetch&& models.length > 0){
        var currentmodel = _.findWhere(models, {'iscurrent': true})

        currentmodel.iscurrent = false
      }

      model.uniqueId = _.uniqueId()
      models.push(model)
    },

    changeContainer({x, y}){
      this.containerp.x = x
      this.containerp.y = y
    },

    removeModel(target){
      this.removedtarget = target
    },

    changeCurrent(target){
      var currentmodel = _.findWhere(this.models, {'iscurrent': true})

      currentmodel.iscurrent = false
      target.model.iscurrent = true
    },

    mirrorCtrlline({x, y}){
      var model = _.findWhere(this.models, {
        iscurrent: true
      })
        , ctrlline = {
          x,
          y,
          isMirror: true,
          hide: false,
        }

      model.ctrlline = ctrlline
      this.hideCtrl()
    },

    basicCtrlline({model, ctrlline}){
      model.ctrlline = ctrlline
      this.hideCtrl()
    },

    removeCtrl(model){
      var model = _.findWhere(this.models, {uniqueId: model.uniqueId})
      model.ctrlline = void 0
    },

    hideCtrl(){
      var model = _.filter(this.models, function(inner){
        if (inner.ctrlline){
          return inner.iscurrent === false && inner.ctrlline.hide === false
        } else {
          return false
        }
      })[0]

      if (model !== void 0) {
        var ctrlline = _.clone(model.ctrlline)

        ctrlline.hide = true

        model.ctrlline = ctrlline
      }
    },

    clearModels(){
      this.models = []
    },

  }
}
