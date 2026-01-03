import type { PickupCartData } from 'src/services/pickup-cart';

import dayjs from 'dayjs';
import { toast } from 'sonner';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useRetrieveApi } from 'src/hooks/use-retrieve-api';

import { MainContent } from 'src/layouts/main';
import {
  usePickupCartDeleteMutation,
  usePickupCartRetrieveMutation,
} from 'src/services/pickup-cart';

import { FlatIcon } from 'src/components/flaticon';
import { Scrollbar } from 'src/components/scrollbar';
import { PageLoader } from 'src/components/page-loader';
import { PageLoadError } from 'src/components/page-error';
import { useConfirmDialog } from 'src/components/confirm-dialog';
import { emptyRows, TableNoData, TableEmptyRows, CustomTableHead } from 'src/components/table';

import { PickupCartTableRow } from '../pickup-cart-table-row';

import type { PickupCartProps } from '../pickup-cart-table-row';

// ----------------------------------------------------------------------

export function PickupCartView() {
  const table = useTable();
  const { confirm } = useConfirmDialog();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ date_from: '', date_to: '' });

  // Helper to update a single filter field
  const updateFilter = useCallback(
    <K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const [deletePickupCart] = usePickupCartDeleteMutation();

  const {
    data: pickupCarts,
    pagination,
    isLoading,
    error: apiError,
    refetch,
  } = useRetrieveApi<PickupCartData, any>({
    mutationHook: usePickupCartRetrieveMutation,
    payload: {
      limit: table.rowsPerPage,
      offset: table.page * table.rowsPerPage,
      search,
      date_from: filters.date_from || undefined,
      date_to: filters.date_to || undefined,
    },
  });

  const handleDelete = useCallback(
    async (pickupCartId: number) => {
      const confirmed = await confirm({
        title: 'Delete Pickup Cart',
        content: 'Are you sure you want to delete this pickup cart? This action cannot be undone.',
      });

      if (confirmed) {
        try {
          await deletePickupCart({ id: pickupCartId }).unwrap();
          toast.success('Pickup Cart deleted successfully');
          refetch();
        } catch {
          // Error already handled by apiSlice globally
          // Just cleanup if needed
        }
      }
    },
    [confirm, deletePickupCart, refetch]
  );

  // Map API data to PickupCartProps
  const mappedPickupCarts: PickupCartProps[] = pickupCarts.map((pickupCart) => ({
    id: pickupCart.id,
    grade_no: pickupCart.grade_no || '',
    item_name: pickupCart.item_name || '',
    product_size: pickupCart.product_size || '',
    brand_name: pickupCart.brand_name || '',
    godown_name: pickupCart.godown_name || '',
    quantity: pickupCart.quantity,
    ctn: pickupCart.ctn,
    total_qty: pickupCart.total_qty || 0,
    cart_no: pickupCart.cart_no || '',
    rack_no: pickupCart.rack_no || '',
  }));

  const notFound = !mappedPickupCarts.length && !!search;

  return (
    <MainContent>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<FlatIcon icon="cloud-download-alt" width={20} />}
          >
            Add Stock
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<FlatIcon icon="document" width={20} />}
          >
            Generate Pickup Slip
          </Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <DatePicker
            label="Date From"
            value={filters.date_from ? dayjs(filters.date_from) : null}
            onChange={(newValue) =>
              updateFilter('date_from', newValue ? newValue.format('YYYY-MM-DD') : '')
            }
            sx={{ width: '200px' }}
          />
          <DatePicker
            label="Date To"
            value={filters.date_to ? dayjs(filters.date_to) : null}
            onChange={(newValue) =>
              updateFilter('date_to', newValue ? newValue.format('YYYY-MM-DD') : '')
            }
            sx={{ width: '200px' }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <TextField
        label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ width: 'clamp(200px,100%,300px)', mb: 2 }}
      />

      {/* Loading state */}
      {isLoading && <PageLoader />}

      {/* Error state */}
      {!isLoading && apiError && <PageLoadError onRetry={refetch} />}

      {/* Data table */}
      {!isLoading && !apiError && (
        <Card sx={{ overflow: 'auto' }}>
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <CustomTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  onSort={table.onSort}
                  rowCount={pagination?.total || 0}
                  numSelected={table.selected.length}
                  onSelectAllRows={(checked: boolean) =>
                    table.onSelectAllRows(
                      checked,
                      mappedPickupCarts.map((pickupCart) => pickupCart.id)
                    )
                  }
                  headLabel={[
                    { id: 'grade_no', label: 'GR' },
                    { id: 'item_name', label: 'Item' },
                    { id: 'product_size', label: 'Size' },
                    { id: 'brand_name', label: 'Brand' },
                    { id: 'godown_name', label: 'Godown' },
                    { id: 'quantity', label: 'Quantity' },
                    { id: 'ctn', label: 'CTN' },
                    { id: 'total_qty', label: 'Total Qty' },
                    { id: 'cart_no', label: 'Cart No' },
                    { id: 'rack_no', label: 'Rack No' },
                    { id: '', label: 'Actions', align: 'right' },
                  ]}
                />
                <TableBody sx={{ position: 'relative' }}>
                  {mappedPickupCarts?.map((row) => (
                    <PickupCartTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDelete={handleDelete}
                    />
                  ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, pagination?.total || 0)}
                  />

                  {notFound && <TableNoData searchQuery={search} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            component="div"
            page={table.page}
            count={pagination?.total || 0}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      )}
    </MainContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<number[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: number[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: number) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
