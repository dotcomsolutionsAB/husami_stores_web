import { FlatIcon } from 'src/components/flaticon';

// ----------------------------------------------------------------------

const icon = (name: string) => <FlatIcon icon={name} width={20} height={20} />;

export type NavItem = {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  info?: React.ReactNode;
  readOnly?: boolean;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('dashboard'),
  },
  {
    title: 'Pickup Slip',
    path: '/pickup-slip',
    icon: icon('memo-circle-check'),
  },
  {
    title: 'Pickup Cart',
    path: '/pickup-cart',
    icon: icon('person-dolly-empty'),
  },
  {
    title: 'Sales',
    readOnly: true,
  },
  {
    title: 'Quotation',
    path: '/quotation',
    icon: icon('comment-quote'),
  },
  {
    title: 'Performa Invoice',
    path: '/performa-invoice',
    icon: icon('document-signed'),
  },
  {
    title: 'Sales Order',
    path: '/sales-order',
    icon: icon('shopping-bag'),
  },
  {
    title: 'Sales Invoice',
    path: '/sales-invoice',
    icon: icon('file-invoice-dollar'),
  },
  {
    title: 'Purchase',
    readOnly: true,
  },
  {
    title: 'Book Order',
    path: '/book-order',
    icon: icon('book'),
  },
  {
    title: 'Purchase Order',
    path: '/purchase-order',
    icon: icon('shopping-cart'),
  },
  {
    title: 'GRN',
    path: '/grn',
    icon: icon('truck-side'),
  },
  {
    title: 'Purchase Invoice',
    path: '/purchase-invoice',
    icon: icon('receipt'),
  },
  {
    title: 'Masters',
    readOnly: true,
  },
  {
    title: 'Products',
    path: '/products',
    icon: icon('cube'),
  },
  {
    title: 'Clients',
    path: '/clients',
    icon: icon('handshake'),
  },
  {
    title: 'Suppliers',
    path: '/suppliers',
    icon: icon('briefcase'),
  },
  {
    title: 'Users',
    path: '/users',
    icon: icon('users'),
  },
  {
    title: 'Utility',
    readOnly: true,
  },
  {
    title: 'Stock Transfer',
    path: '/stock-transfer',
    icon: icon('exchange'),
  },
  {
    title: 'Logs',
    path: '/logs',
    icon: icon('time-past'),
  },
];
