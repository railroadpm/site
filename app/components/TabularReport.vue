<template>
  <v-data-table :must-sort="true" :headers="headers" :items="rows" hide-actions>
    <template slot="items" slot-scope="row">
      <td>{{ row.item["RowLabel"] }}</td>
      <td v-for="(col, i) in Object.keys(row.item).sort().slice(0, -1)" :key="i">
        {{ row.item[col] | formatNumber }}
      </td>
    </template>
  </v-data-table>
</template>

<script>
import numeral from 'numeral';

export default {
  props: {
    entityBaseUrl: {
      type: String,
      required: true
    },
    entityResultColsKey: {
      type: String,
      required: true
    },
    entityResultRowsKey: {
      type: String,
      required: true
    }
  },

  data: () => ({
    // API_HOST: 'https://api.rrpm.run',
    API_HOST: 'http://localhost:1313',
    API_GET_SUFFIX: '/get.json',

    loading: true,
    pagination: {
      sortBy: 'RowLabelOrd'
    },
    mustSort: true,
    headers: [],
    //   { text: '', value: 'RowLabel', sortable: false, align: 'left' },
    //   { text: '04/06/18', value: '20180406', align: 'left' },
    //   { text: '04/13/18', value: '20180413', align: 'left' },
    //   { text: '04/20/18', value: '20180420', align: 'left' },
    //   { text: '04/27/18', value: '20180427', align: 'left' }
    // ],
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
      return `${this.API_HOST}${this.entityBaseUrl}/all${this.API_GET_SUFFIX}`;
    }
  },

  methods: {
    async getRows() {
      this.loading = true;

      try {
        console.log('Getting rows...');
        const response = await this.$axios.$get(this.dataUrl);
        console.log(`Got rows from ${this.dataUrl}`);

        let responseCols = response.data[this.entityResultColsKey];
        this.headers = [];
        responseCols.forEach(elt => {
          this.headers.push({ text: elt.text, value: elt.key, align: 'left' });
        });

        this.rows = response.data[this.entityResultRowsKey];
      } catch (e) {
        console.log('Error getting rows:', e);
      }

      this.loading = false;
    }
  },

  filters: {
    formatNumber(value) {
      return numeral(value).format('0,0[.]0');
    }
  }
};
</script>

<style scoped>
</style>
