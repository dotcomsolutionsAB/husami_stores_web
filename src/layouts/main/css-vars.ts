import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function mainLayoutVars(theme: Theme) {
  return {
    '--layout-transition-easing': 'linear',
    '--layout-transition-duration': '120ms',
    '--layout-nav-vertical-width': '250px',
    '--layout-main-content-pt': theme.spacing(1),
    '--layout-main-content-pb': theme.spacing(8),
    '--layout-main-content-px': theme.spacing(3),
  };
}
