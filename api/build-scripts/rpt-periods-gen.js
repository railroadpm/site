// rpt-periods-gen.js: Generate the key "Time Dimension" lookup data file (/api/data/Dimensions/Period.json) that drives *everything* else about the RPM site

const path = require('path');
const fs = require('fs');
const scriptName = path.basename(__filename);
const { DateTime } = require('luxon');

console.log(`\n\nRunning build script: ${scriptName}`);

let buildDT = DateTime.local();
console.log(`Build machine is in ${buildDT.zoneName} where the current DateTime is: ${buildDT.toString()}`);

let easternDT = buildDT.setZone('America/New_York');
console.log(`Eastern Time (in ${easternDT.zoneName}) is: ${easternDT.toString()}`);

// Main flow of execution for script ends here
process.exit(0);

// region Helper Functions
// endregion
