<template>
  <v-data-table :must-sort="true" :headers="headers" :items="rows" hide-actions>
    <template slot="items" slot-scope="props">
      <td>{{ props.item.RowLabel }}</td>
      <td>{{ props.item["20180406"] }}</td>
      <td>{{ props.item["20180413"] }}</td>
      <td>{{ props.item["20180420"] }}</td>
      <td>{{ props.item["20180427"] }}</td>
    </template>
  </v-data-table>
</template>

<script>
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
    console.log('Created <SimpleTabularData> component');
  },

  mounted() {
    console.log('Mounted <SimpleTabularData> component');
    this.getRows();
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

        let cols = response.data[this.entityResultColsKey];
        let rows = response.data[this.entityResultRowsKey];
        let headers = [];

        cols.forEach(elt => {
          headers.push({ text: elt.text, value: elt.key, align: 'left' });
        });

        this.headers = headers;
        this.rows = rows;
      } catch (e) {
        console.log('Error getting rows:', e);
      }

      this.loading = false;
    }
  }
};
</script>

<style scoped>
</style>
