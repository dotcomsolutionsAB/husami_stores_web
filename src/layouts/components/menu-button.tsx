import type { IconButtonProps } from '@mui/material/IconButton';

import IconButton from '@mui/material/IconButton';

import { FlatIcon } from 'src/components/flaticon';

// ----------------------------------------------------------------------

export function MenuButton({ sx, ...other }: IconButtonProps) {
  return (
    <IconButton sx={sx} {...other}>
      <FlatIcon icon="menu-dots" width={24} />
    </IconButton>
  );
}
