<template>
  <v-layout>
    <v-flex>
      <simple-tabular-data entity-base-url="/reports/BNSF/current" entity-result-data-key="reports" />
    </v-flex>
  </v-layout>
</template>

<script>
import SimpleTabularData from '~/components/SimpleTabularData.vue';

export default {
  components: {
    SimpleTabularData
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
