import Vue from 'vue';
import numeral from 'numeral';

/**
 * General helper methods and data for the Railroad Performance Measures (RPM) site
 */
const helpers = {
  /**
   * Assuming "val" is not null or an empty string, return it formatted with thousands separators
   * and, if applicable or specified in a custom format, a single digit after the decimal point
   * @param {number} val Value to format
   * @param {string} fmt Optional format string. By default we only show a decimal point when the raw val has tenths (i.e., is not a whole number)
   */
  formatNumber(val, fmt = '0,0[.]0') {
    if (val === null) return '-';
    if (val === '') return '';
    return numeral(val).format(fmt);
  },

  /**
   * Given any non-negative integer index arg, return a color from a lookup table containing
   * an assortment of colors. The color is returned as an RGB hex value string
   * @param {number} index
   */
  colorFromIndex(index) {
    // See: https://vuetifyjs.com/en/style/colors
    // "darken-4" for:
    //    Blue, Teal, Lime, Orange, Blue-Grey, Red, Deep-Purple, Light-Blue, Green, Yellow,
    //    Pink, Brown, Grey, Deep-Orange, Light-Green
    let colors = [
      '#0D47A1',
      '#004D40',
      '#827717',
      '#E65100',
      '#263238',
      '#B71C1C',
      '#311B92',
      '#01579B',
      '#1B5E20',
      '#F57F17',
      '#880E4F',
      '#3E2723',
      '#212121',
      '#BF360C',
      '#33691E'
    ];
    return colors[index % colors.length];
  },

  /**
   * Given any non-negative integer index arg, return a Chart.js point style string
   * from a lookup table containing an assortment of them
   * @param {number} index
   */
  pointStyleFromIndex(index) {
    // See: https://www.chartjs.org/docs/latest/configuration/elements.html#point-styles
    let pointStyles = ['rect', 'circle', 'rectRounded', 'triangle', 'rectRot', 'star'];
    return pointStyles[index % pointStyles.length];
  },

  /** Array of metadata describing the 3 main "segments" of categorical dimensions in the RPM system */
  categoricalDimensionSegments: [
    {
      key: 'CarsOnLine',
      label: 'Cars On Line',
      labelWithUnits: 'Cars On Line',
      materialColor: 'blue lighten-2',
      textColor: 'blue--text'
    },
    {
      key: 'TrainSpeed',
      label: 'Train Speed',
      labelWithUnits: 'Train Speed (Miles per Hour)',
      materialColor: 'green lighten-2',
      textColor: 'green--text'
    },
    {
      key: 'TerminalDwell',
      label: 'Terminal Dwell',
      labelWithUnits: 'Terminal Dwell (Hours)',
      materialColor: 'red lighten-2',
      textColor: 'red--text'
    }
  ],

  regex: {
    htmlTagsAndSpaces: /&nbsp;|<\/?[\w\s="/.':;#-\/\?]+>/gi
  }
};

// Install "helpers" as a Vue plugin
const helpersPlugin = {
  install() {
    Vue.helpers = helpers;
    Vue.prototype.$helpers = helpers;
  }
};

Vue.use(helpersPlugin);
