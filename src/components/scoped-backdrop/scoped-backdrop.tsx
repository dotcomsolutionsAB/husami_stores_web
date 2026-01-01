import type { Theme, SxProps } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

type ScopedBackdropProps = {
  open: boolean;
  sx?: SxProps<Theme>;
  inTable?: boolean;
};

export function ScopedBackdrop({ open, sx, inTable = true }: ScopedBackdropProps) {
  const backdropContent = (
    <Box
      sx={[
        (theme) => ({
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: varAlpha(theme.vars.palette.grey['900Channel'], 0.4),
          backdropFilter: 'blur(5px)',
          zIndex: 2,
          visibility: open ? 'visible' : 'hidden',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: theme.transitions.create(['opacity', 'visibility'], {
            duration: theme.transitions.duration.standard,
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );

  if (inTable) {
    return (
      <TableCell
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: 0,
          border: 'none',
          pointerEvents: 'none',
        }}
      >
        {backdropContent}
      </TableCell>
    );
  }

  return backdropContent;
}
