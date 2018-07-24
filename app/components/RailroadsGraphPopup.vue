<template>
  <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="secondary">
        <v-tooltip bottom>
          <v-btn slot="activator" icon dark color="accent" @click.native="$emit('close')">
            <v-icon>close</v-icon>
          </v-btn>
          <span>Close and Return to Railroads List (Esc)</span>
        </v-tooltip>
        <v-toolbar-title>Railroads Graph</v-toolbar-title>
      </v-toolbar>

      <div class="rr-graph-popup-body">
        <div class="rr-graph-popup-headings">
          <h2 v-html="mainHeading"></h2>
        </div>
        <line-graph v-if="show" css-classes="rr-line-graph" :data="lineGraphData" :options="lineGraphOptions" />
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
    railroads: {
      type: Array,
      required: true
    },
    // AKA the "Segment" key here
    dimensionKey: {
      type: String,
      required: true
    }
  },

  data: () => ({
    segmentMetadata: {
      CarsOnLine: {
        heading: '<span class="blue--text text--darken-1">Cars On Line<span>',
        graphMeasureKey: 'ByCarOwnerTotal'
      },
      TrainSpeed: {
        heading: '<span class="green--text text--darken-1">Train Speed (Miles per Hour)<span>',
        graphMeasureKey: 'AllTrains'
      },
      TerminalDwell: {
        heading: '<span class="red--text text--darken-1">Terminal Dwell (Hours)<span>',
        graphMeasureKey: 'EntireRailroad'
      }
    }
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
    mainHeading() {
      return this.segmentMetadata[this.dimensionKey].heading;
    },
    graphMeasureKey() {
      return this.segmentMetadata[this.dimensionKey].graphMeasureKey;
    },
    // True when the railroad report data has been loaded via API for all railroads passed in props, false otherwise
    dataLoaded() {
      return !_(this.railroads)
        .map(rr => this.$store.getters.railroadReportRowCountByKeyAndType(rr.key, 'Historical'))
        .some(count => count < 1);
    },
    rows() {
      if (!this.dataLoaded) return [];

      return _(this.railroads)
        .map(rr => ({
          ...this.$store.getters.railroadHistoricalReportRowByKeys(rr.key, this.graphMeasureKey),
          ...{ rowLabel: rr.rowLabel } // Label the data by the Railroad instead of the measure
        }))
        .value();
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
          label: val.rowLabel.replace(/&nbsp;/g, ''),
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
        .map(val => val.rowLabel.replace(/&nbsp;/g, ''))
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

.rr-graph-popup-body {
  margin: 10px;
}

.rr-graph-popup-headings {
  margin: 15px 0 -5px 20px;
}

.rr-line-graph {
  margin: 30px 5px 0 50px;
  height: 80vh !important;
  width: 95% !important;
}
</style>
