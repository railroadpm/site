/*
  rrpm-netlify-forms.js

    Custom Netlify CMS forms/inputs logic for RailroadPM Admin site.
*/

// Selectors
const inputs = {
  revisionsToggle: 'div[data-field="Revisions"] span[role="switch"]',
  revisionMarkExpiration: 'div[data-field="RevisionMarkExpiration"] input'
};

// Calendar math components
const DateTime = luxon.DateTime;
const Duration = luxon.Duration;

// DOM Ready
$(() => {
  // console.log('jQuery... DOM Ready!');

  // Handle click on Revisions Toggle
  $(document).on('click', inputs.revisionsToggle, function(event) {
    let $toggle = $(this);
    let $exp = $(inputs.revisionMarkExpiration);

    let newToggleVal = $toggle.attr('aria-checked') === 'true';
    let currentExpVal = $exp.val();

    // console.log(`Revisions Toggle Clicked! New toggle val: ${newToggleVal}, Exp val currently: "${currentExpVal}"`);

    if (newToggleVal === false) {
      $exp.val('');
    } else {
      if (!currentExpVal) {
        let currentDT = DateTime.local();
        let spanOneDay = Duration.fromObject({ days: 1 });
        let spanSixDays = Duration.fromObject({ days: 6 });

        // Wait at least 6 days before expiring the revision mark
        let minExpDT = currentDT.plus(spanSixDays);
        let wedExpDT = minExpDT;

        // Default expiration to the Wednesday at least 6 days from today
        while (wedExpDT.weekday != 3) wedExpDT = wedExpDT.plus(spanOneDay);

        $exp.val(wedExpDT.toFormat('yyyyMMdd'));
      }
    }
  });
});
