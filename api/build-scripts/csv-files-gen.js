// csv-files-gen.js: Generate CSV files from JSON data rows that are built by Hugo

const path = require('path');
const fs = require('fs');
const scriptName = path.basename(__filename);
const json2csv = require('json2csv').parse;
const csvVerbiageRows = require('./csv-common-verbiage.json');
const railroads = require('../dist/railroads/all/get.json').data.railroads;
const _ = require('lodash');
const { DateTime } = require('luxon');

console.log(`\n\nRunning post-Hugo build script: ${scriptName}`);
// console.log(`Railroads count = ${railroads.length}`);

// Iterate over both of the report period segments and over all railroads,
// deleting any existing CSV files and generating the new ones
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
      const rawReportData = require(jsonFilePath).data;
      const rawReportRows = rawReportData.rows;
      const rawReportAvgCols = rawReportData.avgColumns;
      // console.log(`Found ${reportRows.length} report rows to convert for ${rr.Key} ${period} report`);

      // Transform raw rows into final form for consumption
      let finalReportRows = humanizeReport(rawReportRows, rawReportAvgCols);

      // Convert to CSV
      let csv = json2csv(finalReportRows);
      // console.log(`CSV data string generated for ${rr.Key} ${period} report`);

      // Add common verbiage rows to CSV (above the column headers)
      let allVerbiageRows = '';
      csvVerbiageRows.forEach(row => {
        allVerbiageRows += row + '\n';
      });
      allVerbiageRows += `"${rr.ShortName} - ${csvSubtitleFromPeriod(period)}"\n`;
      csv = allVerbiageRows + csv;

      // Write CSV file
      fs.writeFileSync(csvFilePath, csv, { flag: 'w+' });
      console.log(`CSV data written to ${csvFilePath}`);
    } catch (e3) {
      console.log(e3);
    }
  });
});

// Main flow of execution for script ends here
process.exit(0);

// region Helper Functions
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

function humanizeReport(rows, avgCols) {
  let labelAndAvgCols = ['rowLabel'];
  let labelAndAvgColsWithSortKey = [{ key: 'rowLabel', sortKey: '10000001' }];

  // Use "avgCols" param, if supplied, to keep "Historic Averages" columns in final result for "Current" period
  if (avgCols) {
    avgCols.forEach(col => labelAndAvgCols.push(col.key));
    labelAndAvgColsWithSortKey = _(labelAndAvgCols)
      .map((val, index) => ({ key: val, sortKey: (index + 10000001).toString() }))
      .value();
  }

  return _(rows)
    .map(row => _.pickBy(row, (val, key) => !isNaN(key) || labelAndAvgCols.includes(key))) // Only week, label, and avg (for "Current") cols needed
    .map(row => _.mapKeys(row, (val, key) => (isNaN(key) ? sortKeyFromKey(labelAndAvgColsWithSortKey, key) : key))) // Temporary col rename for sorting
    .map(row =>
      _(row)
        .toPairs()
        .sortBy(0) // Now we can simply sort by each array element 0, which was the object key
        .fromPairs()
        .value()
    )
    .map(row =>
      _(row)
        .mapKeys((val, key) => (+key < 10000100 ? keyFromSortKey(labelAndAvgColsWithSortKey, key) : DateTime.fromISO(key).toLocaleString())) // Sort Key column rename
        .mapKeys((val, key) => (key === 'rowLabel' ? 'Measure' : key)) // rowLabel column rename
        .mapValues((val, key) => sanitizeValue(val, key)) // Remove/replace commas, markup, etc.
        .value()
    )
    .value();
}

function sortKeyFromKey(labelAndAvgColsWithSortKey, key) {
  return _(labelAndAvgColsWithSortKey).find({ key }).sortKey;
}

function keyFromSortKey(labelAndAvgColsWithSortKey, sortKey) {
  return _(labelAndAvgColsWithSortKey).find({ sortKey }).key;
}

function sanitizeValue(val, key) {
  if (key === 'Measure') return val.replace(/&nbsp;/gi, ' ').replace(/<\/?[\w\s="/.':;#-\/\?]+>/gi, '');

  if (typeof val === 'string') {
    val = val.replace(',', '');
    if (val.length === 0) return val;
    if (!isNaN(val)) return +val;
  }

  return val;
}
// endregion
