import { FlatIcon } from 'src/components/flaticon';

import type { AccountPopoverProps } from './components/account-popover';

// ----------------------------------------------------------------------

export const _account: AccountPopoverProps['data'] = [
  {
    label: 'Home',
    href: '/',
    icon: <FlatIcon icon="home" width={22} />,
  },
  {
    label: 'Profile',
    href: '#',
    icon: <FlatIcon icon="user" width={22} />,
  },
  {
    label: 'Settings',
    href: '#',
    icon: <FlatIcon icon="settings" width={22} />,
  },
];
