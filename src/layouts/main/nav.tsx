import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { FlatIcon } from 'src/components/flaticon/flaticon';

import { useSidebarCollapse } from './sidebar-context';

import type { NavItem } from '../nav-config-main';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: NavItem[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();
  const { isCollapsed, toggleCollapse } = useSidebarCollapse();

  const collapsedWidth = '100px';
  const expandedWidth = 'var(--layout-nav-vertical-width)';
  const currentWidth = isCollapsed ? collapsedWidth : expandedWidth;

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: 'var(--layout-nav-zIndex)',
        width: currentWidth,
        transition: theme.transitions.create(['width', 'padding'], {
          easing: 'var(--layout-transition-easing)',
          duration: 'var(--layout-transition-duration)',
        }),
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
          top: 'var(--layout-header-desktop-height)',
        },
        ...sx,
      }}
    >
      <Box
        sx={{
          bgcolor: theme.vars.palette.background.paper,
          p: 1,
          height: `calc(100% - var(--layout-header-desktop-height) - 16px)`,
          borderRadius: 1.5,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Collapse/Expand Toggle Button */}
        <Box sx={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-end', mb: 2 }}>
          <Tooltip title={isCollapsed ? 'Expand' : 'Collapse'} placement="right">
            <IconButton
              size="small"
              onClick={toggleCollapse}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                },
              }}
            >
              {isCollapsed ? (
                <FlatIcon icon="settings-sliders" width={16} height={16} />
              ) : (
                <FlatIcon icon="angle-small-left" width={20} height={20} />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        <NavContent data={data} slots={slots} isCollapsed={isCollapsed} />
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({
  data,
  slots,
  sx,
  isCollapsed,
}: NavContentProps & { isCollapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <>
      {!isCollapsed && <Logo sx={{ display: { lg: 'none' }, mb: 2 }} />}

      {/* {!isCollapsed && slots?.topArea} */}

      <Scrollbar fillContent>
        <Box
          component="nav"
          sx={[
            {
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
              minHeight: '100%',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          <Box
            component="ul"
            sx={{
              gap: 0.5,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {data.map((item) => {
              const isActived = item.path === pathname;
              const isReadOnly = item.readOnly;

              if (isReadOnly) {
                // Hide readOnly headers when collapsed
                if (isCollapsed) {
                  return null;
                }
                // Render readOnly items as headers (non-clickable, black color)
                return (
                  <ListItem disableGutters disablePadding key={item.title} sx={{ mb: 1 }}>
                    <Box
                      sx={{
                        pl: 2,
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'fontWeightBold',
                        color: 'text.primary',
                      }}
                    >
                      {item.title}
                    </Box>
                  </ListItem>
                );
              }

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  {isCollapsed ? (
                    <Tooltip title={item.title} placement="right">
                      <ListItemButton
                        disableGutters
                        component={RouterLink}
                        href={item.path || '/'}
                        sx={[
                          (theme) => ({
                            pl: 1,
                            py: 1,
                            pr: 1,
                            borderRadius: 0.75,
                            minHeight: 44,
                            minWidth: 44,
                            justifyContent: 'center',
                            color: theme.vars.palette.text.secondary,
                            ...(isActived && {
                              fontWeight: 'fontWeightSemiBold',
                              color: theme.vars.palette.primary.main,
                              bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                              '&:hover': {
                                bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
                              },
                            }),
                          }),
                        ]}
                      >
                        <Box component="span" sx={{ width: 24, height: 24, display: 'flex' }}>
                          {item.icon}
                        </Box>
                      </ListItemButton>
                    </Tooltip>
                  ) : (
                    <ListItemButton
                      disableGutters
                      component={RouterLink}
                      href={item.path || '/'}
                      sx={[
                        (theme) => ({
                          pl: 2,
                          py: 1,
                          gap: 2,
                          pr: 1.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                          fontWeight: 'fontWeightMedium',
                          color: theme.vars.palette.text.secondary,
                          minHeight: 44,
                          ...(isActived && {
                            fontWeight: 'fontWeightSemiBold',
                            color: theme.vars.palette.primary.main,
                            bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                            '&:hover': {
                              bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
                            },
                          }),
                        }),
                      ]}
                    >
                      <Box component="span" sx={{ width: 24, height: 24 }}>
                        {item.icon}
                      </Box>

                      <Box component="span" sx={{ flexGrow: 1 }}>
                        {item.title}
                      </Box>

                      {item.info && item.info}
                    </ListItemButton>
                  )}
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {!isCollapsed && slots?.bottomArea}
    </>
  );
}
