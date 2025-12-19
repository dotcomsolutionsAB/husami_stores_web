import { SidebarProvider } from './sidebar-context';
import { MainLayoutContent } from './layout-content';

import type { MainLayoutContentProps } from './layout-content';

// ----------------------------------------------------------------------

export type MainLayoutProps = MainLayoutContentProps;

export function MainLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
}: MainLayoutProps) {
  return (
    <SidebarProvider>
      <MainLayoutContent
        sx={sx}
        cssVars={cssVars}
        children={children}
        slotProps={slotProps}
        layoutQuery={layoutQuery}
      />
    </SidebarProvider>
  );
}
