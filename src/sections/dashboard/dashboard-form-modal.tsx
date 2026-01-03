import type { IDashboardData } from 'src/services/dashboard';

import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

interface DashboardFormData {
  sku: string;
  item_name: string;
  grade_no: string;
  product_size: string;
  brand: string;
  godown: string;
  finish_type: string;
  specifications: string;
  quantity: number;
  ctn: number;
  batch_no: string;
  rack_no: string;
  invoice_no: string;
  invoice_date: string;
  tc_no: string;
  tc_date: string;
  remarks: string;
}

export interface DashboardFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DashboardFormData) => Promise<void>;
  stock?: IDashboardData | null;
  isLoading?: boolean;
}

// ----------------------------------------------------------------------

export function DashboardFormModal({
  open,
  onClose,
  onSubmit,
  stock,
  isLoading,
}: DashboardFormModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DashboardFormData>({
    defaultValues: {
      sku: '',
      item_name: '',
      grade_no: '',
      product_size: '',
      brand: '',
      godown: '',
      finish_type: '',
      specifications: '',
      quantity: 0,
      ctn: 0,
      batch_no: '',
      rack_no: '',
      invoice_no: '',
      invoice_date: '',
      tc_no: '',
      tc_date: '',
      remarks: '',
    },
  });

  useEffect(() => {
    if (open) {
      // Reset form with stock data when modal opens
      if (stock) {
        reset({
          sku: stock.sku || '',
          item_name: stock.item_name || '',
          grade_no: stock.grade_no || '',
          product_size: stock.product_size || '',
          brand: stock.brand?.name || '',
          godown: stock.godown?.name || '',
          finish_type: stock.finish_type || '',
          specifications: stock.specifications || '',
          quantity: stock.quantity || 0,
          ctn: stock.ctn || 0,
          batch_no: stock.batch_no || '',
          rack_no: stock.rack_no || '',
          invoice_no: stock.invoice_no || '',
          invoice_date: stock.invoice_date || '',
          tc_no: stock.tc_no || '',
          tc_date: stock.tc_date || '',
          remarks: stock.remarks || '',
        });
      } else {
        reset({
          sku: '',
          item_name: '',
          grade_no: '',
          product_size: '',
          brand: '',
          godown: '',
          finish_type: '',
          specifications: '',
          quantity: 0,
          ctn: 0,
          batch_no: '',
          rack_no: '',
          invoice_no: '',
          invoice_date: '',
          tc_no: '',
          tc_date: '',
          remarks: '',
        });
      }
    }
  }, [open, stock, reset]);

  const handleFormSubmit = async (data: DashboardFormData) => {
    await onSubmit(data);
    // Parent handles modal close and refetch on success
    // Form will be reset when modal closes (via useEffect watching `open` prop)
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>{stock ? 'Edit Stock' : 'Add Stock'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="sku"
                control={control}
                rules={{ required: 'SKU is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="SKU"
                    error={!!errors.sku}
                    helperText={errors.sku?.message}
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="item_name"
                control={control}
                rules={{ required: 'Item name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Item Name"
                    error={!!errors.item_name}
                    helperText={errors.item_name?.message}
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="grade_no"
                control={control}
                render={({ field }) => <TextField {...field} label="Grade" fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="product_size"
                control={control}
                render={({ field }) => <TextField {...field} label="Size" fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="brand"
                control={control}
                render={({ field }) => <TextField {...field} label="Brand" fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="godown"
                control={control}
                render={({ field }) => <TextField {...field} label="Godown" fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="finish_type"
                control={control}
                render={({ field }) => <TextField {...field} label="Finish Type" fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="specifications"
                control={control}
                render={({ field }) => <TextField {...field} label="Specifications" fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="quantity"
                control={control}
                rules={{ required: 'Quantity is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Quantity"
                    type="number"
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="ctn"
                control={control}
                render={({ field }) => <TextField {...field} label="CTN" type="number" fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="batch_no"
                control={control}
                render={({ field }) => <TextField {...field} label="Batch No" fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="rack_no"
                control={control}
                render={({ field }) => <TextField {...field} label="Rack No" fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="invoice_no"
                control={control}
                render={({ field }) => <TextField {...field} label="Invoice No" fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="invoice_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Invoice Date"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) =>
                      field.onChange(newValue ? newValue.format('YYYY-MM-DD') : '')
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="tc_no"
                control={control}
                render={({ field }) => <TextField {...field} label="TC No" fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="tc_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="TC Date"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) =>
                      field.onChange(newValue ? newValue.format('YYYY-MM-DD') : '')
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="remarks"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Remarks" multiline rows={3} fullWidth />
                )}
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
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {stock ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
