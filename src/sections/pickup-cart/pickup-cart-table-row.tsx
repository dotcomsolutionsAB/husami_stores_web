import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { FlatIcon } from 'src/components/flaticon';

// ----------------------------------------------------------------------

export type PickupCartProps = {
  id: number;
  grade_no: string;
  item_name: string;
  product_size: string;
  brand_name: string;
  godown_name: string;
  quantity: number;
  ctn: number;
  total_qty: number;
  cart_no: string;
  rack_no: string;
};

type PickupCartTableRowProps = {
  row: PickupCartProps;
  showCheckbox?: boolean;
  selected?: boolean;
  onSelectRow?: () => void;
  onDelete?: (pickupCartId: number) => void;
};

export function PickupCartTableRow({
  row,
  selected = false,
  onSelectRow = () => {},
  onDelete,
}: PickupCartTableRowProps) {
  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
      </TableCell>

      {/* GR */}
      <TableCell>{row.grade_no || '-'}</TableCell>

      {/* Item */}
      <TableCell>{row.item_name || '-'}</TableCell>

      {/* Size */}
      <TableCell>{row.product_size || '-'}</TableCell>

      {/* Brand */}
      <TableCell>{row.brand_name || '-'}</TableCell>

      {/* Godown */}
      <TableCell>{row.godown_name || '-'}</TableCell>

      {/* Quantity */}
      <TableCell>{row.quantity || '-'}</TableCell>

      {/* CTN */}
      <TableCell>{row.ctn || '-'}</TableCell>

      {/* Total Qty */}
      <TableCell>{row.total_qty || '-'}</TableCell>

      {/* Cart No */}
      <TableCell>{row.cart_no || '-'}</TableCell>

      {/* Rack No */}
      <TableCell>{row.rack_no || '-'}</TableCell>

      <TableCell align="right">
        <IconButton onClick={() => onDelete?.(row.id)} sx={{ color: 'error.main' }}>
          <FlatIcon icon="trash" width={20} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
