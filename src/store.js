import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/* eslint-disable no-console */
export default new Vuex.Store({
  state: {
    selectionRect: {},
    selectionDistance: {}
  },
  getters: {
    selectionStyle (state) {
      // 選択範囲のドラッグ中の場合はそれを加算する
      return {
        top: `${state.selectionRect.top + (state.selectionDistance.dy || 0)}px`,
        left: `${state.selectionRect.left  + (state.selectionDistance.dx || 0)}px`,
        width: `${state.selectionRect.width}px`,
        height: `${state.selectionRect.height}px`
      }
    }
  },
  mutations: {
    setSelection (state, rect) {
      state.selectionRect = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
    },
    moveSelection (state, rect) {
      state.selectionDistance = {
        dx: rect.dx,
        dy: rect.dy
      }
    },
    resetSelection (state) {
      state.selectionDistance = {}
    }
  },
  actions: {
    setSelection ({ commit }, rect) {
      commit('setSelection', rect)
    },
    moveSelection ({ commit }, rect) {
      commit('moveSelection', rect)
    },
    resetSelection ({ commit }) {
      commit('resetSelection')
    },
  }
})
