<template>
  <div v-show="dataLoaded">
    <v-data-table class="rpt-table" v-model="selected" :headers="headers" :items="rows" item-key="key" hide-actions>
      <template slot="headers" slot-scope="cols">
        <tr v-if="reportType === 'Historical'" class="rpt-col-pagination-row">
          <th>&nbsp;</th>
          <th class="rpt-col-pagination" :colspan="cols.headers.length - 1">
            <div class="text-xs-center rpt-pagination-ctl">
              <v-pagination :circle="true" :length="numPages" :total-visible="numPages" v-model="historicalPage" color="accent-dark"></v-pagination>
            </div>
          </th>
        </tr>
        <tr class="rpt-col-groups-row">
          <th>
            <!-- We render the CSV Download btn in the upper "rowLabel" header cell -->
            <v-btn class="rpt-csv-btn" small outline color="accent" dark :href="csvUrl">CSV Download</v-btn>
          </th>
          <template v-if="reportType === 'Current'">
            <th class="rpt-col-groups rpt-col-group-avg" :colspan="avgColumns.length">
              <div>Historical Average</div>
            </th>
            <th class="rpt-col-groups" :colspan="cols.headers.length - avgColumns.length - 1">
              <div>Week Ending</div>
            </th>
          </template>
          <template v-else>
            <th class="rpt-col-groups" :colspan="cols.headers.length - 1">
              <div>Week Ending</div>
            </th>
          </template>
        </tr>
        <tr class="rpt-col-dimensions-row">
          <th v-for="col in cols.headers" :key="col.value" :class="`column text-xs-${col.align} rpt-col-dimensions`">
            <!-- We render the "Quick Graph" component in the lower "rowLabel" header cell -->
            <template v-if="col.value === 'rowLabel'">
              <quick-graph-menu class="rpt-quick-graph-menu" :railroad="railroad" :selected-measures="selected" @remove-all="selected = []"
                @show-graph="showQuickGraph" />
            </template>
            <template v-else>
              <span>{{ col.text }}</span>
            </template>
          </th>
        </tr>
      </template>

      <template slot="items" slot-scope="row">
        <!-- Allow clicking anywhere on a (non-Heading) row to select it for inclusion in a "Quick Graph" -->
        <tr :class="rowCssClasses(row)" :active="row.selected" @click="rowClick(row)">
          <!-- First render the row label cell -->
          <td class="rpt-data-label">
            <span :class="{ 'rpt-data-heading-row-label': row.item.isHeadingRow, 'rpt-data-calculated-row-label': row.item.isCalculated }">
              <v-icon class="rpt-selected-row-icon" v-show="row.selected" color="accent">insert_chart_outlined</v-icon>
              <vue-markdown class="rpt-data-label-md" :source="row.item.rowLabel" />
              </span>
          </td>

          <!-- Then render a cell for each average column ("Current" tab only) -->
          <td v-if="reportType === 'Current'" v-for="(col, i) in avgColumns" :key="`avg${i}`">
            <span>{{ $helpers.formatNumber(row.item[col]) }}</span>
          </td>

          <!-- Finally render a cell for each week + measure (week is all numeric: YYYYMMDD) in ascending order by week -->
          <td v-for="(col, i) in measureKeys" :key="`wk${i}`">
            <span v-if="row.item.key === 'Revisions'">{{ row.item[col] }}</span>
            <span v-else>{{ $helpers.formatNumber(row.item[col]) }}</span>
          </td>
        </tr>
      </template>
    </v-data-table>

    <quick-graph-popup v-if="quickGraphShowPopup" :show="quickGraphShowPopup" :railroad="railroad" :dimension-key="quickGraphDimensionKey"
      :rows="selectedRowsInSegment(quickGraphDimensionKey)" @close="quickGraphShowPopup = false" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import _ from 'lodash';
import QuickGraphMenu from '~/components/QuickGraphMenu.vue';
import QuickGraphPopup from '~/components/QuickGraphPopup.vue';

