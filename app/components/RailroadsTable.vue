<template>
  <div v-show="dataLoaded">
    <v-data-table v-model="selected" :items="rows" item-key="key" hide-actions hide-headers>
      <template slot="items" slot-scope="row">
        <!-- Allow clicking anywhere on a (non-Heading) row to select it for inclusion in a "Railroads Graph" -->
        <tr :active="row.selected" @click="rowClick(row)">
          <!-- Render the row label cell -->
          <td class="rr-label">
            <span :class="{ 'rr-heading-row': row.item.isHeadingRow }">
              <v-icon class="rr-selected-row-icon" v-show="row.selected" color="orange lighten-1">insert_chart_outlined</v-icon>
              <vue-markdown class="rr-label-md" :source="row.item['RowLabel']" />
            </span>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- <railroads-graph-popup v-if="railroadsGraphShowPopup" :show="railroadsGraphShowPopup" :rows="selectedRailroads(railroadsGraphDimensionKey)"
      @close="railroadsGraphShowPopup = false" /> -->
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import _ from 'lodash';
// import RailroadsGraphPopup from '~/components/RailroadsGraphPopup.vue';

export default {
  props: {
    dimensionKey: {
      type: String,
      required: true
    }
  },

  // components: {
  //   RailroadsGraphPopup
  // },

  data: () => ({
    rows: [],
    selected: [],

    railroadsGraphShowPopup: false
  }),

  created() {
    console.log(`COMPONENT: Created <RailroadsTable> component for "${this.dimensionKey}"`);
    this.getRows();
  },

  mounted() {
    console.log(`COMPONENT: Mounted <RailroadsTable> component for "${this.dimensionKey}"`);
  },

  computed: {
    railroadProfiles() {
      return this.$store.state.railroadProfileData.railroads;
    },
    // True when the railroad profile data has been loaded via API, false otherwise
    dataLoaded() {
      return this.railroadProfiles.length > 0;
    }
  },

  methods: {
    getRows() {
      this.rows = _(this.railroadProfiles)
        .map(rr => ({
          RowLabel: `&nbsp;&nbsp;${rr.Key != 'AOR' ? rr.Key : rr.ShortName}`,
          key: rr.Key,
          isHeadingRow: false
        }))
        .unshift({
          RowLabel: 'Railroads',
          key: 'Participant',
          isHeadingRow: true
        })
        .value();
    },

    rowClick(row) {
      let isHeadingRow = !!row.item.isHeadingRow;
      let rowKey = row.item.key;

      // Non-heading rows simply have their selection state toggled
      if (!isHeadingRow) {
        row.selected = !row.selected;
        return;
      }

      // The heading row can't be "selected", but clicking on it is a way to toggle
      // the selection state of *all* railroads
      let prevSelected = _.clone(this.selected); // We need to compare the previous selection below
      this.selected = this.rows.filter(rr => !rr.isHeadingRow); // Toggle *on* selection of all railroads

      // The new and prev selections are equal?
      if (_.isEqual(this.selected, prevSelected)) {
        // Toggle off selection of all railroads
        this.selected = [];
      }
    },

    showRailroadsGraph(dimensionKey) {
      this.railroadsGraphDimensionKey = dimensionKey;
      this.railroadsGraphShowPopup = true;
    },

    ...mapActions(['loadRailroadReportDataByKeyAndType'])
  }
};
</script>

<style>
/* Data labels can have markdown, which is wrapped in <p> and must be tweaked */
.rr-label .rr-label-md p {
  margin-bottom: 0;
}

/* "heading rows" may be styled differently */
.rr-heading-row {
  font-weight: bold;
}

/* Table overall */
table.datatable.table {
  width: 300px;
  border: 1px solid #bdbdbd; /* grey lighten-1 */
}

/* Table header */
/* table.datatable.table .rr-label:nth-child(1) {
  background-color: #bdbdbd;
} */

/* Table rows */
table.datatable.table tbody td,
table.datatable.table tbody th {
  height: 23px;
}

.rr-selected-row-icon {
  height: 19px;
  float: left;
  margin-left: -20px;
  margin-right: -5px;
}
</style>
