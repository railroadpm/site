import app from '@/app.config';

export const state = () => ({
  railroadProfileData: {
    common: {
      Verbiage: '',
      UnderstandingMeasures: ''
    },
    railroads: []
  },
  railroadReportData: {
    BNSF: {
      Current: {
        rows: [],
        columns: []
      },
      Historical: {
        rows: [],
        columns: []
      }
    },
    CN: {
      Current: {
        rows: [],
        columns: []
      },
      Historical: {
        rows: [],
        columns: []
      }
    },
    KCS: {
      Current: {
        rows: [],
        columns: []
      },
      Historical: {
        rows: [],
        columns: []
      }
    },
    NS: {
      Current: {
        rows: [],
        columns: []
      },
      Historical: {
        rows: [],
        columns: []
      }
    },
    UP: {
      Current: {
        rows: [],
        columns: []
      },
      Historical: {
        rows: [],
        columns: []
      }
    },
    AOR: {
      Current: {
        rows: [],
        columns: []
      },
      Historical: {
        rows: [],
        columns: []
      }
    }
  }
})

export const getters = {
  // region Profile Data Getters
  railroadProfileDataUrl: () => `${app.API_HOST}/railroads/all${app.API_GET_SUFFIX}`,

  railroadLogoUrlByKey: (state, getters) => (key) => {
    console.log('STORE: In Getter "railroadLogoUrlByKey"');
    let profile = getters.railroadProfileByKey(key);
    return profile ? `${app.API_HOST}${profile.Logo}` : '';
  },

  railroadProfilesCount: (state) => state.railroadProfileData.railroads.length,
  railroadProfileByKey: (state) => (key) => state.railroadProfileData.railroads.find(r => r.Key === key) || {},
  // endregion

  // region Report Data Getters
  railroadReportDataUrlByKeyAndType: () => (key, type) => `${app.API_HOST}/reports/${key.toLowerCase()}/${type === 'Current' ? 'current' : 'all'}${app.API_GET_SUFFIX}`,
  railroadReportRowCountByKeyAndType: (state) => (key, type) => state.railroadReportData[key][type].rows.length
  // endregion
}

export const mutations = {
  storeRailroadProfileData(state, payload) {
    console.log('STORE: In Mutation "storeRailroadProfileData"');

    state.railroadProfileData.common.Verbiage = payload.common.Verbiage;
    state.railroadProfileData.common.UnderstandingMeasures = payload.common.UnderstandingMeasures;
    state.railroadProfileData.railroads = payload.railroads;
  },

  storeRailroadReportData(state, payload) {
    console.log(`STORE: In Mutation "storeRailroadReportData" for ${payload.key}`);

    state.railroadReportData[payload.key].Current.rows = payload.currentData.rows;
    state.railroadReportData[payload.key].Current.columns = payload.currentData.columns;

    state.railroadReportData[payload.key].Historical.rows = payload.historicalData.rows;
    state.railroadReportData[payload.key].Historical.columns = payload.historicalData.columns;
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
  },

  async loadRailroadReportDataByKey({
    getters,
    commit,
    state
  }, key) {
    console.log(`STORE: In Action "loadRailroadReportDataByKey" for ${key}...`);

    // Nothing to do if we already have the report data for the specified railroad
    if (getters.railroadReportRowCountByKeyAndType(key, 'Historical') > 0) {
      console.log(`STORE: ...nothing to do in "loadRailroadReportDataByKey" for ${key}`);
      return;
    }

    try {
      const current = await this.$axios.$get(getters.railroadReportDataUrlByKeyAndType(key, 'Current'));
      const historical = await this.$axios.$get(getters.railroadReportDataUrlByKeyAndType(key, 'Historical'));
      commit('storeRailroadReportData', {
        key,
        currentData: current.data,
        historicalData: historical.data
      });

      console.log(`STORE: Got and stored railroad report data for ${key}`);
    } catch (e) {
      console.log('STORE: Error getting railroad profile data:', e);
    }
  }
}
