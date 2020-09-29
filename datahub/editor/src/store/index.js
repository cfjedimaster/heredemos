import Vue from 'vue'
import Vuex from 'vuex'

import datahub from '../api/datahub';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:null,
    spaces:null
  },
  getters: {
    accessToken(state) {
      let existing = localStorage.getItem('token');
      if(existing) state.token = existing;
      return state.token;
    }
  },
  mutations: {
  },
  actions: {
    setAccessToken(context, token) {
      context.token = token;
      localStorage.setItem('token', token);
    },
    async loadSpaces(context) {
    console.log(context.state);
      context.state.spaces = await datahub.loadSpaces(context.state.token);
    }
  },
  modules: {
  }
})
