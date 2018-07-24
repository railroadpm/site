<template>
  <div v-if="dataLoaded">
    <v-data-table class="rr-table" v-model="selected" :items="rows" item-key="key" hide-actions hide-headers>
      <template slot="items" slot-scope="row">
        <!-- Allow clicking anywhere on a (non-Heading) row to select it for inclusion in a "Railroads Graph" -->
        <tr :active="row.selected" @click="rowClick(row)">
          <!-- Render the row label cell -->
          <td class="rr-label">
            <span :class="{ 'rr-heading-row': row.item.isHeadingRow }">
              <v-icon class="rr-selected-row-icon" v-show="row.selected" color="accent">insert_chart_outlined</v-icon>
              <vue-markdown class="rr-label-md" :source="row.item.rowLabel" />
            </span>
          </td>
        </tr>
      </template>
    </v-data-table>

    <br>
    <railroads-graph-actions :selected-railroads="selected" @show-graph="railroadsGraphShowPopup = true" />

    <railroads-graph-popup v-if="railroadsGraphShowPopup" :show="railroadsGraphShowPopup" :railroads="selected" :dimension-key="dimensionKey"
      @close="railroadsGraphShowPopup = false" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import _ from 'lodash';
import RailroadsGraphActions from '~/components/RailroadsGraphActions.vue';
import RailroadsGraphPopup from '~/components/RailroadsGraphPopup.vue';

export default {
  props: {
    dimensionKey: {
      type: String,
      required: true
    }
  },

  components: {
    RailroadsGraphActions,
    RailroadsGraphPopup
  },

  data: () => ({
    selected: [],
    railroadsGraphShowPopup: false
  }),

  created() {
    console.log(`COMPONENT: Created <RailroadsTable> component for "${this.dimensionKey}"`);
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
    },
    rows() {
      return _(this.railroadProfiles)
        .map(rr => ({
          rowLabel: `&nbsp;&nbsp;${rr.Key != 'AOR' ? rr.Key : rr.ShortName}`,
          key: rr.Key,
          isHeadingRow: false
        }))
        .filter(val => !(this.dimensionKey != 'CarsOnLine' && val.key === 'AOR')) // "All Other Railroads" only for "Cars On Line" dimension
        .unshift({
          rowLabel: 'Railroads',
          key: 'Participant',
          isHeadingRow: true
        })
        .value();
    }
  },

  methods: {
    rowClick(row) {
      let isHeadingRow = !!row.item.isHeadingRow;
      let rowKey = row.item.key;

      // Non-heading rows simply have their selection state toggled
      if (!isHeadingRow) {
        row.selected = !row.selected;
      } else {
        // The heading row can't be "selected", but clicking it is a way to toggle the selection state of *all* railroads
        let prevSelected = _.clone(this.selected); // We need to compare the previous selection below
        this.selected = this.rows.filter(rr => !rr.isHeadingRow); // Toggle *on* selection of all railroads

        // The new and prev selections are equal?
        if (_.isEqual(this.selected, prevSelected)) {
          // Toggle *off* selection of all railroads
          this.selected = [];
        }
      }

      // Finally, take this opportunity to proactively fire off an *async* (non-blocking) data load action for each
      // selected railroad, as we'll need that data (if not cached already) to produce the graph
      this.selected.forEach(rr => {
        this.loadRailroadReportDataByKeyAndType({ key: rr.key, type: 'Historical' });
      });
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
.rr-table table.datatable.table {
  width: 300px;
  border: 1px solid #bdbdbd; /* grey lighten-1 */
}

/* Table header */
.rr-table table.datatable.table tr:nth-child(1) {
  background-color: #f5f5f5;
}

/* Table header - hover */
.rr-table table.datatable.table tr:nth-child(1):hover {
  background-color: #eeeeee;
}

/* Table rows */
.rr-table table.datatable.table tbody td,
.rr-table table.datatable.table tbody th {
  height: 23px;
}

.rr-table .rr-selected-row-icon {
  height: 19px;
  float: left;
  margin-left: -20px;
  margin-right: -5px;
}
</style>
