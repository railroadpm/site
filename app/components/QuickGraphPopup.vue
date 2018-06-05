<template>
  <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="blue lighten-2">
        <v-toolbar-title>Quick Graph</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click.native="$emit('close')">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="graph-popup-body">
        <div class="graph-popup-headings">
          <h2>{{ mainHeading }}</h2>
          <h3 v-html="subHeading"></h3>
        </div>
        <line-graph v-if="show" css-classes="quick-line-graph" :data="lineData" :options="graphOptions" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import { DateTime } from 'luxon';

export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    railroad: {
      type: String,
      required: true
    },
    dimensionKey: {
      type: String,
      required: true
    },
    rows: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    graphOptions: {}
  }),

  mounted() {
    // ESC to tell outer page/component to close the popup
    document.body.addEventListener('keyup', e => {
      if (e.keyCode === 27) {
        this.$emit('close');
      }
    });
  },

  computed: {
    railroadProfile() {
      return this.$store.getters.railroadProfileByKey(this.railroad);
    },
    mainHeading() {
      return this.railroadProfile.ShortName;
    },
    subHeading() {
      switch (this.dimensionKey) {
        case 'CarsOnLine':
          return '<span class="blue--text text--darken-1">Cars On Line<span>';
        case 'TrainSpeed':
          return '<span class="green--text text--darken-1">Train Speed (Miles per Hour)<span>';
        case 'TerminalDwell':
          return '<span class="red--text text--darken-1">Terminal Dwell (Hours)<span>';
        default:
          return '';
      }
    },
    labels() {
      // All of the rows have the same "labels", so just grab from rows[0]
      return _(this.rows[0])
        .keys()
        .filter(val => !isNaN(val)) // Take only the numeric keys
        .map(val => DateTime.fromISO(val).toLocaleString())
        .value();
    },
    datasets() {
      return _(this.rows)
        .map((val, index) => ({
          label: val.RowLabel.replace(/&nbsp;/g, ''),
          fill: false,
          data: this.rowData(index),
          borderColor: this.colorFromIndex(index),
          pointRadius: 7,
          pointStyle: Math.abs(index % 2) ? 'triangle' : 'rect'
        }))
        .value();
    },
    lineData() {
      return {
        labels: this.labels,
        datasets: this.datasets
      };
    }
  },

  methods: {
    rowData(index) {
      return _(this.rows[index])
        .pickBy((val, key) => !isNaN(key))
        .values()
        .value();
    },
    colorFromIndex(index) {
      // See: https://vuetifyjs.com/en/style/colors
      // "darken-4" for: Blue, Teal, Lime, Orange, Blue-Grey, Red, Deep-Purple, Light-Blue, Green, Yellow, Pink, Brown, Grey, Deep-Orange, Light-Green
      let colors = [
        '#0D47A1',
        '#004D40',
        '#827717',
        '#E65100',
        '#263238',
        '#B71C1C',
        '#311B92',
        '#01579B',
        '#1B5E20',
        '#F57F17',
        '#880E4F',
        '#3E2723',
        '#212121',
        '#BF360C',
        '#33691E'
      ];
      return colors[index];
    }
  }
};
</script>

<style>
.dialog--fullscreen {
  overflow-y: hidden !important;
}

.graph-popup-body {
  margin: 10px;
}

.graph-popup-headings {
  margin: 15px 0 -5px 20px;
}

.quick-line-graph {
  margin: 30px 5px 0 50px;
  height: 80vh !important;
  width: 95% !important;
}
</style>
