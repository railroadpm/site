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
        <h2>Coming Soon... Quick Graph</h2>
        {{ railroad }}&nbsp;{{ dimensionKey }}

        <line-graph v-if="show" css-classes="quick-line-graph" :data="lineData" :options="graphOptions" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash';

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
    labels() {
      return _.filter(Object.keys(this.rows[0]), val => !isNaN(val));
    },
    datasetData() {
      return Object.values(_.pickBy(this.rows[1], (val, key) => !isNaN(key)));
    },
    datasets() {
      // TODO: Build array of objects with label and data
      // for each original row given to us in props, and then get
      // rid of "datasetData"
      return [
        {
          label: 'Foreign RR',
          fill: false,
          data: this.datasetData
        }
      ];
    },
    lineData() {
      return {
        labels: this.labels,
        datasets: this.datasets
      };
    }
  }
};
</script>

<style>
.graph-popup-body {
  margin: 10px;
}

.quick-line-graph {
  margin: 30px 5px 0 50px;
  height: 80vh !important;
  width: 95% !important;
}
</style>
