# RailroadPM.org 2.0 Site - Under Construction

_Please refer to the [LICENSE](LICENSE) file for important Copyright information_.

<hr>

This README has sections that are specific to each of the potential roles of the person reading it. So depending on your interests in this site, simply locate the appropriate section(s) below for a targeted introduction along with links to further information.

## Everyone

This repo contains and source code and data for a [Data Collection System](https://en.wikipedia.org/wiki/Data_collection_system), specifically a [Performance Measurement System](https://en.wikipedia.org/wiki/Data_collection_system#Types).

## Web Developer

Thanks for taking a detailed look at this Web App developed with Vue.js, Nuxt, and Vuetify!

Please note that this Web App is developed using Visual Studio Code (VSCode) on Windows. The NPM scripts have only been tested in the Windows environment.

### Quick Start

This repo is organized as a "mono repo" containing multiple private sub-packages. So to get started, just clone this repo and then run:

```bash
npm run install-all
```

> Note that this is **not** the typical `npm install` command to get started. Instead, we wrap multiple invocations of `npm install` in an `install-all` script.

Then, launch VSCode:

```bash
code .
```

And finally in VSCode, from the `Tasks` menu select `Run Task...` and launch the `all:dev` task. This will start the local Nuxt server for the front-end and the Hugo server for the API back-end.

The app should now be running on your local machine here: [http://localhost:3000](http://localhost:3000).

### Architecture

TODO
