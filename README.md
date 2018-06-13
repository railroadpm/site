# RailroadPM.org 2.0 Site - Under Construction

_Please refer to the [LICENSE](LICENSE) file for important Copyright information_.

<hr>

This README has sections for each of the potential roles of the person reading it. So depending on your interests in this site, simply locate the appropriate section(s) below for a targeted introduction along with links to further information.

## For Everyone

What's here? This repo contains the source code and data for a [Data Collection System](https://en.wikipedia.org/wiki/Data_collection_system), specifically a [Performance Measurement (PM) System](https://en.wikipedia.org/wiki/Data_collection_system#Types).

It's very common for nonprofits and industry groups to [develop and deploy PM systems](https://en.wikipedia.org/wiki/Performance_measurement#In_the_nonprofit_and_voluntary_sector) to track and publish the success of their mission and activities, and to promote goodwill, accountability, process improvements, and better outcomes.

This project is about the U.S. freight rail industry. But even if that industry doesn't interest you, here are some of the key "selling points" and characteristics of this solution from a technical standpoint that should help you to decide if this codebase might work well for your use-case:

- Open, MIT-licensed source code
- Developed using a modern technology stack with plenty of software industry activity and interest as of 2018
- Designed for **zero** operational cost in terms of infrastructure (deploy and operate on free cloud services)
- Focused on collection and publication of purely **quantitative** measures (numbers). In other words, the complete opposite of something like SurveyMoney, which focuses largely on surveys with _qualitative_ measures.

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

Coming Soon!
