import app from '@/app.config';

export const state = () => ({
  railroadProfileData: {
    common: {
      Verbiage: '',
      UnderstandingMeasures: ''
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

  railroadProfilesCount: (state) => {
    console.log('STORE: In Getter "railroadProfilesCount"');
    return state.railroadProfileData.railroads.length;
  },

  railroadProfileByKey: (state) => (key) => {
    console.log('STORE: In Getter "railroadProfileByKey"');
    return state.railroadProfileData.railroads.find(r => r.Key === key) || {};
  }
}

export const mutations = {
  storeRailroadProfileData(state, payload) {
    console.log('STORE: In Mutation "storeRailroadProfileData"');

    state.railroadProfileData.common.Verbiage = payload.common.Verbiage;
    state.railroadProfileData.common.UnderstandingMeasures = payload.common.UnderstandingMeasures;
    state.railroadProfileData.railroads = payload.railroads;
  }
}

export const actions = {
  async loadRailroadProfileData({
    getters,
    commit,
    state
  }) {
    console.log(`STORE: In Action "loadRailroadProfileData"...`);

    // Nothing to do if we already have the profile data
    if (getters.railroadProfilesCount > 0) {
      console.log(`STORE: ...nothing to do in "loadRailroadProfileData"`);
      return;
    }

    try {
      const response = await this.$axios.$get(getters.railroadProfileDataUrl);
      commit('storeRailroadProfileData', response.data);

      console.log(`STORE: Got and stored railroad profile data from ${getters.railroadProfileDataUrl}`);
    } catch (e) {
      console.log('STORE: Error getting railroad profile data:', e);
    }
  }
}
