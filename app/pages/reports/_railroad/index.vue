<template>
  <v-layout>
    <v-flex>
      <div v-show="selectedRailroad">
        <img class="prpt-logo" :src="railroadLogoURL" alt="">
        <br>

        <h2>{{ railroadShortName }} - Weekly Performance Report</h2>
        <vue-markdown class="prpt-verbiage" :source="railroadVerbiage" :breaks="false" />

        <v-tabs dark color="blue lighten-2" slider-color="blue darken-4" grow>
          <v-tab>Current Trends</v-tab>
          <v-tab>53 Week History</v-tab>
          <v-tab-item>
            <tabular-report :entity-base-url="`/reports/${this.$route.params.railroad.toLowerCase()}`" />
          </v-tab-item>
          <v-tab-item>
            <tabular-report :entity-base-url="`/reports/${this.$route.params.railroad.toLowerCase()}`" />
          </v-tab-item>
        </v-tabs>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import app from '@/app.config';
import TabularReport from '~/components/TabularReport.vue';

export default {
  components: {
    TabularReport
  },

  data: () => ({
    selectedRailroad: null,
    railroadVerbiage: '',
    railroads: []
  }),

  created() {
    console.log('Created reports page');
    this.getRailroads();
  },

  mounted() {
    console.log('Mounted reports page');
  },

  computed: {
    rrDataUrl() {
      return `${app.API_HOST}/railroads/all${app.API_GET_SUFFIX}`;
    },
    railroadLogoURL() {
      return this.selectedRailroad ? `${app.API_HOST}${this.selectedRailroad.Logo}` : '';
    },
    railroadShortName() {
      return this.selectedRailroad ? this.selectedRailroad.ShortName : '';
    }
  },

  methods: {
    async getRailroads() {
      try {
        console.log('Getting railroads...');
        const response = await this.$axios.$get(this.rrDataUrl);
        console.log(`Got railroads from ${this.rrDataUrl}`);

        this.railroadVerbiage = response.data.common.verbiage;
        this.railroads = response.data.railroads;
        this.selectedRailroad = this.railroads.find(r => r.Key === this.$route.params.railroad);
      } catch (e) {
        this.railroadVerbiage = '';
        this.railroads = [];
        this.selectedRailroad = null;
        console.log('Error getting railroads:', e);
      }
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
