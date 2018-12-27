<template>
  <v-layout row justify-center>
    <v-flex xs12 lg10 class="py-3">
      <v-card class="elevation-2">
        <v-card-title class="headline">Welcome to the Railroad Performance Measures Website</v-card-title>
        <v-card-text>
          <blockquote class="blockquote mb-4 font-weight-regular">
            Here, five major North American freight railroads have voluntarily reported three weekly performance
            measures — Cars
            On Line, Train
            Speed, and Terminal Dwell — since 1999, in a commitment to improve communications with their customers.
          </blockquote>

          <p>
            All five railroads use the same definitions to calculate their performance data, ensuring a high degree of
            consistency of the measurements.
            However, these measures are most useful for examining trends and relative changes, and least useful as
            absolutes.
          </p>

          <p>
            The level of one railroad’s performance relative to another’s may differ sharply because each railroad is
            unique.
            Differences between
            railroads include terrain, physical routes and network design, traffic mix and volume, the extent of
            passenger
            operations,
            and operational practices. External factors such as weather and port operations can also cause variations
            between
            railroads
            and over time. In addition, individual differences in the collection and reporting of operational data may
            affect the
            absolute
            level of the measures on each road to some degree.
          </p>

          <p>
            Please refer to the
            <nuxt-link to="/definitions">Definitions</nuxt-link> page for an explanation of the measures.
          </p>

          <blockquote class="blockquote mb-4 font-weight-regular accent-dark--text">
            Railroad Performance Measures are published every Wednesday at 2:00 p.m. Eastern Time.
          </blockquote>

          <hr class="my-3">

          <p class="text-xs-right">
            <v-icon>bug_report</v-icon>
            Find a bug? Report it on the GitHub
            <a href="https://github.com/railroadpm/site/issues" target="_blank">issue board</a>.
          </p>
          <p class="text-xs-right caption font-weight-thin">
            RPM App v{{ solutionVersion }}
          </p>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import * as solutionPkg from '~/../package.json';

export default {
  data: () => ({
    solutionVersion: solutionPkg.version
  })
};
</script>
