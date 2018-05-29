import app from '@/app.config';

export const state = () => ({
  counter: 0,

  railroadProfileData: {
    common: {
      verbiage: ''
    },
    railroads: []
  }
})

export const getters = {
  railroadProfileDataUrl: (state, getters) => {
    console.log('STORE: Computing railroads data url');
    return `${app.API_HOST}/railroads/all${app.API_GET_SUFFIX}`;
  }
}

export const mutations = {
  increment(state) {
    state.counter++
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

      // this.railroadVerbiage = response.data.common.verbiage;
      // this.railroads = response.data.railroads;
      // this.selectedRailroad = this.railroads.find(r => r.Key === this.$route.params.railroad.toUpperCase());
    } catch (e) {
      // this.railroadVerbiage = '';
      // this.railroads = [];
      // this.selectedRailroad = null;
      console.log('STORE: Error getting railroad profile data:', e);
    }


    commit('increment');
  }
}
