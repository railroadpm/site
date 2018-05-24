<template>
  <v-layout>
    <v-flex>
      <img class="prpt-logo" :src="railroadLogoURL" alt="">

      <br><br>
      <v-card width="800px" :flat="true">
        <v-card-title class="headline">{{ railroadShortName }} - Weekly Performance Report</v-card-title>
        <v-card-text>
          <vue-markdown class="prpt-verbiage" :source="railroadVerbiage" :breaks="false" />
        </v-card-text>
      </v-card>
      <br>

      <tabular-report entity-base-url="/reports/bnsf" entity-result-cols-key="columns" entity-result-rows-key="rows" />
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
        this.selectedRailroad = this.railroads.find(r => r.Key === 'BNSF');
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
