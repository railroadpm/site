<template>
  <v-app light>
    <v-navigation-drawer fixed app dark :mini-variant="miniVariant" :clipped="clippedLeftDrawer" v-model="drawer" mobile-break-point="740" width="230" mini-variant-width="110"
      class="blue darken-1">
      <v-list>
        <!-- Items *without* sub items use v-list-tile -->
        <template v-for="item in drawerItems">
          <template v-if="!item.subItems">
            <v-list-tile router :to="item.to" :key="item.title" exact>
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
                  <v-list-tile-title>Reports</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile router :to="subItem.to" :key="subItem.title" v-for="subItem in item.subItems" exact>
                <!-- We only show the icon in the mini-variant nav drawer -->
                <v-list-tile-action v-if="miniVariant">
                  <v-icon v-html="subItem.icon"></v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>&nbsp;&nbsp;{{ subItem.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>
          </template>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar fixed app dark :clipped-left="clippedLeftDrawer" class="blue darken-3">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer :fixed="fixedFooter" app class="pa-3 grey lighten-2">
      <v-spacer></v-spacer>
      <div>Railroad Performance Measures are published every Wednesday at 2:00 p.m. Eastern Time.</div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clippedLeftDrawer: true,
      drawer: true,
      fixedFooter: true,
      drawerItems: [
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
              icon: 'train',
              title: 'BNSF',
              to: '/reports/BNSF'
            },
            {
              icon: 'train',
              title: 'CN',
              to: '/reports/CN'
            },
            {
              icon: 'train',
              title: 'KCS',
              to: '/reports/KCS'
            },
            {
              icon: 'train',
              title: 'NS',
              to: '/reports/NS'
            },
            {
              icon: 'train',
              title: 'UP',
              to: '/reports/UP'
            },
            {
              icon: 'train',
              title: 'All Other Railroads',
              to: '/reports/AOR'
            }
          ]
        },
        {
          icon: 'info',
          title: 'Definitions',
          to: '/definitions'
        }
      ],
      miniVariant: false,
      title: 'RAILROADPM.ORG'
    };
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
  color: #ffcc66 !important;
}

/* Nav drawer group item icon (e.g., "Reports") fix */
div.list__group__header__prepend-icon i {
  color: white !important;
}

/* Reduce left margin on mini-variant left drawer sub items */
.navigation-drawer--mini-variant div.list__group__items--no-action .list__tile__action {
  margin-left: -20px;
}

/* Fix for strange text clipping in IE 11 */
.toolbar__title {
  min-width: 200px;
}
</style>
