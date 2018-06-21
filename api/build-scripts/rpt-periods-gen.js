// rpt-periods-gen.js: Generate the key "Time Dimension" lookup data file (/api/data/Dimensions/Period.json) that drives *everything* else about the RPM site

const path = require('path');
const fs = require('fs');
const scriptName = path.basename(__filename);
const { DateTime, Duration } = require('luxon');

console.log(`\n\nRunning build script: ${scriptName}`);

let buildDT = DateTime.local();
console.log(`Build machine is in ${buildDT.zoneName} where the current DateTime is: ${buildDT.toString()}`);

let easternDT = buildDT.setZone('America/New_York');
console.log(`Eastern Time (in ${easternDT.zoneName}) is: ${easternDT.toString()}`);

console.log('In Eastern Time...');
let dayNum = easternDT.weekday;
let dayAbbr = easternDT.toFormat('ccc');
let hourNum = easternDT.hour;
let minuteNum = easternDT.minute;
console.log(`\t...the current day is ${dayAbbr}, day number ${dayNum} (${typeof dayNum}) (Mon = 1)`);
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

console.log(`\t...the latest published RPM reporting period date should be ${latestRptPeriod.toFormat('MM/dd/yy')}`);

let spanOneWeek = Duration.fromObject({ weeks: 1 });

// All 53 weeks...
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

console.log(JSON.stringify(rptPeriods));

// Main flow of execution for script ends here
process.exit(0);

// region Helper Functions
// endregion
