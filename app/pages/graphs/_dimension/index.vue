<template>
  <v-layout>
    <v-flex>
      <v-progress-circular v-if="!dataLoaded" :size="50" :width="7" indeterminate color="blue lighten-4" class="page-progress" />

      <transition name="fade" appear>
        <div v-show="dataLoaded">
          <h2 v-html="heading" />
          <br>
          <h4 class="grey--text text--darken-1">
            Click (tap) to select the railroad(s) to be included in the graph, and then click "Show Graph". Click the heading to toggle all railroads.
          </h4>
          <br>
          <railroads-table :dimension-key="dimensionKey" />
          <br>
          <v-btn class="rr-show-graph-btn" outline color="orange lighten-1" dark @click="showMsg('Railroad Graphs Coming Soon!')">Show Graph</v-btn>
        </div>
      </transition>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex';
import RailroadsTable from '~/components/RailroadsTable.vue';
import _ from 'lodash';

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
      return _(this.$helpers.categoricalDimensionSegments)
        .filter(segment => segment.key === this.dimensionKey)
        .first();
    },
    heading() {
      return `Graph - ${this.dimensionData.label}`;
    }
  },

  methods: {
    showMsg(msg) {
      alert(msg);
    },

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

.rr-show-graph-btn {
  margin-left: 0;
}
</style>
