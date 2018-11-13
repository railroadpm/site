// rpt-periods-gen.js: Generate the key "Time Dimension" lookup data file (/api/data/Dimensions/Period.json) that drives *everything* else about the RPM site
const path = require('path');
const fs = require('fs');
const buildConfig = require('./config.json');
const scriptName = path.basename(__filename);
const { DateTime, Duration } = require('luxon');

console.log(`\n\nRunning pre-Hugo build script: ${scriptName}`);

let buildDT = DateTime.local();
console.log(`Build machine is in ${buildDT.zoneName} where the current DateTime is: ${buildDT.toString()}`);

let easternDT = null;
// We support pinning the DateTime of the build to a specific, fake DateTime for testing or delaying publication
if (buildConfig.pinnedBuildDateTime) {
  easternDT = DateTime.fromISO(buildConfig.pinnedBuildDateTime).setZone('America/New_York');
} else {
  easternDT = buildDT.setZone('America/New_York');
}

console.log(`Eastern Time (in ${easternDT.zoneName}) is: ${easternDT.toString()}${buildConfig.pinnedBuildDateTime ? ' (pinned)' : ''}`);

console.log('In Eastern Time...');
let dayNum = easternDT.weekday;
let dayAbbr = easternDT.toFormat('ccc');
let hourNum = easternDT.hour;
let minuteNum = easternDT.minute;
console.log(`\t...the current day is ${dayAbbr}`);
console.log(`\t...the current hour is ${hourNum} and minute is ${minuteNum}`);

let latestRptPeriod = null;
let spanToOneFriday = Duration.fromObject({ days: dayNum + 2 });
let spanToTwoFridays = Duration.fromObject({ weeks: 1, days: dayNum + 2 });

if (dayNum > 3 || (dayNum === 3 && (hourNum > 13 || (hourNum === 13 && minuteNum > 55)))) {
  // After Wednesday at 1:55pm
  console.log('\t...it is *after* Wednesday at 1:55pm');
  latestRptPeriod = easternDT.minus(spanToOneFriday);
} else {
  // Before Wednesday at 1:55pm
  console.log('\t...it is *before* Wednesday at 1:55pm');
  latestRptPeriod = easternDT.minus(spanToTwoFridays);
}

console.log(`\t...the latest published RPM reporting period date should now be ${latestRptPeriod.toFormat('MM/dd/yy')}`);

// All 53 weeks...
let spanOneWeek = Duration.fromObject({ weeks: 1 });
let rptPeriod = latestRptPeriod;
let rptPeriods = { Quarter: { Current: '', Previous: '' }, Month: { Current: '', Previous: '' }, Week: [] };
for (weekNum = 1; weekNum <= 53; weekNum++) {
  let week = {
    Key: rptPeriod.toFormat('yyyyMMdd'),
    Day: rptPeriod.toFormat('MM/dd/yy'),
    Month: `${rptPeriod.toFormat('MMM')} ${rptPeriod.year}`,
    Qtr: `${rptPeriod.quarter}Q${rptPeriod.toFormat('yy')}`
  };
  rptPeriods.Week.push(week);
  rptPeriod = rptPeriod.minus(spanOneWeek);
}

// Current Quarter and Month
rptPeriods.Quarter.Current = `${easternDT.quarter}Q${easternDT.toFormat('yy')}`;
rptPeriods.Month.Current = `${easternDT.toFormat('MMM')} ${easternDT.year}`;

// Previous Quarter and Month
rptPeriods.Quarter.Previous = `${easternDT.minus({ quarters: 1 }).quarter}Q${easternDT.minus({ quarters: 1 }).toFormat('yy')}`;
rptPeriods.Month.Previous = `${easternDT.minus({ months: 1 }).toFormat('MMM')} ${easternDT.minus({ months: 1 }).year}`;

// console.log(JSON.stringify(rptPeriods));

const fsBaseDataPath = 'data/Dimensions/';
const fsBaseStaticPath = 'static/dimensions/periods/';
const jsonDataFilePath = `${fsBaseDataPath}Period.json`;
const jsonStaticFilePath = `${fsBaseStaticPath}get.json`;

try {
  // Delete any existing JSON data file
  fs.unlinkSync(jsonDataFilePath);
  // console.log(`successfully deleted ${jsonDataFilePath}`);
} catch (e1) {
  // console.log(`Existing file not found: ${jsonDataFilePath}`);
}

try {
  // Delete any existing JSON static file
  fs.unlinkSync(jsonStaticFilePath);
  // console.log(`successfully deleted ${jsonStaticFilePath}`);
} catch (e2) {
  // console.log(`Existing file not found: ${jsonStaticFilePath}`);
}

try {
  json = JSON.stringify(rptPeriods);

  // Write JSON file to Hugo data folder
  fs.writeFileSync(jsonDataFilePath, json, { flag: 'w+' });
  console.log(`\nJSON report periods data written to ${jsonDataFilePath}`);

  // Write JSON file to static folder for publishing to dist
  fs.writeFileSync(jsonStaticFilePath, json, { flag: 'w+' });
  console.log(`\t...and to ${jsonStaticFilePath}`);
} catch (e3) {
  console.log(e3);
}

// Main flow of execution for script ends here
process.exit(0);
