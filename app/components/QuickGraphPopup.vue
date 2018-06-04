<template>
  <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="blue darken-3">
        <v-btn icon dark @click.native="$emit('close')">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Quick Graph</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div class="graph-popup-body">
        <h2>Coming Soon... Quick Graph</h2>
        {{ railroad }}&nbsp;{{ dimensionKey }}

        <line-graph css-classes="quick-line-graph" :data="lineData" :options="graphOptions" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
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
    }
  },

  data: () => ({
    lineData: {
      labels: ['20180406', '20180413', '20180420', '20180427'],
      datasets: [
        {
          label: 'System',
          data: [64515, 63612, 63500, 62565]
        }
      ]
    },
    graphOptions: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
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
