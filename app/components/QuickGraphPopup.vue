<template>
  <v-dialog v-model="show" width="800px" transition="v-dialog-transition">
    <v-card>
      <v-card-title class="grey lighten-4 py-4 title">
        Quick Graph
      </v-card-title>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-flex xs12>

            <h2>Coming Soon... Quick Graph</h2>
            {{ railroad }}&nbsp;{{ dimensionKey }}

            <line-graph :height="400" :width="700" :data="lineData" :options="graphOptions" />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="$emit('close')">Close</v-btn>
      </v-card-actions>
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
    lineData: [],
    graphOptions: {
      responsive: true
      // maintainAspectRatio: false
    }
  })
};
</script>

<style scoped>
</style>
