const pkg = require('./package');
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'spa',

  /*
   ** Headers of the page
   */
  head: {
    title: 'RPM', // pkg.description,
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [
      {
        rel: 'preconnect',
        href: 'https://api.rrpm.run'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com'
      },
      {
        rel: 'icon',
        type: 'image/jpg',
        href: '/favicon-rpm-32x32.jpg'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#ffcc80' // orange lighten-3
  },

  /*
   ** Global CSS
   */
  css: ['vuetify/src/stylus/main.styl'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/vuetify', '@/plugins/vue-markdown', { src: '@plugins/vue-chartjs', ssr: false }, { src: '@/plugins/helpers', ssr: false }],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  // Call out dynamic routes for rendering during "nuxt generate"
  generate: {
    routes: [
      '/reports/BNSF/',
      '/reports/CN/',
      '/reports/KCS/',
      '/reports/NS/',
      '/reports/UP/',
      '/reports/AOR/',
      '/graphs/CarsOnLine/',
      '/graphs/TerminalDwell/',
      '/graphs/TrainSpeed/'
    ]
  },

  /*
   ** Build configuration
   */
  build: {
    vendor: [
      'babel-polyfill', // Required for IE11 support
      'numeral',
      'vue-markdown',
      'lodash',
      'luxon'
    ],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.devtool = '#source-map';
        // Run ESLint on save
        //   config.module.rules.push({
        //     enforce: 'pre',
        //     test: /\.(js|vue)$/,
        //     loader: 'eslint-loader',
        //     exclude: /(node_modules)/
        //   });
      }
      if (ctx.isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ];
      }
      // Uglify and strip console.log in production
      if (!ctx.isDev) {
        config.plugins.push(
          new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                drop_console: true
              }
            }
          })
        );
      }
    }
  }
};
