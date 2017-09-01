import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const state = {
  status: null,
  isDragging: null,
  isMirror:false,
  preventEvent: null,
}

export const mutations = {
  CHANGE_STATUS(state, status){
    state.status = status
  },
  CHANG_DRAGGING(state, isDragging){
    state.isDragging = isDragging
  },
  CHANGE_PREVENT_EVENT(state, preventEvent){
    state.preventEvent = preventEvent
  },
  CHANGE_MIRROR(state, isMirror){
    state.isMirror = isMirror
  }
}

export const actions = {
  changeStatus({ state, commit, dispatch }, status){
    commit('CHANGE_STATUS', status)
    return status
  },
  changeDragging({ state, commit, dispatch }, isDragging){
    commit('CHANG_DRAGGING', isDragging)
    return isDragging
  },
  changePreventEvent({ state, commit, dispatch }, preventEvent){
    commit('CHANGE_PREVENT_EVENT', preventEvent)
    return preventEvent
  },
  changeMirror({ state, commit, dispatch }, isMirror){
    commit('CHANGE_MIRROR', isMirror)
    return isMirror
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
})
