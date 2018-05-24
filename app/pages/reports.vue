<template>
  <v-layout>
    <v-flex>
      <img class="prpt-logo" :src="railroadLogoURL" alt="">
      <br>
      <br>
      <vue-markdown :source="railroadVerbiage" :html="true" :breaks="false" />
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
    selectedRailroad: 'BNSF',
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
      if (!this.railroads || this.railroads.length === 0) return '';
      return `${app.API_HOST}${this.railroads.find(r => r.Key === this.selectedRailroad).Logo}`;
    }
  },

  methods: {
    async getRailroads() {
      try {
        console.log('Getting railroads...');
        const response = await this.$axios.$get(this.rrDataUrl);
        console.log(`Got railroads from ${this.rrDataUrl}`);

        this.railroadVerbiage = response.data.common.verbiage;
        console.log(`Verbiage=${this.railroadVerbiage}`);
        this.railroads = response.data.railroads;
      } catch (e) {
        this.railroadVerbiage = '';
        this.railroads = [];
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
</style>
