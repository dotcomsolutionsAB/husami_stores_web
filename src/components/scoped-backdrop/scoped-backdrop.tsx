import type { Theme, SxProps } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

type ScopedBackdropProps = {
  open: boolean;
  onClick: () => void;
  sx?: SxProps<Theme>;
};

export function ScopedBackdrop({ open, onClick, sx }: ScopedBackdropProps) {
  return (
    <Box
      onClick={onClick}
      sx={[
        (theme) => ({
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: varAlpha(theme.vars.palette.common.blackChannel, 0.5),
          backdropFilter: 'blur(5px)',
          zIndex: 2,
          visibility: open ? 'visible' : 'hidden',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: theme.transitions.create(['opacity', 'visibility'], {
            duration: theme.transitions.duration.standard,
          }),
          // Dark mode adjustments
          ...theme.applyStyles('dark', {
            backgroundColor: varAlpha(theme.vars.palette.common.blackChannel, 0.7),
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
