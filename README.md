# RailroadPM.org 2.x Site

_Please refer to the [LICENSE](LICENSE) file for important Copyright information_.

<hr>

This README has sections for each of the potential roles of the person reading it. So depending on your interests in this site, simply locate the appropriate section(s) below for a targeted introduction along with links to further information.

## For Everyone

What's here? This repo contains the source code and data for a [Data Collection System](https://en.wikipedia.org/wiki/Data_collection_system), specifically a [Performance Measurement (PM) System](https://en.wikipedia.org/wiki/Data_collection_system#Types). What distinguishes this PM implementation is the fact that [its data is Git-based](https://headlesscms.org/about/).

It's very common for nonprofits and industry groups to [develop and deploy PM systems](https://en.wikipedia.org/wiki/Performance_measurement#In_the_nonprofit_and_voluntary_sector) to track and publish the success of their mission and activities, and to promote goodwill, accountability, process improvements, and better outcomes.

This project is about the U.S. freight rail industry. But even if that industry doesn't interest you, here are some of the key "selling points" and characteristics of this solution from a technical standpoint that should help you to decide if this codebase might work well for your use-case:

- Open, MIT-licensed source code
- Developed using a modern technology stack with plenty of software industry activity and support as of 2018
- Designed for **zero** operational cost in terms of infrastructure (deploy and operate on free cloud services... including a Read/Write [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_Web_services))
- Focused exclusively on the collection and publication of **quantitative** measures (numbers). In other words, this is the complete opposite of something like SurveyMonkey, which focuses largely on surveys with _qualitative_ measures.

## Web Developer

<details><summary>Details for Devs</summary>

