<template>
  <div v-show="dataLoaded">
    <div v-show="reportType === 'Historical'" class="text-xs-center rpt-pagination-ctl">
      <v-pagination :circle="true" :length="numPages" :total-visible="numPages" v-model="historicalPage" color="blue darken-4"></v-pagination>
    </div>

    <v-data-table v-model="selected" :headers="headers" :items="rows" item-key="key" hide-actions>
      <template slot="headerCell" slot-scope="col">
        <quick-graph-menu v-if="col.header.value === 'RowLabel'" class="rpt-quick-graph-menu"></quick-graph-menu>
        <span>{{ col.header.text }}</span>
      </template>

      <template slot="items" slot-scope="row">
        <!-- Allow clicking anywhere on a (non-Heading) row to select it for inclusion in a "Quick Graph" -->
        <tr :active="row.selected" @click="row.selected = row.item.isHeadingRow ? false : !row.selected">
          <!-- First render the row label cell -->
          <td class="rpt-data-label">
            <span :class="{ 'rpt-data-heading-row': row.item.isHeadingRow }">
              <v-icon class="rpt-selected-row-icon" v-show="row.selected" color="orange lighten-1">insert_chart_outlined</v-icon>
              <vue-markdown class="rpt-data-label-md" :source="row.item['RowLabel']" />
            </span>
          </td>

          <!-- Then render a cell for each week + measure (week is all numeric: YYYYMMDD) in ascending order by week -->
          <td v-for="(col, i) in measureKeys" :key="i">
            {{ row.item[col] | formatNumber }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import numeral from 'numeral';
import QuickGraphMenu from '~/components/QuickGraphMenu.vue';

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
    QuickGraphMenu
  },

  data: () => ({
    rows: [],
    columns: [],
    headers: [],
    measureKeys: [], // Array of keys for lookup of measure data in rows, by week
    selected: [],

    historicalPage: 1,
    historicalPageSize: 6,
    historicalPageCount: 9 // We'll group the 53 weeks into 8 "pages" of 6, with a 9th page having the 5 remaining weeks
  }),

  watch: {
    historicalPage: function(newPage, oldPage) {
      if (newPage != oldPage) {
        this.getHeadersAndMeasureKeysFromRawData(newPage);
      }
    }
  },

  created() {
    console.log(`COMPONENT: Created <TabularReport> component for ${this.railroad}, report type "${this.reportType}"`);
    this.getTabularData();
  },

  mounted() {
    console.log(`COMPONENT: Mounted <TabularReport> component for ${this.railroad}, report type "${this.reportType}"`);
  },

  computed: {
    numPages() {
      return this.reportType === 'Current' ? 1 : this.historicalPageCount;
    },
    dataLoaded() {
      return this.$store.state.railroadReportData[this.railroad][this.reportType].rows.length > 0;
    }
  },

  methods: {
    async getTabularData() {
      try {
        console.log(`COMPONENT: Getting ${this.reportType} tabular data for ${this.railroad}...`);
        await this.loadRailroadReportDataByKeyAndType({ key: this.railroad, type: this.reportType });
        console.log(`COMPONENT: Got rows and columns`);

        this.columns = this.$store.state.railroadReportData[this.railroad][this.reportType].columns;
        this.headers = [];
        this.rows = [];
        this.measureKeys = [];
        this.getHeadersAndMeasureKeysFromRawData(this.historicalPage);
        this.rows = this.$store.state.railroadReportData[this.railroad][this.reportType].rows;
      } catch (e) {
        this.headers = [];
        this.rows = [];
        console.log('COMPONENT: Error getting rows and columns:', e);
      }
    },

    getHeadersAndMeasureKeysFromRawData(pageNum) {
      let renderedCols = [];

      if (this.reportType === 'Current') {
        renderedCols = this.columns;
      } else {
        // Note that in this case we need to manually add the "RowLabel" col first...
        this.headers = [];
        this.measureKeys = [];
        this.headers.push({ text: '', value: 'RowLabel', align: 'left', sortable: false });

        // ...and then take the appropriate slice of the raw columns array
        renderedCols = this.columns.slice((pageNum - 1) * this.historicalPageSize + 1, (pageNum - 1) * this.historicalPageSize + this.historicalPageSize + 1);
      }

      if (this.reportType === 'Historical' || this.headers.length === 0) {
        renderedCols.forEach(elt => {
          this.headers.push({ text: elt.text, value: elt.key, align: 'left', sortable: false });
          if (!isNaN(elt.key)) this.measureKeys.push(elt.key);
        });
      }
    },

    ...mapActions(['loadRailroadReportDataByKeyAndType'])
  },

  filters: {
    formatNumber(value) {
      return value === null ? '-' : value === '' ? '' : numeral(value).format('0,0[.]0');
    }
  }
};
</script>

<style>
/* Data labels can have markdown, which is wrapped in <p> and must be tweaked */
.rpt-data-label .rpt-data-label-md p {
  margin-bottom: 0;
}

/* Data "heading rows" may have their data label styled differently */
.rpt-data-heading-row {
  font-weight: bold;
}

/* Table header */
table.datatable.table thead tr {
  height: 38px;
}

/* Table header column */
table.datatable.table thead tr th {
  font-weight: bold;
  font-size: 14px;
}

/* Table rows */
table.datatable.table tbody td,
table.datatable.table tbody th {
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
</style>
