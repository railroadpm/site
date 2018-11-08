<template>
  <div>
    <v-btn class="rr-show-graph-btn" outline color="accent" @click="$emit('show-graph')" :disabled="selectedRailroads.length < 1">
      <v-icon>bar_chart</v-icon>
      Show Graph
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    selectedRailroads: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.rr-show-graph-btn {
  margin-left: 0;
}
</style>
