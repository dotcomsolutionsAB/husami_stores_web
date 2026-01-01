import type { IDashboardData } from 'src/services/dashboard';

import { useState, useCallback } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { fDate } from 'src/utils/format-time';

import { FlatIcon } from 'src/components/flaticon';
import { ScopedBackdrop } from 'src/components/scoped-backdrop';

// ----------------------------------------------------------------------

type DashboardTableRowProps = {
  row: IDashboardData;
  showCheckbox?: boolean;
  selected?: boolean;
  onSelectRow?: () => void;
  onEdit?: (stock: IDashboardData) => void;
  onDelete?: (stockId: number) => void;
};

export function DashboardTableRow({
  row,
  selected = false,
  onSelectRow = () => {},
  onEdit,
  onDelete,
}: DashboardTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* Godown */}
        <TableCell>{row.godown_id || '-'}</TableCell>

        {/* Item */}
        <TableCell>{row.item_name || '-'}</TableCell>

        {/* Grade */}
        <TableCell>{row.grade_no || '-'}</TableCell>

        {/* Size */}
        <TableCell>{row.product_size || '-'}</TableCell>

        {/* Brand */}
        <TableCell>{row.product_brand || '-'}</TableCell>

        {/* In Stock (quantity - sent) */}
        <TableCell>{(row.quantity || 0) - (row.sent || 0)}</TableCell>

        {/* Total */}
        <TableCell>{row.quantity || '-'}</TableCell>

        {/* Blocked */}
        <TableCell>-</TableCell>

        {/* Cart */}
        <TableCell>{row.ctn || '-'}</TableCell>

        {/* Rack No */}
        <TableCell>{row.rack_no || '-'}</TableCell>

        {/* Batch No */}
        <TableCell>{row.batch_no || '-'}</TableCell>

        {/* SKU */}
        <TableCell>{row.sku || '-'}</TableCell>

        {/* TC No */}
        <TableCell>{row.tc_no || '-'}</TableCell>

        {/* Finish */}
        <TableCell>{row.finish_type || '-'}</TableCell>

        {/* Specification */}
        <TableCell>{row.specifications || '-'}</TableCell>

        {/* Entry Date */}
        <TableCell>{row.created_at ? fDate(row.created_at) : '-'}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <FlatIcon icon="menu-dots" width={24} />
          </IconButton>
        </TableCell>

        {/* Custom Backdrop for Popover */}
        <ScopedBackdrop open={!!openPopover} />
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 180,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleClosePopover();
            }}
          >
            <FlatIcon icon="shopping-cart" width={20} />
            Add to Cart
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClosePopover();
            }}
          >
            <FlatIcon icon="person-dolly-empty" width={20} />
            Add to Pickup Slip
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClosePopover();
              onEdit?.(row);
            }}
          >
            <FlatIcon icon="pen-clip" width={20} />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              onDelete?.(row.id);
            }}
            sx={{ color: 'error.main' }}
          >
            <FlatIcon icon="trash" width={20} />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
