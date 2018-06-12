// csv-files.js: Generate CSV files from JSON data rows that are built by Hugo
const path = require('path');
const fs = require('fs');
const scriptName = path.basename(__filename);
const json2csv = require('json2csv').parse;
const railroads = require('../dist/railroads/all/get.json').data.railroads;

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
      console.log(`successfully deleted ${csvFilePath}`);
    } catch (e1) {
      console.log(`Existing file not found: ${csvFilePath}`);
    }

    try {
      // Get the JSON data
      const reportRows = require(jsonFilePath).data.rows;
      console.log(`Found ${reportRows.length} report rows to convert for ${rr.Key} ${period} report`);

      // Convert to CSV
      const csv = json2csv(reportRows);
      console.log(`CSV data string generated for ${rr.Key} ${period} report`);

      // Write CSV file
      fs.writeFileSync(csvFilePath, csv, { flag: 'w+' });
      console.log(`CSV data written to ${csvFilePath}`);
    } catch (e3) {
      console.log(e3);
    }
  });
});

process.exit(0);