Thanks for taking a detailed look at this Web App developed with [Vue.js](https://vuejs.org/), [Nuxt](https://nuxtjs.org/), [Vuetify](https://vuetifyjs.com/en/), and [Chart.js](http://www.chartjs.org/)!

Please note that this Web App is developed using Visual Studio Code (VSCode) and Chrome on Windows. The NPM scripts have only been tested in the Windows environment.

### Quick Start

There are three prerequisites for running and working with this codebase:

1. [Node.js](https://nodejs.org/en/download/) v10.13.0 or greater (LTS version as of Nov 2018)
1. [Yarn](https://yarnpkg.com/en/docs/install) v1.10.x or greater
1. [Hugo](https://gohugo.io/getting-started/installing/) v0.51 or greater

And of course, [VSCode](https://code.visualstudio.com/download) is highly recommended. So before proceeding be sure to install those pieces if you don't already have them.

This repo is organized as a ["monorepo"](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) containing multiple private sub-packages. But the complexity here doesn't rise to the point where something like [Lerna](https://github.com/lerna/lerna) is needed to help manage things. So to get started, just:

- [Clone](https://github.com/slathrop/git-scripts-win/blob/master/README.md) [this repo](https://github.com/railroadpm/site)
- Open a command prompt, and
- Change directory (cd) into your local clone folder and run:

```bash
yarn install-all
```

> Note that this is **not** the typical `npm install` or `yarn` command to get started. Instead, we wrap multiple invocations of `yarn` (`npm install`) in an `install-all` script (in lieu of doing something like [`lerna bootstrap`](https://github.com/lerna/lerna/tree/master/commands/bootstrap#readme)).

Then, launch VSCode:

```bash
code .
```

And finally in VSCode:

1. Accept the offer from VSCode to install the solution's recommended extensions

1. From the `Tasks` menu select `Run Task...` and launch the `all:dev` task. This will start:

   - The local Nuxt server for the front-end

   - The Hugo server for the API back-end, and

   - An instance of `live-server` to run the Admin site locally

The app should now be running on your local machine here: [http://localhost:3000](http://localhost:3000). The API will be running locally on port 1313. And the Admin site will be running on port 8080.

#### app.config.js

Note that in order to configure the app to use your local API server, you may need to change the `API_HOST` setting in `app/app.config.js`.

#### Admin Dev Ops

##### Local Dev Configuration

To run the Admin site locally you may wish to change the backend configuration in `admin/config.yml` from the `git-gateway` microservice to the local `test-repo`.

The `test-repo` setting simply tells Netlify CMS to work locally in memory in your browser instead of actually hitting GitHub. See [here](https://www.netlifycms.org/docs/authentication-backends/#test-repo-backend) for more information.

Here's a fragment from the `config.yml` file tweaked for local development. Basically, comment-out `git-gateway` and uncomment `test-repo` and `login: false`.

```yaml
backend:
  # name: git-gateway
  name: test-repo
  login: false
```

You'll also want to tweak the RBAC JavaScript code to fake a user login. So in `admin/rrpm-netlify-rbac.js`:

- Change the constant `FAKE_LOGIN` to `true`

  ```javascript
  const FAKE_LOGIN = true; // Must be set to false for production
  ```

- Change the contents of the `loginFakeUser` function based on the user role that you'd like to test

  ```javascript
  function loginFakeUser() {
    // Tweak fake user role here
  }
  ```

##### Netlify CMS Updates

The Admin site's `package.json` file lists a custom build of Netlify CMS as a dependency:

```json
  "dependencies": {
    "@rrpm/netlify-cms": "^2.2.37"
  }
```

To make changes to this custom Netlify CMS NPM package, see the details [here](https://github.com/railroadpm/rrpm-netlify-cms/blob/master/README.md#railroadpm-project-notes).

And then to update the reference to the package and properly install the updated JavaScript file in the Admin site:

1. From a command prompt, change your current working directory to the `/admin` folder of this repo

1. Run these commands:

   ```
   yarn install
   yarn build
   ```

### Browser Setup

Chrome is highly recommended during development. In Chrome, install:

1.  [Vue.js devtools extension](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en), and
1.  [Allow-Control-Allow-Origin: \* extension](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en).

    - Without this extension, when running the sites locally you may have problems accessing the API from the front-end due to [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). The local in-memory API server (Hugo) doesn't support custom HTTP response headers. But for deployment to Netlify, we [specify the necessary header configuration](https://github.com/railroadpm/site/blob/master/api/static/_headers).

### Starting From Scratch

As a web developer I always find it helpful to know how a project got started. So if you're interested in following the steps that were originally taken to create this solution from scratch, here are some of the details.

#### API

For the API piece it's about getting Hugo setup for serving primarily JSON instead of HTML.

<details><summary>Details</summary>

- From the root folder, I ran `hugo new site api`, which created the `api` subfolder
- In the `api` folder
  - Cleaned a bit, removing Hugo stuff we won't need: `archetypes`, `themes`, etc.
  - Tweaked Hugo's `config.toml` to eliminate RSS and sitemap stuff
  - Ran `npm init -y` to create an initial `package.json` so we can use NPM Scripts to control how Hugo does things
  - NPM Scripts configured to support commands:
    - `npm run dev` or `yarn dev` to run a local Hugo development server with live reload
    - `npm run build` or `yarn build` to do a quick, incremental build to `./dist`
    - `npm run build-full` or `yarn build-full` to do a full build, cleaning the `./dist` folder
- Logged-in to [app.netlify.com](https://app.netlify.com) with my GitHub credentials and clicked "New site from Git"
  - Under "Continuous Deployment" selected GitHub and then clicked "Authorize netlify"
  - Under "Create a new site" selected this repo
  - Configured `master` branch to deploy, set "Build command" to `cd api && npm install && npm run build` and "Publish directory" to `api/dist`
  - Clicked "Deploy site"
  - Configured subdomain so that the site is hosted under Netlify at: https://api.rrpm.run/
  - Please see NOTE in [`netlify.toml`](https://github.com/railroadpm/site/blob/2785ba895fb1abd5afa4276b00eba55146bf8752/netlify.toml#L1) config file RE: setup as it is unique to this monorepo approach

</details>

#### App

For the frontend App I used [**create-nuxt-app**](https://github.com/nuxt-community/create-nuxt-app).

<details><summary>Details</summary>

- From this project's root folder, I ran `yarn create nuxt-app app` and entered/selected the following options
  - Project name: `aar-rpm-app`
  - Project description: RPM App
  - Use a custom server framework: none
  - Use a custom UI framework: vuetify
  - Choose rendering mode: Single Page App
  - Use axios module: yes
  - Use eslint: yes
  - Choose a package manager: npm
- `create-nuxt-app` initializes git in the `app` folder created. We don't need separate git tracking for this subfolder, so
  - Changed directory into _app_: `cd app`
  - Removed `.git` folder: `rd /s /q .git` (on Windows)
- `create-nuxt-app` had some outdated dependencies listed in the generated `package.json`, so updated to
  - `"nuxt": "^1.4.1"`
  - `"vuetify": "^1.0.19"`
  - `"@nuxtjs/axios": "^5.3.1"`
- Ran `npm install`
- Changed the default app component style from `dark` to `light` in `app\layouts\default.vue` and the default progress bar color in `app\nuxt.config.js`
- Logged-in to [app.netlify.com](https://app.netlify.com) with my GitHub credentials and clicked "New site from Git"
  - Under "Continuous Deployment" selected GitHub and then clicked "Authorize netlify"
  - Under "Create a new site" selected this repo
  - Configured `master` branch to deploy, set "Build command" to `cd app && npm install && npm run generate` and "Publish directory" to `app/dist`
  - Clicked "Deploy site"
  - Configured subdomain so that site is hosted under Netlify at: https://app.rrpm.run/

</details>

#### Admin

The Admin piece is really just Netlify CMS and its configuration file. You can get started with Netlify CMS in several ways, and they are all [nicely documented by Netlify](https://www.netlifycms.org/docs/start-with-a-template/).

</details><!-- Web Developer -->

## Architect

<details><summary>Details for Architects</summary>

Thanks for your interest in the architecture of this [Performance Measurement (PM) System](https://en.wikipedia.org/wiki/Data_collection_system#Types).

### Concept

The _key architectural concept_ for this solution is:

> Perform all server-side logic at **build-time**, not at **run-time**!

In other words, the approach here is to eliminate all run-time server processing found in the heavier, monolithic web solution stacks/frameworks such as Java Spring, ASP.NET, Ruby on Rails, and Laravel.

Those solutions typically build each page from scratch every time it is requested by a browser. And they typically do this by coordinating across multiple layers/servers such as load balancers, web servers, caching layers, data access layers, and databases.

In contrast this solution pre-builds responses using a free build server and then simply serves the resulting static sites from a CDN.

Changes to site content automatically kick-off a fresh build, which typically completes in milliseconds.

Any run-time logic required for things such as authentication is handled by cloud microservices whose uptime is managed by others (i.e., using a serverless approach).

Clearly the requirements of some web apps simply can't be adapted to this approach. For example, when website content is changing more frequently than say, by the minute, this approach likely wouldn't work.

### Details

This system uses a [Single-Page Application](https://en.wikipedia.org/wiki/Single-page_application) (SPA) architecture with:

- A [Vue.js](https://en.wikipedia.org/wiki/Vue.js) [JavaScript Framework](https://en.wikipedia.org/wiki/Single-page_application#JavaScript_frameworks) front-end using

  - The [Nuxt.js](https://nuxtjs.org/guide#single-page-applications-spa-) application framework for its

    - Basic SPA application organization and convention-based directory structure

    - Routing

    - Layouts/Pages/Components model for composing views/pages

    - Integration with the [Vuex state management library](https://vuex.vuejs.org/#what-is-vuex)

    - [Webpack build](https://nuxtjs.org/guide/assets#webpacked) with code splitting, etc.

  - The [Vuetify component framework](https://vuetifyjs.com/en/) for

    - A [Google Material Design](https://material.io/)-based visual system, and

    - A ready-made, mature, and well-documented set of Vue.js components such as [Toolbars, Menus, Buttons, Tables](https://vuetifyjs.com/en/components/data-tables), etc.

  - [Chart.js](https://www.chartjs.org/) for graphs

- A serverless/microservices back-end comprised of:

  - A data-reading REST API based on

    - A [JAMstack](https://youtu.be/uWTMEDEPw8c) approach (see also [here](https://youtu.be/Y8PXMbr0Kqo)) for build-time static generation of JSON responses

    - Using the [Hugo static content generator](https://gohugo.io), and

    - Hosted on the Netlify static CDN

  - A [data-writing microservice](https://www.netlify.com/docs/git-gateway/) with [stateless JWT-based auth](https://en.wikipedia.org/wiki/JSON_Web_Token) using the [Netlify Identity service](https://www.netlify.com/docs/identity/) that

    - Proxies and gateways writes to a GitHub repository of flat files, and

    - Re-builds the data-reading REST API via a Netlify build trigger on the GitHub repo

- A data collection/administration portal

  - Based on a [custom build](https://github.com/railroadpm/rrpm-netlify-cms) (and [published NPM package](https://www.npmjs.com/package/@rrpm/netlify-cms)) of the React-based, Git-backed [Netlify CMS](https://www.netlifycms.org) open source content management system

  - Which is also a SPA hosted on the Netlify static CDN

  - Also using the [Netlify Identity service](https://www.netlify.com/docs/identity/) for auth

The three main bullets above are referred to in the solution architecture as the **App**, the **API**, and the **Admin** site respectively. And there are top-level folders in this source code repo that correspond to these pieces of the solution.

</details><!-- Architect -->
