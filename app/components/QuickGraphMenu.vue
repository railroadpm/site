<template>
  <v-menu :close-on-content-click="false" :nudge-width="200" v-model="showMenu" offset-x>
    <v-btn small outline slot="activator" color="orange lighten-1" dark>Quick Graph</v-btn>
    <v-card>
      <v-list>
        <v-list-tile>
          <v-list-tile-content>
            <span class="text-sm-left">
              Click on the rows in the report to select them for inclusion in a graph.<br>And then click a button below.
            </span>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile v-for="btn in graphBtns" :key="btn.label">
          <v-list-tile-content>
            <v-btn block small outline :color="btn.color" flat @click="closeMenu" :disabled="btn.disabled">
              <v-icon>bar_chart</v-icon>
              {{ btn.label }}
            </v-btn>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {
    carsCount: {
      type: Number,
      required: true
    },

    trainCount: {
      type: Number,
      required: true
    },

    terminalCount: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    showMenu: false
  }),

  computed: {
    graphBtns() {
      return [
        { color: 'blue lighten-2', label: `Graph - Cars On Line (${this.carsCount} Measure(s) Selected)`, disabled: this.carsCount < 1 },
        { color: 'green lighten-2', label: `Graph - Train Speed (${this.trainCount} Measure(s) Selected)`, disabled: this.trainCount < 1 },
        { color: 'red lighten-2', label: `Graph - Terminal Dwell (${this.terminalCount} Measure(s) Selected)`, disabled: this.terminalCount < 1 }
      ];
    }
  },

  methods: {
    closeMenu() {
      this.showMenu = false;
      this.$nextTick(() => this.showMsg('Graphs Coming Soon!'));
    },

    showMsg(msg) {
      alert(msg);
    }
  }
};
</script>

<style scoped>
</style>
