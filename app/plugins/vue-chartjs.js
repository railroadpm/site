import Vue from 'vue';
import { Line } from 'vue-chartjs';

Vue.component('line-graph', {
  extends: Line,
  props: ['data', 'options'],
  mounted() {
    let baseChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1200
      },
      responsiveAnimationDuration: 400
    };

    this.renderChart(this.data, {
      ...baseChartOptions,
      ...this.options
    });
  }
});
