<template>
  <v-menu :close-on-click="false" :close-on-content-click="false" v-model="showMenu" top right offset-y offset-x>
    <v-btn small outline slot="activator" color="orange lighten-1" dark @click="showMenu = !showMenu">Quick Graph</v-btn>
    <v-card width="425">
      <v-card-text>
        <p>Click on the rows in the report to select them for inclusion in a graph, and then click a "Graph" button below.</p>
        You can also start over by clicking "Remove All Selections".
      </v-card-text>
      <v-list dense subheader>
        <v-divider></v-divider>
        <v-list-tile v-for="btn in graphBtns" :key="btn.label">
          <v-list-tile-content>
            <v-btn block small outline :color="btn.color" flat @click="closeMenu($event, btn.dimensionKey)" :disabled="btn.disabled">
              <v-icon>bar_chart</v-icon>
              {{ btn.label }}
            </v-btn>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile>
          <v-list-tile-content>
            <v-btn block small outline flat @click="">Remove All Selections</v-btn>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {
    selectedMeasures: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    showMenu: false
  }),

  computed: {
    graphBtns() {
      return [
        {
          color: 'blue lighten-2',
          dimensionKey: 'carsOnLine',
          label: `Graph - Cars On Line (${this.carsCount} Measure(s) Selected)`,
          disabled: this.carsCount < 1
        },
        {
          color: 'green lighten-2',
          dimensionKey: 'trainSpeed',
          label: `Graph - Train Speed (${this.trainCount} Measure(s) Selected)`,
          disabled: this.trainCount < 1
        },
        {
          color: 'red lighten-2',
          dimensionKey: 'terminalDwell',
          label: `Graph - Terminal Dwell (${this.terminalCount} Measure(s) Selected)`,
          disabled: this.terminalCount < 1
        }
      ];
    },
    carsCount() {
      return this.selectedMeasures.filter(measure => this.$store.state.dimension.keys.carsOnLine.includes(measure.key)).length;
    },
    trainCount() {
      return 0;
    },
    terminalCount() {
      return 0;
    }
  },

  methods: {
    closeMenu(event, dimensionKey) {
      this.showMenu = false;
      this.$nextTick(() => this.showMsg(`Graphs Coming Soon! dimension=${dimensionKey}`));
    },

    showMsg(msg) {
      alert(msg);
    }
  }
};
</script>

<style scoped>
</style>
