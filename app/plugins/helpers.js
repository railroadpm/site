import Vue from 'vue';
import numeral from 'numeral';

const helpers = {
  /**
   * Assuming "value" is not null or an empty string, return it formatted with thousands separators
   * @param {number} value
   */
  formatNumber(value) {
    return value === null ? '' : value === '' ? '' : numeral(value).format('0,0[.]0');
  },

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
    return colors[index >= colors.length ? '#212121' : index];
  }
};

// Install helpers as a Vue plugin
const helpersPlugin = {
  install() {
    Vue.helpers = helpers;
    Vue.prototype.$helpers = helpers;
  }
};

Vue.use(helpersPlugin);
