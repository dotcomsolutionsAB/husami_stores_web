import { CONFIG } from 'src/config-global';

import { DashboardView } from 'src/sections/dashboard/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Dashboard - ${CONFIG.appName}`}</title>
      <meta name="description" content="Inventory and Sales Management Application Dashboard" />
      <meta name="keywords" content="react,application,dashboard,admin,template,inventory,sales" />

      <DashboardView />
    </>
  );
}
