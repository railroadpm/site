<template>
  <v-menu :close-on-click="false" :close-on-content-click="false" v-model="showMenu" top right offset-y offset-x>
    <v-btn small outline slot="activator" color="accent" dark @click="showMenu = !showMenu">Quick Graph</v-btn>
    <v-card v-if="showMenu" width="450">
      <v-container class="graph-menu-help">
        <v-layout>
          <v-flex xs1>
            <v-icon color="accent">help_outline</v-icon>
          </v-flex>
          <v-flex xs11>
            Click (tap) on data rows in the report (except percentages) to select them for inclusion in a graph, and then click a "Graph" button
            below. Click a main heading to toggle all data rows thereunder. Start over by clicking "Remove All Selections".
          </v-flex>
        </v-layout>
      </v-container>
      <v-list dense subheader>
        <v-divider></v-divider>
        <v-list-tile v-for="btn in graphBtns" :key="btn.label">
          <v-list-tile-content>
            <v-btn block small outline :color="btn.color" flat @click="graphBtnClick($event, btn.key)" :disabled="btn.disabled">
              <v-icon>bar_chart</v-icon>
              {{ btn.label }}
            </v-btn>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile>
          <v-list-tile-content>
            <v-btn block small outline flat @click="$emit('remove-all')" :disabled="selectedMeasures.length < 1">Remove All Selections</v-btn>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import _ from 'lodash';

export default {
  props: {
    railroad: {
      type: String,
      required: true
    },
    selectedMeasures: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    showMenu: false
  }),

  computed: {
    /** Use the helper array containing details of the 3 main segments to generate the Graph Btn data needed to render the menu */
    graphBtns() {
      return _(this.$helpers.categoricalDimensionSegments)
        .map((val, index) => ({
          color: val.materialColor,
          key: val.key,
          label: `Graph - ${val.label} (${this.selectedMeasuresCountBySegment(val.key)} Measure(s) Selected)`,
          disabled: this.selectedMeasuresCountBySegment(val.key) < 1
        }))
        .filter(val => !(this.railroad === 'AOR' && val.key === 'TerminalDwell'))
        .value();
    },
    selectedReportTab() {
      // "Subscribe" to the state of the report tabs and keep a watch below
      return this.$store.state.ui.reports.selectedTab;
    }
  },

  watch: {
    selectedReportTab(newValue, oldValue) {
      // This menu must be closed when we note a switch to a different report tab to avoid the confusion
      // of potentially multiple menus open and acting on different reports
      if (newValue != oldValue) this.showMenu = false;
    }
  },

  methods: {
    graphBtnClick(event, dimensionKey) {
      this.showMenu = false;
      this.$emit('show-graph', dimensionKey);
    },

    selectedMeasuresCountBySegment(segmentKey) {
      if (segmentKey === 'TerminalDwell') {
        if (this.railroad === 'AOR') return 0;
        return this.selectedMeasures.filter(measure => this.$store.state.dimension.keys.TerminalDwell[this.railroad].includes(measure.key)).length;
      } else {
        return this.selectedMeasures.filter(measure => this.$store.state.dimension.keys[segmentKey].includes(measure.key)).length;
      }
    }
  }
};
</script>

<style scoped>
.graph-menu-help {
  margin: -3px 0 -5px 0;
}
</style>
