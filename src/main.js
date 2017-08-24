import {AureliaConfiguration} from "aurelia-configuration"
// we want font-awesome to load as soon as possible to show the fa-spinner
import 'font-awesome/css/font-awesome.css';
import './assets/styles/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import 'material-design-lite/material';
// comment out if you don't want a Promise polyfill (remove also from webpack.common.js)
import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });



export async function configure(aurelia) {
  aurelia.use
  .developmentLogging()
  .standardConfiguration()
  .history()
  .router()
  .eventAggregator()
  .feature('components')
  .feature('valueConverters')
  .feature('assets')
  .plugin('aurelia-mdl-plugin')
  .plugin('aurelia-configuration')

  // Uncomment the line below to enable animation.
  aurelia.use.plugin('aurelia-animator-css');
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin('aurelia-html-import-template-loader')

  aurelia.start().then(a => a.setRoot('app.js'))

  // if you would like your website to work offline (Service Worker),
  // install and enable the @easy-webpack/config-offline package in webpack.config.js and uncomment the following code:
  /*
  const offline = await System.import('offline-plugin/runtime');
  offline.install();
  */
}