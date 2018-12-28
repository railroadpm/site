/*
  rrpm-netlify-rbac.js

    Custom RBAC implementation on Netlify CMS for RailroadPM Admin site. This is an "informal" RBAC
    implementation at the UI level only, which could be easily defeated by anyone with basic knowledge of
    HTML and CSS.

    We simply hook into the Netlify Identity init and login events to tweak the UI based on the user's role(s).

    Global Variables
    ----------------
    window.ncDefaultCollectionName:
      The default collection depends on user role. We set this variable to the name of the collection
      that the CMS (React) code should consider the default.

    window.ncDisableInputsByName:
      If this variable is set, the CMS will render the "disabled" attribute on inputs corresponding to
      collection fields whose "name" (in config.yml) contains the string value of this variable (case sensitive)
*/
const FAKE_LOGIN = false; // Must be set to false for production

const rrpmAuth = window.netlifyIdentity;
if (rrpmAuth) {
  console.log('>>> Netlify Identity: Available');

  try {
    if (FAKE_LOGIN) {
      loginFakeUser();
    } else {
      rrpmAuth.on('error', err => console.error('>>> Netlify Identity', err));
      rrpmAuth.on('init', initRBAC);
    }
  } catch (e1) {
    console.log('>>> Netlify Identity: Initialization Error', e1);
  }
}

function loginFakeUser() {
  let fakeUser = { app_metadata: { roles: ['Administrator'] } };
  // let fakeUser = { app_metadata: { roles: ['Participant', 'BNSF'] } };
  // let fakeUser = { app_metadata: { roles: ['Participant', 'CN'] } };
  // let fakeUser = { app_metadata: { roles: ['Participant'] } };

  initRBAC(fakeUser);
}

function initRBAC(user) {
  console.log(`>>> Netlify Identity: In${FAKE_LOGIN ? ' (Fake)' : ''} Init Event Handler`);

  try {
    // console.log('>>> Netlify Identity: User', user);

    if (!user) {
      rrpmAuth.on('login', () => {
        console.log('>>> Netlify Identity: In Login Event Handler');
        document.location.href = '/';
      });
    } else {
      // console.log(`>>> Netlify Identity: ${FAKE_LOGIN ? '(Fake) ' : ''}User Is Logged In`, JSON.stringify(user));
      let ncRootElt = document.getElementById('nc-root');

      if (user.app_metadata && user.app_metadata.roles && ncRootElt) {
        const roles = user.app_metadata.roles;

        if (roles.includes('Administrator')) {
          ncRootElt.classList.add('nc-user-role-is-admin');
          ncRootElt.classList.add('nc-user-role-is-aor');
          window.ncDefaultCollectionName = 'reports_bnsf';
          document.location.href = '/#/collections/reports_bnsf';
        } else {
          ncRootElt.classList.add('nc-user-role-is-participant');
          window.ncDisableInputsByName = 'CarsOnLine';

          if (roles.includes('BNSF')) initRBACForRole(ncRootElt, 'BNSF');
          else if (roles.includes('CN')) initRBACForRole(ncRootElt, 'CN');
          else if (roles.includes('KCS')) initRBACForRole(ncRootElt, 'KCS');
          else if (roles.includes('NS')) initRBACForRole(ncRootElt, 'NS');
          else if (roles.includes('UP')) initRBACForRole(ncRootElt, 'UP');
          else {
            // If we get here the user is not an Admin *or* a properly-configured Participant
            // so use some sane defaults and show a message
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
  } catch (e2) {
    console.log('>>> CMS RBAC Initialization Error', e2);
  }
}

function initRBACForRole(ncRootElt, role) {
  const lcRole = role.toLowerCase();
  ncRootElt.classList.add(`nc-user-role-is-${lcRole}`);
  window.ncDefaultCollectionName = `reports_${lcRole}`;
  document.location.href = `/#/collections/reports_${lcRole}`;
}
