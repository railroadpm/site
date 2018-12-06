/*
  rrpm-netlify-rbac.js

    Custom RBAC implementation on Netlify CMS for RailroadPM Admin site. This is an "informal" RBAC
    implementation at the UI level only, which could be easily defeated by anyone with basic knowledge of
    HTML and CSS.

    We simply hook into Netlify init and login events to tweak the UI based on the user's role(s).

    Global Variables
    ----------------
    window.ncDefaultCollectionName:
      The default collection depends on user role. We set this variable to the name of the collection
      that the CMS (React) code should consider the default.

    window.ncDisableInputsByName:
      If this variable is set, the CMS will render the "disabled" attribute on inputs corresponding to
      collection fields whose "name" (in config.yml) contains the string value of this variable (case sensitive)
*/
if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', function(user) {
    // let testUser = { app_metadata: { roles: ['Participant'] } };
    // let testUser = { app_metadata: { roles: ['Administrator'] } };
    // let testUser = { app_metadata: { roles: ['BNSF'] } };
    // let testUser = { app_metadata: { roles: ['CN'] } };

    // console.log('>>> Netlify Identity: In Init Event Handler', user);

    if (!user && typeof testUser === 'undefined') {
      window.netlifyIdentity.on('login', function() {
        // console.log('>>> Netlify Identity: In Login Event Handler');
        document.location.href = '/';
      });
    } else {
      if (typeof testUser != 'undefined') user = testUser;
      // console.log('>>> Netlify Identity: User Is Logged In', JSON.stringify(user));
      let ncRoot = document.getElementById('nc-root');

      if (user.app_metadata && user.app_metadata.roles && ncRoot) {
        const roles = user.app_metadata.roles;

        if (roles.includes('Administrator')) {
          ncRoot.classList.add('nc-user-role-is-admin');
          ncRoot.classList.add('nc-user-role-is-aor');
          window.ncDefaultCollectionName = 'reports_bnsf';
          document.location.href = '/#/collections/reports_bnsf';
        } else {
          ncRoot.classList.add('nc-user-role-is-participant');
          window.ncDisableInputsByName = 'CarsOnLine';

          if (roles.includes('BNSF')) initCmsForRole(ncRoot, 'BNSF');
          else if (roles.includes('CN')) initCmsForRole(ncRoot, 'CN');
          else if (roles.includes('KCS')) initCmsForRole(ncRoot, 'KCS');
          else if (roles.includes('NS')) initCmsForRole(ncRoot, 'NS');
          else if (roles.includes('UP')) initCmsForRole(ncRoot, 'UP');
          else {
            window.ncDefaultCollectionName = 'reports_bnsf';
            document.location.href = '/#/collections/reports_bnsf';

            setTimeout(() => {
              let ncSidebarHeading = document.getElementsByClassName('nc-app-sidebar-heading')[0];

              if (ncSidebarHeading) {
                // eslint-disable-next-line
                ncSidebarHeading.innerText = "You don't have access to any Reports. Please contact AAR to request access.";
                ncSidebarHeading.setAttribute('style', 'font-size: 15px; color: red;');
                ncSidebarHeading.parentElement.setAttribute('style', 'width: 320px;');
              }
            }, 2000);
          }
        }
      }
    }
  });
}

function initCmsForRole(ncRoot, role) {
  const lcRole = role.toLowerCase();
  ncRoot.classList.add(`nc-user-role-is-${lcRole}`);
  window.ncDefaultCollectionName = `reports_${lcRole}`;
  document.location.href = `/#/collections/reports_${lcRole}`;
}
