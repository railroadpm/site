<template>
  <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="blue lighten-2">
        <v-tooltip bottom>
          <v-btn slot="activator" icon dark color="orange lighten-1" @click.native="$emit('close')">
            <v-icon>close</v-icon>
          </v-btn>
          <span>Close and Return to Report</span>
        </v-tooltip>
        <v-toolbar-title>Railroads Graph</v-toolbar-title>
      </v-toolbar>
      <div class="graph-popup-body">
        <div class="graph-popup-headings">
          <h2>{{ mainHeading }}</h2>
          <h3 v-html="subHeading"></h3>
        </div>
        <line-graph v-if="show" css-classes="quick-line-graph" :data="lineGraphData" :options="lineGraphOptions" />
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

  data: () => ({}),

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
    xAxisLabels() {
      // All of the rows have the same "xAxisLabels", so just grab from rows[0]
      return _(this.rows[0])
        .keys()
        .filter(val => !isNaN(val)) // Take only the numeric keys
        .map(val => DateTime.fromISO(val).toLocaleString()) // YYYYMMDD -> M/D/YYYY
        .value();
    },
    datasets() {
      return _(this.rows)
        .map((val, index) => ({
          label: val.RowLabel.replace(/&nbsp;/g, ''),
          fill: false,
          data: this.rowData(index),
          borderColor: this.$helpers.colorFromIndex(index),
          pointRadius: 7,
          pointStyle: this.$helpers.pointStyleFromIndex(index)
        }))
        .value();
    },
    lineGraphOptions() {
      // Capture ("close over") things we'll need in callbacks below
      let helpers = this.$helpers;
      let datasetLabels = _(this.rows)
        .map(val => val.RowLabel.replace(/&nbsp;/g, ''))
        .value();

      return {
        scales: {
          yAxes: [
            {
              ticks: {
                // Format the numbers with thousands separators
                callback: (value, index, values) => helpers.formatNumber(value)
              }
            }
          ]
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: (tooltipItems, data) => `${datasetLabels[tooltipItems.datasetIndex]}: ${helpers.formatNumber(tooltipItems.yLabel)}`
          }
        }
      };
    },
    lineGraphData() {
      return {
        labels: this.xAxisLabels,
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
    }
  }
};
</script>

<style>
/* .dialog--fullscreen {
  overflow-y: hidden !important;
} */

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