export default {
  props: {
    railroad: {
      type: String,
      required: true
    },
    reportType: {
      type: String,
      required: true
    }
  },

  components: {
    QuickGraphMenu,
    QuickGraphPopup
  },

  data: () => ({
    rows: [],
    columns: [],
    headers: [],
    avgColumns: [], // Array of keys for lookup of averages data in rows
    measureKeys: [], // Array of keys for lookup of measure data in rows, by week
    selected: [],

    avgColumnsCount: 2,
    historicalPage: 1,
    historicalPageSize: 6,
    historicalPageCount: 9, // We'll group the 53 weeks into 8 "pages" of 6, with a 9th page having the 5 remaining weeks

    quickGraphShowPopup: false,
    quickGraphDimensionKey: ''
  }),

  created() {
    console.log(`COMPONENT: Created <TabularReport> component for ${this.railroad}, report type "${this.reportType}"`);
    // NOTE: Often, a component might call a method here to load data from an API. But in this case we instead trigger the data load by watching
    // the value of the selected tab and matching it to this component's report type. This allows us to mount all components and have them ready
    // while preferentially loading the data for the selected tab. This approach avoids flooding the API endpoint with data requests from multiple
    // tabs, and gives us some time to cache data that may be common to multiple tabs
  },

  mounted() {
    console.log(`COMPONENT: Mounted <TabularReport> component for ${this.railroad}, report type "${this.reportType}"`);
  },

  computed: {
    selectedTab() {
      return this.$store.state.ui.reports.selectedTab;
    },

    numPages() {
      return this.reportType === 'Current' ? 1 : this.historicalPageCount;
    },

    // True when the railroad report data has been loaded via API, false otherwise
    dataLoaded() {
      return this.$store.state.railroadReportData[this.railroad]['Historical'].rows.length > 0;
    },

    csvUrl() {
      return this.$store.getters.railroadCsvDataUrlByKeyAndType(this.railroad, this.reportType);
    }
  },

  watch: {
    historicalPage: function(newPage, oldPage) {
      if (newPage != oldPage) {
        this.getHeadersAndKeysFromRawData(newPage);
      }
    },

    selectedTab: {
      immediate: true,
      handler: async function(newTab, oldTab) {
        if (!newTab) return;

        if (newTab != oldTab) {
          console.log(`COMPONENT: Selected tab is now ${newTab}`);
          if (newTab.includes(this.reportType.toLowerCase())) await this.getTabularData();
          else {
            // For a tab that isn't selected we still load rows and columns, but only after a delay to
            // give the selected tab a chance to do its thing first... and possibly even cache the data
            // needed by the non-selected tab
            setTimeout(async () => {
              await this.getTabularData();
            }, 700);
          }
        }
      }
    }
  },

  methods: {
    async getTabularData() {
      try {
        console.log(`COMPONENT: Getting ${this.reportType} tabular data for ${this.railroad}...`);
        await this.loadRailroadReportDataByKeyAndType({ key: this.railroad, type: 'Current' });
        await this.loadRailroadReportDataByKeyAndType({ key: this.railroad, type: 'Historical' });
        console.log('COMPONENT: Got tabular data');

        this.columns = this.$store.state.railroadReportData[this.railroad][this.reportType].columns;
        this.headers = [];
        this.rows = [];
        this.measureKeys = [];
        this.getHeadersAndKeysFromRawData(this.historicalPage);
        this.rows = this.$store.state.railroadReportData[this.railroad]['Historical'].rows;
      } catch (e) {
        this.headers = [];
        this.rows = [];
        console.log('COMPONENT: Error getting rows and columns:', e);
      }
    },

    getHeadersAndKeysFromRawData(pageNum) {
      let renderedCols = [];

      if (this.reportType === 'Current') {
        renderedCols = this.columns;
        this.avgColumns = [this.$store.getters.periodPreviousQuarter, this.$store.getters.periodPreviousMonth];
      } else {
        // Note that in this case we need to manually add the "rowLabel" col first...
        this.headers = [];
        this.measureKeys = [];
        this.headers.push({ text: '', value: 'rowLabel', align: 'left', sortable: false });

        // ...and then take the appropriate slice of the raw columns array
        renderedCols = this.columns.slice(
          this.avgColumnsCount + (pageNum - 1) * this.historicalPageSize + 1,
          this.avgColumnsCount + (pageNum - 1) * this.historicalPageSize + this.historicalPageSize + 1
        );
      }

      if (this.reportType === 'Historical' || this.headers.length === 0) {
        renderedCols.forEach(elt => {
          this.headers.push({ text: elt.text, value: elt.key, align: 'left', sortable: false });
          if (!isNaN(elt.key)) this.measureKeys.push(elt.key);
        });
      }
    },

    rowCssClasses(row) {
      return {
        'rpt-data-heading-row': row.item.isHeadingRow,
        'rpt-data-subheading-row': row.item.isSubheading,
        'rpt-data-calculated-row': row.item.isCalculated,
        'rpt-data-sum-row': row.item.isSum,
        'rpt-data-pct-row': row.item.isPct,
        'rpt-data-agg-row': row.item.isReportedAggregate
      };
    },

    rowClick(row) {
      let isHeadingRow = !!row.item.isHeadingRow;
      let isPct = !!row.item.isPct;
      let rowKey = row.item.key;

      // Non-heading (measure) rows (except for percentages) simply have their selection state toggled
      if (!isHeadingRow && !isPct) {
        row.selected = !row.selected;
        return;
      }

      // Percentages can't be selected/graphed and require no further action
      if (isPct) {
        row.selected = false;
        return;
      }

      // Heading rows other than the 3 main segments can't be selected
      // and require no further action
      let segmentKeys = ['CarsOnLine', 'TrainSpeed', 'TerminalDwell'];
      if (!segmentKeys.includes(rowKey)) {
        row.selected = false;
        return;
      }

      // The 3 main Headings can't be "selected" either, but clicking on them
      // is a way to toggle the selection state of *all* of their measures (except percentages)
      let prevSelected = _.clone(this.selected); // We need to compare the previous selection below
      let keysInSegment = this.keysInSegment(rowKey);
      let rowsInSegment = _.intersectionWith(this.rows, keysInSegment, (arrVal, othVal) => arrVal.key === othVal);
      this.selected = _.unionBy(this.selected, rowsInSegment, 'key'); // Toggle *on* selection of all measures

      // The new and prev selections are equal?
      if (_.isEqual(this.selected, prevSelected)) {
        // Toggle *off* selection of all measures
        this.selected = _.differenceBy(this.selected, rowsInSegment, 'key');
      }
    },

    keysInSegment(dimensionKey) {
      let dimensionKeys = this.$store.state.dimension.keys;
      return dimensionKey === 'TerminalDwell' ? dimensionKeys.TerminalDwell[this.railroad] : dimensionKeys[dimensionKey];
    },

    showQuickGraph(dimensionKey) {
      this.quickGraphDimensionKey = dimensionKey;
      this.quickGraphShowPopup = true;
    },

    selectedRowsInSegment(dimensionKey) {
      let keysInSegment = this.keysInSegment(dimensionKey);
      return _.intersectionWith(this.selected, keysInSegment, (arrVal, othVal) => arrVal.key === othVal);
    },

    ...mapActions(['loadRailroadReportDataByKeyAndType'])
  }
};
</script>

