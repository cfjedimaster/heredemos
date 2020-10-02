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
    saveFeature(state, f) {
      state.features.forEach(i => {
        if(i.id === f.id) {
          i = f;
        }
      });
    },
    setFeatures(state, features) {
      // moved the jsonprint stuff here
      features.forEach(f => {
        f.properties = JSON.stringify(f.properties, '', '\t');
        f.geometry = JSON.stringify(f.geometry, '', '\t');
      });
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
    },
    async saveFeature(context, params) {
      console.log('store action to save feature called');
      //return to JSON
      //clone first
      let f = { ...params.feature};
      f.properties = JSON.parse(params.feature.properties);
      f.geometry = JSON.parse(params.feature.geometry);
      await datahub.saveFeature(params.space.id, f, context.state.token);
      //update feature
      context.commit('saveFeature', f);
    }
  },
  modules: {
  }
})
