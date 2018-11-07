<template>
  <v-layout row>
    <v-flex xs12>
      <v-progress-circular v-if="!reportRendered" :size="50" :width="7" indeterminate color="blue lighten-4" class="page-progress" />

      <div v-show="reportRendered && selectedRailroadKey != 'AOR'">
        <img class="prpt-logo" :src="railroadLogoURL" alt="">
        <br>
      </div>

      <transition name="fade" appear>
        <div v-show="reportRendered">
          <h2>{{ railroadShortName }} - Weekly Performance Report</h2>
          <vue-markdown class="prpt-verbiage" :source="railroadVerbiage" :breaks="false" />

          <v-tabs v-model="selectedTab" dark color="secondary" slider-color="accent-dark" grow class="rpm-tabs" ref="rptTabs">
            <v-tab href="#tab-current">Current Trends</v-tab>
            <v-tab href="#tab-historical">53-Week History</v-tab>
            <v-tab-item value="tab-current">
              <tabular-report :railroad="selectedRailroadKey" report-type="Current" @rendered="onTableRendered" />
            </v-tab-item>
            <v-tab-item value="tab-historical">
              <tabular-report :railroad="selectedRailroadKey" report-type="Historical" @rendered="onTableRendered" />
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
    selectedTab: '',
    tableRendered: false,
    tabAnimationDelay: 600
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
    reportRendered() {
      // The report as a whole is considered "rendered" when, via API, we have loaded the railroad profiles, the TabularReport
      //component has loaded the railroad report data, and has also indicated that rendering is complete
      return (
        this.$store.state.railroadProfileData.railroads.length > 0 &&
        this.$store.state.railroadReportData[this.selectedRailroadKey][this.selectedReportType].rows.length > 0 &&
        this.tableRendered
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
    onTableRendered() {
      this.tableRendered = true;

      // Downloading the report data and rendering it can interfere with the timing of the tab "slider" animation, so we
      // wait on the table to be rendered and then respond by forcing the animation. Note that the "updateTabsView()" method
      // is not documented by Vuetify and therefore subject to change
      setTimeout(() => this.$refs.rptTabs.updateTabsView(), this.tabAnimationDelay);
    },

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