<style>
/* Data labels can have markdown, which is wrapped in <p> and must be tweaked */
.rpt-data-label .rpt-data-label-md p {
  margin-bottom: 0;
}

/* Calculated rows, all sums, all reported aggregates, and data "heading row labels" may have their data label styled differently */
.rpt-data-calculated-row td span,
.rpt-data-sum-row td span,
.rpt-data-agg-row td span,
.rpt-data-heading-row-label {
  font-weight: bold;
}

/* Rows that can't be selected have no hover highlight color */
.rpt-data-pct-row:hover,
.rpt-data-subheading-row:hover {
  background-color: white !important;
}

/* Calculated *percentage* rows and data may be styled differently too */
.rpt-data-pct-row td span {
  color: black;
}

/* In the report table, things can be selectively hidden */
.rpt-table .rpt-hidden {
  display: none;
}

/* Table header */
.rpt-table table.v-datatable.v-table thead tr {
  height: 38px;
}

/* Table header column */
.rpt-table table.v-datatable.v-table thead tr th {
  font-weight: bold;
  font-size: 14px;
}

/* Table header row for groups needs tweek */
.rpt-table table.v-datatable.v-table thead tr.rpt-col-groups-row {
  margin-top: 5px;
}

/* Table header borders */
.rpt-table table.v-datatable.v-table thead tr.rpt-col-pagination-row,
.rpt-table table.v-datatable.v-table thead tr.rpt-col-groups-row,
.rpt-table table.v-datatable.v-table thead tr th.rpt-col-dimensions {
  border: none;
}

/* Table header borders */
.rpt-table table.v-datatable.v-table thead tr th.rpt-col-groups div,
.rpt-table table.v-datatable.v-table thead tr.rpt-col-dimensions-row {
  border-bottom: 1px solid #e0e0e0; /* grey lighten-2 */
}

.rpt-table table.v-datatable.v-table thead tr th.rpt-col-pagination div {
  margin: -5px 0 -13px 0;
}

.rpt-table table.v-datatable.v-table thead tr th.rpt-col-groups div {
  width: 100%;
  padding-top: 7px;
  text-align: center;
}

/* Table header for averages needs alignment tweek */
.rpt-table table.v-datatable.v-table thead tr th.rpt-col-group-avg div {
  margin-top: 2px;
}

/* Table rows */
.rpt-table table.v-datatable.v-table tbody td,
.rpt-table table.v-datatable.v-table tbody th {
  height: 23px;
}

/* Report pagination control - 53 Week History */
.rpt-pagination-ctl {
  padding: 15px 0 10px 0;
  width: 100%;
  background-color: white;
}

.rpt-selected-row-icon {
  height: 19px;
  float: left;
  margin-left: -20px;
  margin-right: -5px;
}

.rpt-quick-graph-menu {
  margin-left: -10px;
}

.rpt-quick-graph-menu button {
  width: 130px;
}

.rpt-csv-btn {
  float: left;
  margin: 5px 0 0 -2px;
  width: 130px;
}
</style>
