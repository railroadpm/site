<template>
  <v-layout>
    <v-flex>
      <div>
        <h2>Coming Soon...</h2>
        <p>{{ selectedDimensionKey }} Graph</p>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({}),

  created() {
    console.log(`PAGE: Created graphs page for ${this.selectedDimensionKey}`);
  },

  mounted() {
    console.log(`PAGE: Mounted reports page for ${this.selectedDimensionKey}`);
  },

  computed: {
    selectedDimensionKey() {
      return this.$route.params.dimension;
    }
  }
};
</script>

<style scoped>
</style>
