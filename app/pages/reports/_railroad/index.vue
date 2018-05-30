<template>
  <v-layout>
    <v-flex>
      <div v-show="railroadProfile">
        <img class="prpt-logo" :src="railroadLogoURL" alt="">
        <br>

        <h2>{{ railroadShortName }} - Weekly Performance Report</h2>
        <vue-markdown class="prpt-verbiage" :source="railroadVerbiage" :breaks="false" />

        <v-tabs dark color="blue lighten-2" slider-color="blue darken-4" grow>
          <v-tab>Current Trends</v-tab>
          <v-tab>53 Week History</v-tab>
          <v-tab-item>
            <tabular-report :railroad="selectedRailroadKey" report-type="Current" />
          </v-tab-item>
          <v-tab-item>
            <tabular-report :railroad="selectedRailroadKey" report-type="Historical" />
          </v-tab-item>
        </v-tabs>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import TabularReport from '~/components/TabularReport.vue';

export default {
  components: {
    TabularReport
  },

  created() {
    console.log(`PAGE: Created reports page for ${this.selectedRailroadKey}`);
    this.$store.dispatch('getRailroadProfileData');
  },

  mounted() {
    console.log(`PAGE: Mounted reports page for ${this.selectedRailroadKey}`);
  },

  computed: {
    selectedRailroadKey() {
      return this.$route.params.railroad.toUpperCase();
    },

    railroadProfile() {
      return this.$store.getters.railroadProfileByKey(this.selectedRailroadKey);
    },

    railroadVerbiage() {
      return this.$store.state.railroadProfileData.common.verbiage;
    },

    railroadLogoURL() {
      return this.$store.getters.railroadLogoUrlByKey(this.selectedRailroadKey);
    },

    railroadShortName() {
      return this.railroadProfile ? this.railroadProfile.ShortName : '';
    }
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
</style>
