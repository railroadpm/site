<template>
  <v-app light>
    <v-navigation-drawer fixed app dark clipped v-model="drawer" mobile-break-point="740" width="230" class="blue darken-1">
      <v-list>
        <template v-for="item in drawerItems">
          <!-- Items *without* sub items use v-list-tile -->
          <template v-if="!item.subItems">
            <!-- Note that items with a "target" are treated as traditional hrefs to outside content -->
            <v-list-tile :nuxt="!item.target" :to="item.target ? undefined : item.to" :href="item.target ? item.to : undefined" :key="item.title"
              :target="item.target" :rel="item.rel" exact>
              <v-list-tile-action>
                <v-icon v-html="item.icon"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>

          <!-- Items *with* sub items use v-list-group -->
          <template v-else>
            <v-list-group :prepend-icon="item.icon" :key="item.title" value="true" no-action>
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile nuxt :to="subItem.to" :key="subItem.title" v-for="subItem in item.subItems" exact>
                <v-list-tile-content>
                  <v-list-tile-title>&nbsp;&nbsp;{{ subItem.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>
          </template>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar fixed app dark clipped-left class="blue darken-3">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title" />
    </v-toolbar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer :fixed="fixedFooter" app inset class="pa-3 grey lighten-2">
      <v-spacer></v-spacer>
      <div class="app-footer-text">Railroad Performance Measures are published every Wednesday at 2:00 p.m. Eastern Time.</div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: 'RAILROADPM.ORG',
      drawer: null, // null = Vuetify automatically "do the right thing" to show/hide drawer based on mobile, etc.
      fixedFooter: true
    };
  },

  created() {
    console.log('LAYOUT: Created "default" layout');
  },

  mounted() {
    console.log('LAYOUT: Mounted "default" layout');
  },

  computed: {
    selectedRailroadKey() {
      return this.$route.params.railroad ? this.$route.params.railroad.toUpperCase() : null;
    },

    drawerItems() {
      let items = [
        {
          icon: 'home',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'assignment',
          title: 'Reports',
          subItems: [
            {
              title: 'BNSF',
              to: '/reports/BNSF/'
            },
            {
              title: 'CN',
              to: '/reports/CN/'
            },
            {
              title: 'KCS',
              to: '/reports/KCS/'
            },
            {
              title: 'NS',
              to: '/reports/NS/'
            },
            {
              title: 'UP',
              to: '/reports/UP/'
            },
            {
              title: 'All Other Railroads',
              to: '/reports/AOR/'
            }
          ]
        },
        {
          icon: 'info',
          title: 'Definitions',
          to: '/definitions'
        },
        {
          icon: 'insert_chart',
          title: 'Graphs',
          subItems: [
            {
              title: 'Cars on Line',
              to: '/graphs/CarsOnLine/'
            },
            {
              title: 'Terminal Dwell',
              to: '/graphs/TerminalDwell/'
            },
            {
              title: 'Train Speed',
              to: '/graphs/TrainSpeed/'
            }
          ]
        }
      ];

      if (this.selectedRailroadKey && this.selectedRailroadKey != 'AOR') {
        items.push({
          icon: 'train',
          title: 'For More Info',
          to: this.$store.getters.railroadProfileByKey(this.selectedRailroadKey).Website,
          target: '_blank',
          rel: 'noopener'
        });
      }

      return items;
    }
  }
};
</script>

<style>
/* Avoid vertical scrollbar when possible */
html {
  overflow-y: auto !important;
}

/* Left drawer active item  */
.list__tile--active .list__tile__content,
.list__tile--active .list__tile__action {
  color: #ffcc80 !important; /* orange lighten-3 */
}

/* Nav drawer group item icon (e.g., "Reports") fix */
div.list__group__header__prepend-icon i {
  color: white !important;
}

/* Fix for strange text clipping in IE 11 */
.toolbar__title {
  min-width: 200px;
}

.app-footer-text {
  font-size: 12px;
}
</style>
