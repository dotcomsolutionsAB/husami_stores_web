import type { IDashboardData } from 'src/services/dashboard';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

export interface PickupCartModalData {
  product_stock_id: number;
  sku: string;
  quantity: number;
}

export interface PickupCartModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PickupCartModalData) => Promise<void>;
  stock: IDashboardData | null;
  isLoading?: boolean;
}

// ----------------------------------------------------------------------

export function PickupCartModal({
  open,
  onClose,
  onSubmit,
  stock,
  isLoading,
}: PickupCartModalProps) {
  const [quantity, setQuantity] = useState<string>('1');

  const inStock = stock ? (stock.quantity || 0) - (stock.sent || 0) : 0;
  const productName = stock?.item_name || '';
  const quantityNum = Number(quantity) || 0;

  useEffect(() => {
    if (open && stock) {
      setQuantity('1');
    }
  }, [open, stock]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stock) return;

    await onSubmit({
      product_stock_id: stock.id,
      sku: stock.sku,
      quantity: quantityNum,
    });
  };

  const handleClose = () => {
    setQuantity('1');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add to Pickup Cart</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Product Name"
                value={productName}
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="In Stock"
                value={inStock}
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                fullWidth
                required
                slotProps={{ htmlInput: { min: 1, max: inStock } }}
                error={quantityNum > inStock || quantityNum < 1}
                helperText={
                  quantityNum > inStock
                    ? 'Quantity cannot exceed available stock'
                    : quantityNum < 1
                      ? 'Quantity must be at least 1'
                      : ''
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || quantityNum > inStock || quantityNum < 1}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
