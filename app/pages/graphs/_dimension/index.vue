<template>
  <v-layout>
    <v-flex>
      <v-progress-circular v-if="!dataLoaded" :size="50" :width="7" indeterminate color="blue lighten-4" class="page-progress" />

      <transition name="fade" appear>
        <div v-show="dataLoaded">
          <h2>{{ dimensionHeading }}</h2>
          <h4>Select the railroads to be included in the graph and click "Show Graph"</h4>
          <br>
          <railroads-table :dimension-key="dimensionKey" />
          <br>
          <v-btn>Show Graph</v-btn>
        </div>
      </transition>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex';
import RailroadsTable from '~/components/RailroadsTable.vue';

export default {
  components: {
    RailroadsTable
  },

  data: () => ({}),

  created() {
    console.log(`PAGE: Created graphs page for ${this.dimensionKey}`);
    this.loadRailroadProfileData();
  },

  mounted() {
    console.log(`PAGE: Mounted graphs page for ${this.dimensionKey}`);
  },

  computed: {
    dimensionKey() {
      return this.$route.params.dimension;
    },
    dataLoaded() {
      return this.$store.state.railroadProfileData.railroads.length > 0;
    },
    dimensionData() {
      return this.$helpers.categoricalDimensionSegments.filter(segment => segment.key === this.dimensionKey);
    },
    dimensionHeading() {
      return this.dimensionData.label;
    }
  },

  methods: {
    ...mapActions(['loadRailroadProfileData'])
  }
};
</script>

<style scoped>
.page-progress {
  position: relative;
  left: calc(50% - 25px);
  top: 35vh;
}
</style>
