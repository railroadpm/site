// csv-files.js: Generate CSV files from JSON data rows that are built by Hugo
const path = require('path');
const fs = require('fs');
const scriptName = path.basename(__filename);
const json2csv = require('json2csv').parse;
const csvHeaders = require('../build-scripts/csv-common-headers.json');
const railroads = require('../dist/railroads/all/get.json').data.railroads;
const _ = require('lodash');
const { DateTime } = require('luxon');

console.log(`\n\nRunning build script: ${scriptName}`);
console.log(`Railroads count = ${railroads.length}`);

// Iterate over both report periods and over all railroads, deleting any existing CSV files
// and generating the new ones
['current', 'all'].forEach(period => {
  railroads.forEach(rr => {
    const requireBasePath = `../dist/reports/${rr.Key.toLowerCase()}/${period}/get`;
    const fsBasePath = `dist/reports/${rr.Key.toLowerCase()}/${period}/get`;
    const jsonFilePath = `${requireBasePath}.json`;
    const csvFilePath = `${fsBasePath}.csv`;

    try {
      // Delete any existing CSV file
      fs.unlinkSync(csvFilePath);
      // console.log(`successfully deleted ${csvFilePath}`);
    } catch (e1) {
      // console.log(`Existing file not found: ${csvFilePath}`);
    }

    try {
      // Get the JSON data
      const rawReportRows = require(jsonFilePath).data.rows;
      // console.log(`Found ${reportRows.length} report rows to convert for ${rr.Key} ${period} report`);

      // Transform raw rows into final form for consumption
      let finalReportRows = humanizeReport(rawReportRows);

      // Convert to CSV
      let csv = json2csv(finalReportRows);
      // console.log(`CSV data string generated for ${rr.Key} ${period} report`);

      // Add header rows to CSV
      let allHeaders = '';
      csvHeaders.forEach(header => {
        allHeaders += header + '\n';
      });
      allHeaders += `"${rr.ShortName} - ${csvSubtitleFromPeriod(period)}"\n`;
      csv = allHeaders + csv;

      // Write CSV file
      fs.writeFileSync(csvFilePath, csv, { flag: 'w+' });
      console.log(`CSV data written to ${csvFilePath}`);
    } catch (e3) {
      console.log(e3);
    }
  });
});

process.exit(0);

function csvSubtitleFromPeriod(period) {
  switch (period) {
    case 'current':
      return 'Current Trends';
    case 'all':
      return '53 Week History';
    default:
      return '';
  }
}

function humanizeReport(rows) {
  return _(rows)
    .map(row => _.pickBy(row, (val, key) => !isNaN(key) || key === 'rowLabel')) // Only rowLabel and week columns needed
    .map(row => _.mapKeys(row, (val, key) => (isNaN(key) ? '10000001' : key))) // rowLabel column temporary rename for sorting 1st
    .map(row =>
      _(row)
        .toPairs()
        .sortBy(0)
        .fromPairs()
        .value()
    )
    .map(row =>
      _(row)
        .mapKeys((val, key) => (key === '10000001' ? 'Measure' : DateTime.fromISO(key).toLocaleString())) // Now final label (Measure) column rename
        .mapValues((val, key) => (key === 'Measure' ? val.replace(/&nbsp;/gi, ' ').replace(/<\/?[\w\s="/.':;#-\/\?]+>/gi, '') : val)) // Remove/replace markup
        .value()
    )
    .value();
}
