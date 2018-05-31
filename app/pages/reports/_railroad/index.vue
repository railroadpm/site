<template>
  <v-layout>
    <v-flex>
      <v-progress-circular v-if="!dataLoaded" :size="50" :width="7" indeterminate color="blue lighten-4" class="rpt-progress" />

      <div v-show="dataLoaded">
        <img class="prpt-logo" :src="railroadLogoURL" alt="">
        <br>

        <h2>{{ railroadShortName }} - Weekly Performance Report</h2>
        <vue-markdown class="prpt-verbiage" :source="railroadVerbiage" :breaks="false" />

        <v-tabs v-model="selectedTab" dark color="blue lighten-2" slider-color="blue darken-4" grow>
          <v-tab>Current Trends</v-tab>
          <v-tab>53 Week History</v-tab>
          <v-tab-item>
            <tabular-report :railroad="selectedRailroadKey" report-type="Current" />
          </v-tab-item>
          <v-tab-item>
            <tabular-report :railroad="selectedRailroadKey" report-type="Historical" />
          </v-tab-item>
        </v-tabs>

        <hr>
        <v-footer height="auto" class="white pt-3 px-3">
          <v-layout row wrap>
            <vue-markdown v-if="selectedRailroadKey != 'AOR'" class="prpt-understand-measures" :source="railroadUnderstandingMeasures" :breaks="false" />
            <vue-markdown class="prpt-copyright" :source="railroadCopyright" :breaks="false" />
          </v-layout>
        </v-footer>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex';
import TabularReport from '~/components/TabularReport.vue';

export default {
  components: {
    TabularReport
  },

  data: () => ({
    selectedTab: '0'
  }),

  created() {
    console.log(`PAGE: Created reports page for ${this.selectedRailroadKey}`);
    this.loadRailroadProfileData();
  },

  mounted() {
    console.log(`PAGE: Mounted reports page for ${this.selectedRailroadKey}`);
  },

  computed: {
    selectedReportType() {
      switch (this.selectedTab) {
        case '0':
          return 'Current';
        case '1':
          return 'Historical';
        default:
          return '';
      }
    },
    dataLoaded() {
      return this.$store.state.railroadReportData[this.selectedRailroadKey][this.selectedReportType].rows.length > 0;
    },
    selectedRailroadKey() {
      return this.$route.params.railroad.toUpperCase();
    },
    railroadVerbiage() {
      return this.$store.state.railroadProfileData.common.Verbiage;
    },
    railroadUnderstandingMeasures() {
      return this.$store.state.railroadProfileData.common.UnderstandingMeasures;
    },
    railroadProfile() {
      return this.$store.getters.railroadProfileByKey(this.selectedRailroadKey);
    },
    railroadLogoURL() {
      return this.$store.getters.railroadLogoUrlByKey(this.selectedRailroadKey);
    },
    railroadShortName() {
      return this.railroadProfile.ShortName || '';
    },
    railroadCopyright() {
      return this.railroadProfile.Copyright || '';
    }
  },

  methods: {
    ...mapActions(['loadRailroadProfileData'])
  }
};
</script>

<style scoped>
/* Blend the participant (prpt) logo white background into the underlying page */
.prpt-logo {
  mix-blend-mode: multiply;
}

.prpt-verbiage {
  font-size: 12px;
}

.prpt-copyright,
.prpt-understand-measures {
  font-size: 11px;
}

.prpt-understand-measures {
  color: red;
}

.rpt-progress {
  position: relative;
  left: calc(50% - 25px);
  top: 35vh;
}
</style>
