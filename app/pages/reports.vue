<template>
  <v-layout>
    <v-flex>
      <img class="prpt-logo" src="https://api.rrpm.run/asset/bnsf_railway.jpg" alt="">
      <br>
      <tabular-report entity-base-url="/reports/bnsf" entity-result-cols-key="columns" entity-result-rows-key="rows" />
    </v-flex>
  </v-layout>
</template>

<script>
import TabularReport from '~/components/TabularReport.vue';

export default {
  components: {
    TabularReport
  },

  data: () => ({}),

  created() {
    console.log('Created reports page');
  },

  mounted() {
    console.log('Mounted reports page');
  }
};
</script>

<style scoped>
/* Blend the participant (prpt) logo white background into the underlying page */
.prpt-logo {
  mix-blend-mode: multiply;
}
</style>
