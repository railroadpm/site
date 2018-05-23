<template>
  <v-layout>
    <v-flex>
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
