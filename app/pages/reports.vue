<template>
  <v-layout>
    <v-flex>
      <simple-tabular-data entity-base-url="/reports/bnsf" entity-result-cols-key="columns" entity-result-rows-key="rows" />
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
