<template>
  <v-data-table :must-sort="true" :headers="headers" :items="rows" hide-actions>
    <template slot="items" slot-scope="row">
      <!-- First render the row label cell -->
      <td class="rpt-data-label">
        <span :class="{ 'rpt-data-heading-row': row.item.isHeadingRow }">
          <vue-markdown>{{ row.item["RowLabel"] }}</vue-markdown>
        </span>
      </td>
      <!-- Then render a cell for each week + measure (week is all numeric: YYYYMMDD) in ascending order by week -->
      <td v-for="(col, i) in Object.keys(row.item).sort().filter(k => !isNaN(k))" :key="i">{{ row.item[col] | formatNumber }}</td>
    </template>
  </v-data-table>
</template>

<script>
import app from '@/app.config';
import numeral from 'numeral';

export default {
  props: {
    entityBaseUrl: {
      type: String,
      required: true
    }
  },

  data: () => ({
    loading: true,
    pagination: {
      sortBy: 'RowLabelOrd'
    },
    mustSort: true,
    headers: [],
    rows: []
  }),

  created() {
    console.log('Created <TabularReport> component');
    this.getRows();
  },

  mounted() {
    console.log('Mounted <TabularReport> component');
  },

  computed: {
    dataUrl() {
      return `${app.API_HOST}${this.entityBaseUrl}/all${app.API_GET_SUFFIX}`;
    }
  },

  methods: {
    async getRows() {
      this.loading = true;

      try {
        console.log('Getting rows...');
        const response = await this.$axios.$get(this.dataUrl);
        console.log(`Got rows from ${this.dataUrl}`);

        let responseCols = response.data.columns;
        this.headers = [];
        responseCols.forEach(elt => {
          this.headers.push({ text: elt.text, value: elt.key, align: 'left' });
        });

        this.rows = response.data.rows;
      } catch (e) {
        this.headers = [];
        this.rows = [];
        console.log('Error getting rows:', e);
      }

      this.loading = false;
    }
  },

  filters: {
    formatNumber(value) {
      return value ? numeral(value).format('0,0[.]0') : '';
    }
  }
};
</script>

<style>
/* Data labels can have markdown, which is wrapped in <p> and must be tweaked */
.rpt-data-label div p {
  margin-bottom: 0;
}

/* Data "heading rows" may have their data label styled differently */
.rpt-data-heading-row {
  font-weight: bold;
}

/* Table header */
table.datatable.table thead tr {
  height: 45px;
}

/* Table header column */
table.datatable.table thead tr th {
  font-weight: bold;
  font-size: 14px;
}

/* Table rows */
table.datatable.table tbody td,
table.datatable.table tbody th {
  height: 35px;
}
</style>
