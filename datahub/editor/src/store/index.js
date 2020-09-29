import Vue from 'vue'
import Vuex from 'vuex'

import datahub from '../api/datahub';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:null,
    spaces:[],
    features:null
  },
  getters: {
    accessToken(state) {
      let existing = localStorage.getItem('token');
      if(existing) state.token = existing;
      return state.token;
    }
  },
  mutations: {
    setAccessToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    setFeatures(state, features) {
      state.features = features;
    },
    setSpaces(state, space) {
      state.spaces = space;
    }
  },
  actions: {
    async loadSpace(context, params) {
      console.log('loadSpace', params);
      context.commit('setFeatures', await datahub.loadSpace(params.space.id, context.state.token));
    },
    async loadSpaces(context) {
      context.commit('setSpaces', await datahub.loadSpaces(context.state.token));
    }
  },
  modules: {
  }
})
