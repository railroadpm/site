<template>
  <v-layout>
    <v-flex>
      <v-progress-circular v-if="!dataLoaded" :size="50" :width="7" indeterminate color="blue lighten-4" class="page-progress" />

      <div v-show="dataLoaded">
        <img class="prpt-logo" :src="railroadLogoURL" alt="">
        <br>
      </div>

      <transition name="fade" appear>
        <div v-show="dataLoaded">
          <h2>{{ railroadShortName }} - Weekly Performance Report</h2>
          <vue-markdown class="prpt-verbiage" :source="railroadVerbiage" :breaks="false" />

          <v-tabs v-model="selectedTab" dark color="secondary" slider-color="accent-dark" grow>
            <v-tab href="#tab-current">Current Trends</v-tab>
            <v-tab href="#tab-historical">53 Week History</v-tab>
            <v-tab-item value="tab-current">
              <tabular-report :railroad="selectedRailroadKey" report-type="Current" />
            </v-tab-item>
            <v-tab-item value="tab-historical">
              <tabular-report :railroad="selectedRailroadKey" report-type="Historical" />
            </v-tab-item>
          </v-tabs>

          <hr>
          <v-footer height="auto" class="white pt-3 px-3">
            <v-layout row wrap>
              <template v-if="selectedRailroadKey != 'AOR'">
                <vue-markdown class="prpt-understand-measures" :source="railroadUnderstandingMeasures" :breaks="false" />
                <div class="rpt-pg-legend">
                  <span>R = Revised Figure(s) reported for this week</span><br>
                  <span>- = Not Available</span>
                </div>
              </template>
              <vue-markdown class="prpt-copyright" :source="railroadCopyright" :breaks="false" />
            </v-layout>
          </v-footer>
        </div>
      </transition>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import TabularReport from '~/components/TabularReport.vue';

export default {
  components: {
    TabularReport
  },

  data: () => ({
    selectedTab: ''
  }),

  async created() {
    console.log(`PAGE: Created reports page for ${this.selectedRailroadKey}`);
    this.selectedTab = 'tab-current';
    await this.loadRailroadProfileData();
  },

  mounted() {
    console.log(`PAGE: Mounted reports page for ${this.selectedRailroadKey}`);
  },

  computed: {
    selectedReportType() {
      switch (this.selectedTab) {
        case 'tab-current':
          return 'Current';
        case 'tab-historical':
          return 'Historical';
        default:
          return '';
      }
    },
    dataLoaded() {
      // Data is considered "loaded" when, via API, we have loaded the railroad profiles and the
      // TabularReport component has loaded the railroad report data
      return (
        this.$store.state.railroadProfileData.railroads.length > 0 &&
        this.$store.state.railroadReportData[this.selectedRailroadKey][this.selectedReportType].rows.length > 0
      );
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

  watch: {
    selectedTab(newValue, oldValue) {
      // We make the selected tab info available in the store so other components (e.g., QuickGraphMenu)
      // have the ability to react to changes
      this.publishSelectedTab(newValue);
    }
  },

  methods: {
    ...mapMutations(['publishSelectedTab']),
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
.prpt-understand-measures,
.rpt-pg-legend {
  font-size: 11px;
}

.prpt-copyright {
  margin: 0 0 -17px 0;
}

.prpt-understand-measures {
  color: red;
  margin: -10px 0 -10px 0;
}

.rpt-pg-legend {
  width: 100%;
  margin-bottom: 5px;
}

.page-progress {
  position: relative;
  left: calc(50% - 25px);
  top: 35vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
