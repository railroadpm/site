<template>
  <v-layout>
    <v-flex>
      <div v-show="railroadProfile">
        <img class="prpt-logo" :src="railroadLogoURL" alt="">
        <br>

        <h2>{{ railroadShortName }} - Weekly Performance Report</h2>
        <vue-markdown class="prpt-verbiage" :source="railroadVerbiage" :breaks="false" />

        <v-tabs v-model="activeTab" dark color="blue lighten-2" slider-color="blue darken-4" grow>
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
    activeTab: '0'
  }),

  created() {
    console.log(`PAGE: Created reports page for ${this.selectedRailroadKey}`);
    this.loadRailroadProfileData();
  },

  mounted() {
    console.log(`PAGE: Mounted reports page for ${this.selectedRailroadKey}`);
  },

  computed: {
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
</style>
