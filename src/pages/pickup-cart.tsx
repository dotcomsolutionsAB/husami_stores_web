import { CONFIG } from 'src/config-global';

import { PickupCartView } from 'src/sections/pickup-cart/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Pickup Cart - ${CONFIG.appName}`}</title>

      <PickupCartView />
    </>
  );
}
