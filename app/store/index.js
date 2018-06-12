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
  },
  dimension: {
    keys: {
      Period: {
        Previous: {
          Quarter: '',
          Month: ''
        }
      },
      CarsOnLine: [],
      TrainSpeed: [],
      TerminalDwell: {
        BNSF: [],
        CN: [],
        KCS: [],
        NS: [],
        UP: []
      }
    }
  }
});

export const getters = {
  // region Profile Data Getters
  railroadProfileDataUrl: () => `${app.API_HOST}/railroads/all${app.API_GET_SUFFIX}`,

  railroadLogoUrlByKey: (state, getters) => key => {
    console.log('STORE: In Getter "railroadLogoUrlByKey"');
    let profile = getters.railroadProfileByKey(key);
    return profile && profile.Logo ? `${app.API_HOST}${profile.Logo}` : '';
  },

  railroadProfilesCount: state => state.railroadProfileData.railroads.length,
  railroadProfileByKey: state => key => state.railroadProfileData.railroads.find(r => r.Key === key) || {},
  // endregion

  // region Report Data Getters
  railroadReportDataUrlByKeyAndType: () => (key, type) => `${app.API_HOST}/reports/${key.toLowerCase()}/${type === 'Current' ? 'current' : 'all'}${app.API_GET_SUFFIX}`,
  railroadReportRowCountByKeyAndType: state => (key, type) => state.railroadReportData[key][type].rows.length,
  railroadHistoricalReportRowByKeys: state => (railroadKey, measureKey) =>
    state.railroadReportData[railroadKey]['Historical'].rows.filter(row => row.key === measureKey)[0] || {},
  // endregion

  // region Dimension Data Getters
  periodPreviousQuarter: state => state.dimension.keys.Period.Previous.Quarter,
  periodPreviousMonth: state => state.dimension.keys.Period.Previous.Month
  // endregion
};

export const mutations = {
  storeRailroadProfileData(state, payload) {
    console.log('STORE: In Mutation "storeRailroadProfileData"');

    state.railroadProfileData.common.Verbiage = payload.common.Verbiage;
    state.railroadProfileData.common.UnderstandingMeasures = payload.common.UnderstandingMeasures;
    state.railroadProfileData.railroads = payload.railroads;
  },

  storeRailroadReportData(state, payload) {
    console.log(`STORE: In Mutation "storeRailroadReportData" for ${payload.key}`);

    storeDimensionKeysFromReportRows(state, payload);

    state.railroadReportData[payload.key][payload.type].rows = payload.data.rows;
    state.railroadReportData[payload.key][payload.type].columns = payload.data.columns;
  }
};

// region Mutation Helpers
/**
 * Return true if the dimension keys have been loaded for the given railroad, false otherwise
 * @param {object} state
 * @param {string} railroadKey
 */
function dimensionKeysLoaded(state, railroadKey) {
  let rptKeysLoaded = false;
  let periodKeysLoaded = false;

  if (railroadKey != 'AOR') rptKeysLoaded = state.dimension.keys.TerminalDwell[railroadKey].length > 0;
  else rptKeysLoaded = state.dimension.keys.TrainSpeed.length > 0;

  periodKeysLoaded = !!state.dimension.keys.Period.Previous.Month;

  return rptKeysLoaded && periodKeysLoaded;
}

/**
 * Distill categorical dimension keys from report data
 * @param {object} state
 * @param {object} payload
 */
function storeDimensionKeysFromReportRows(state, payload) {
  console.log('STORE: In Mutation Helper "storeDimensionKeysFromReportRows"');

  // Nothing for us to do in certain cases (already have the distilled data, etc.)
  if (payload.type != 'Current') return;
  if (dimensionKeysLoaded(state, payload.key)) return;

  // The report rows fall into 3 main "segments" for which we want the dimension keys (except percentages),
  // but "CarsOnLine" has two sub-segments, so really 4 in all
  let segmentKeys = ['CarsOnLine', 'CarsOnLine', 'TrainSpeed', 'TerminalDwell'];
  let segmentIndex = -1;
  let prevRowWasHeading = false;
  try {
    payload.data.rows.forEach(row => {
      let isHeadingRow = !!row.isHeadingRow;
      let isPct = !!row.isPct;
      if (prevRowWasHeading && !isHeadingRow) segmentIndex++; // After header(s), we know we're in a new segment
      if (!isHeadingRow && !isPct) {
        if (segmentKeys[segmentIndex] === 'TerminalDwell') state.dimension.keys.TerminalDwell[payload.key].push(row.key);
        else state.dimension.keys[segmentKeys[segmentIndex]].push(row.key);
      }
      prevRowWasHeading = isHeadingRow;
    });

    // We also want to store some of the Period keys
    state.dimension.keys.Period.Previous.Quarter = payload.data.avgColumns[0].key;
    state.dimension.keys.Period.Previous.Month = payload.data.avgColumns[1].key;

    console.log(`STORE: Stored dimension keys for ${payload.key}`);
  } catch (e) {
    console.log(`STORE: Error storing dimension keys for ${payload.key}.`, e);
  }
}
// endregion

export const actions = {
  async loadRailroadProfileData({ getters, commit, state }) {
    console.log('STORE: In Action "loadRailroadProfileData"...');

    // Nothing to do if we already have the profile data
    if (getters.railroadProfilesCount > 0) {
      console.log('STORE: ...nothing to do in "loadRailroadProfileData"');
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

  async loadRailroadReportDataByKeyAndType({ getters, commit, state }, { key, type }) {
    console.log(`STORE: In Action "loadRailroadReportDataByKeyAndType" for ${key}, type ${type}...`);

    // Nothing to do if we already have the report data for the specified railroad and type
    if (getters.railroadReportRowCountByKeyAndType(key, type) > 0) {
      console.log(`STORE: ...nothing to do in "loadRailroadReportDataByKeyAndType" for ${key}, type ${type}`);
      return;
    }

    try {
      const response = await this.$axios.$get(getters.railroadReportDataUrlByKeyAndType(key, type));
      commit('storeRailroadReportData', { key, type, data: response.data });

      console.log(`STORE: Got and stored railroad report data for ${key}, type ${type}`);
    } catch (e) {
      console.log('STORE: Error getting railroad profile data:', e);
    }
  }
};
