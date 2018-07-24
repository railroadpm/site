<template>
  <v-app light>
    <v-navigation-drawer fixed app dark clipped v-model="drawer" mobile-break-point="740" width="230" class="primary">
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

    <v-toolbar fixed app light clipped-left class="white elevation-0 rpm-main-toolbar">
      <v-toolbar-side-icon @click="drawer = !drawer" class="primary--text"></v-toolbar-side-icon>
      <img src="/banner_lg.jpg" class="rpm-main-banner" />
    </v-toolbar>

    <v-content class="rpm-main-content">
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer :fixed="fixedFooter" app inset class="pa-3 rpm-footer">
      <v-spacer></v-spacer>
      <div class="rpm-footer-text">Railroad Performance Measures are published every Wednesday at 2:00 p.m. Eastern Time.</div>
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

.rpm-main-content {
  background: linear-gradient(white 15%, #eeeef3);
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

.toolbar__content,
.rpm-main-toolbar,
.rpm-main-banner {
  height: 64px !important;
}

.toolbar__side-icon {
  min-width: 36px;
}

/* Fix for strange text clipping in IE 11 */
.toolbar__title {
  min-width: 200px;
}

.rpm-footer {
  background-color: #e0e0e5 !important;
}

.rpm-footer-text {
  font-size: 12px;
}
</style>
