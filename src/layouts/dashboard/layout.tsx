import { SidebarProvider } from './sidebar-context';
import { DashboardLayoutContent } from './layout-content';

import type { DashboardLayoutContentProps } from './layout-content';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = DashboardLayoutContentProps;

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent
        sx={sx}
        cssVars={cssVars}
        children={children}
        slotProps={slotProps}
        layoutQuery={layoutQuery}
      />
    </SidebarProvider>
  );
}
