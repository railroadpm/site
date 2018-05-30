import app from '@/app.config';

export const state = () => ({
  railroadProfileData: {
    common: {
      verbiage: ''
    },
    railroads: []
  }
})

export const getters = {
  railroadProfileDataUrl: () => {
    console.log('STORE: In Getter "railroadProfileDataUrl"');
    return `${app.API_HOST}/railroads/all${app.API_GET_SUFFIX}`;
  },

  railroadLogoUrlByKey: (state, getters) => (key) => {
    console.log('STORE: In Getter "railroadLogoUrlByKey"');
    let profile = getters.railroadProfileByKey(key);
    return profile ? `${app.API_HOST}${profile.Logo}` : '';
  },

  railroadProfileByKey: (state) => (key) => {
    console.log('STORE: In Getter "railroadProfileByKey"');
    return state.railroadProfileData.railroads.find(r => r.Key === key);
  }
}

export const mutations = {
  setRailroadProfileData(state, payload) {
    console.log('STORE: In Mutation "setRailroadProfileData"');

    state.railroadProfileData.common.verbiage = payload.common.verbiage;
    state.railroadProfileData.railroads = payload.railroads;
  }
}

export const actions = {
  async getRailroadProfileData({
    getters,
    commit,
    state
  }) {
    console.log(`STORE: In Action "getRailroadProfileData"...`);

    // Nothing to do if we already have the profile data
    if (state.railroadProfileData.railroads.length > 0) {
      console.log(`STORE: ...nothing to do in "getRailroadProfileData"`);
      return;
    }

    try {
      console.log('STORE: Getting railroad profile data...');
      const response = await this.$axios.$get(getters.railroadProfileDataUrl);
      console.log(`STORE: Got railroad profile data from ${getters.railroadProfileDataUrl}`);

      commit('setRailroadProfileData', response.data);
    } catch (e) {
      console.log('STORE: Error getting railroad profile data:', e);
    }
  }
}
