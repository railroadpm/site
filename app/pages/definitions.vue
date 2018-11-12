<template>
  <v-layout row justify-center>
    <v-flex xs12 lg10 class="py-3">
      <v-card class="elevation-2">
        <v-card-title class="headline">General Definitions For Measurements</v-card-title>
        <v-card-text>
          <p class="title accent-dark--text">Cars On Line</p>
          <p>
            Cars On Line is the average of the daily on-line inventory of freight cars. Articulated cars are counted as
            a single unit. Cars on private tracks (e.g., at a
            customer's facility) are counted on the last railroad on which they were located. Maintenance of way cars
            are excluded.
          </p>
          <p>Cars on Line figures are reported by car type for the following car types:</p>

          <v-data-table class="dfn-table px-4" :items="carsOnLine.type.rows" hide-actions hide-headers>
            <template slot="items" slot-scope="row">
              <tr>
                <td v-for="(col, i) in row.item.values" :key="`col${i}`">
                  <span :class="{ 'dfn-heading-row': row.item.id === 0 }">{{ row.item.values[i] }}</span>
                </td>
              </tr>
            </template>
          </v-data-table>

          <br>and by car ownership:<br>
          <br>

          <v-data-table class="dfn-table px-4" :items="carsOnLine.owner.rows" hide-actions hide-headers>
            <template slot="items" slot-scope="row">
              <tr>
                <td v-for="(col, i) in row.item.values" :key="`col${i}`">
                  <span :class="{ 'dfn-heading-row': row.item.id === 0 }">{{ row.item.values[i] }}</span>
                </td>
              </tr>
            </template>
          </v-data-table>

          <br>

          <p class="title accent-dark--text">Train Speed</p>
          <p>
            Train Speed measures the line-haul movement between terminals. The average speed is calculated by dividing
            train-miles by total hours operated, excluding yard
            and local trains, passenger trains, maintenance of way trains, and terminal time. System-wide average train
            speeds are given for the following train types:
          </p>

          <ul style="margin-left: 30px">
            <li>Intermodal</li>
            <li>Manifest&nbsp;</li>
            <li>Multilevel&nbsp;</li>
            <li>Coal Unit&nbsp;</li>
            <li>Grain Unit</li>
            <li>All trains</li>
          </ul>

          <br>
          <p class="title accent-dark--text">Terminal Dwell (Hours)</p>
          <p>
            Terminal Dwell is the average time a car resides at the specified terminal location expressed in hours. The
            measurement begins with a customer release,
            received interchange, or train arrival event and ends with a customer placement (actual or constructive),
            delivered or offered in interchange, or train
            departure event. Cars that move through a terminal on a run-through train are excluded, as are stored, bad
            ordered, and maintenance of way cars.
          </p>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    carsOnLine: {
      type: {
        rows: [
          { id: 0, values: ['Car Type', 'AAR Mechanical Designation'] },
          { id: 1, values: ['Box', 'A, B or R'] },
          { id: 2, values: ['Covered Hopper', 'C'] },
          { id: 3, values: ['Gondola', 'E or G'] },
          { id: 4, values: ['Intermodal', 'P, Q or S'] },
          { id: 5, values: ['Multilevel', 'V'] },
          { id: 6, values: ['Open Hopper', 'H, J or K'] },
          { id: 7, values: ['Tank', 'T'] },
          { id: 8, values: ['Other', 'L or F'] }
        ]
      },
      owner: {
        rows: [
          { id: 0, values: ['Owner Type', 'Description'] },
          { id: 1, values: ['System Car', 'Owned by the railroad on which it is located'] },
          { id: 2, values: ['Foreign RR', 'Owned by a railroad other than the one on which it is located'] },
          { id: 3, values: ['Private', 'Owned by a non-railroad (i.e., has a car initial that ends in "X") and not leased to a railroad'] }
        ]
      }
    }
  })
};
</script>

<style>
/* Eliminate table row hover */
.dfn-table table.v-table tbody tr:hover {
  background: white !important;
}

/* Heading rows styled differently */
.dfn-heading-row {
  font-weight: bold;
  font-size: 14px;
}
</style>
