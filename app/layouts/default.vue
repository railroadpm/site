<template>
  <v-app :class="`rpm-mobile-bp-${mobileBreakpointName}`" light>
    <v-navigation-drawer fixed app dark clipped v-model="drawer" class="rpm-left-nav" :mobile-break-point="mobileBreakpointLg"
      width="230">
      <v-list>
        <template v-for="item in drawerItems">
          <!-- Items *without* sub items use v-list-tile -->
          <template v-if="!item.subItems">
            <!-- Note that items with a "target" are treated as traditional hrefs to outside content -->
            <v-list-tile :nuxt="!item.target" :to="item.target ? undefined : item.to" :href="item.target ? item.to : undefined"
              :key="item.title" :target="item.target" :rel="item.rel" exact>
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
      <nuxt-link to="/" class="rpm-main-banner-link"><img src="/banner_lg.jpg" class="rpm-main-banner" /></nuxt-link>
    </v-toolbar>

    <v-content class="rpm-main-content">
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: 'RailroadPM.org',
      drawer: null, // null = Vuetify automatically "do the right thing" to show/hide drawer based on mobile, etc.

      mobileBreakpointXl: 1100,
      mobileBreakpointLg: 1025,
      mobileBreakpointMd: 740,
      mobileBreakpointSm: 670
    };
  },

  created() {
    console.log('LAYOUT: Created "default" layout');
  },

  mounted() {
    console.log('LAYOUT: Mounted "default" layout');
  },

  computed: {
    mobileBreakpointName() {
      let width = this.$vuetify.breakpoint.width;
      if (width >= this.mobileBreakpointXl) return 'none';
      if (width < this.mobileBreakpointXl && width >= this.mobileBreakpointLg) return 'xl';
      if (width < this.mobileBreakpointLg && width >= this.mobileBreakpointMd) return 'lg';
      if (width < this.mobileBreakpointMd && width >= this.mobileBreakpointSm) return 'md';
      return 'sm';
    },

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

<style lang="stylus">
@require '~assets/variables'
@require '~vuetify/src/stylus/settings/_colors'

/* Avoid vertical scrollbar when possible */
html
  overflow-y: auto !important

.rpm-main-content
  background: linear-gradient(white 15%, #eeeef3)

  & .container
    padding-top: 20px !important

/* Left drawer active item */
.v-list__tile--active .v-list__tile__content,
.v-list__tile--active .v-list__tile__action
  color: #ffcc80 !important /* orange lighten-3 */

/* Nav drawer group item icon (e.g., "Reports") fix */
div.v-list__group__header__prepend-icon i
  color: white !important

.rpm-left-nav
  background-color: $rpm-color.primary !important

  & div.v-list
    padding-top: 4px
    background-color: $rpm-color.primary !important

  & .v-list__tile
    height: 44px

  & .v-list__group__items .v-list__tile
    height: 40px

.v-toolbar__content,
.rpm-main-toolbar,
.rpm-main-banner
  height: $rpm-toolbar-height !important

.v-toolbar__side-icon
  min-width: 36px

.rpm-main-banner-link
  margin: 0 !important
  padding: 0 !important
  line-height: 0 !important

.rpm-mobile-bp-xl,
.rpm-mobile-bp-lg
  & table.v-table thead td:not(:nth-child(1)),
  & table.v-table tbody td:not(:nth-child(1)),
  & table.v-table thead th:not(:nth-child(1)),
  & table.v-table tbody th:not(:nth-child(1))
    padding: 0 12px

.rpm-mobile-bp-md,
.rpm-mobile-bp-sm
  & table.v-table thead td:not(:nth-child(1)),
  & table.v-table tbody td:not(:nth-child(1)),
  & table.v-table thead th:not(:nth-child(1)),
  & table.v-table tbody th:not(:nth-child(1))
    padding: 0 6px
</style>
