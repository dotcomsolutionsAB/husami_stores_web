import type {
  IDashboardData,
  IDashboardFilters,
  IDashboardRetrievePayload,
} from 'src/services/dashboard';

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
import Autocomplete from '@mui/material/Autocomplete';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useRetrieveApi } from 'src/hooks/use-retrieve-api';

import { MainContent } from 'src/layouts/main';
import {
  useGetSizesQuery,
  useGetItemsQuery,
  useGetGradesQuery,
  defaultDashboardFilters,
  useDashboardUpdateMutation,
  useDashboardCreateMutation,
  useDashboardDeleteMutation,
  useDashboardRetrieveMutation,
} from 'src/services/dashboard';

import { FlatIcon } from 'src/components/flaticon';
import { Scrollbar } from 'src/components/scrollbar';
import { PageLoader } from 'src/components/page-loader';
import { PageLoadError } from 'src/components/page-error';
import { useConfirmDialog } from 'src/components/confirm-dialog';
import { emptyRows, TableNoData, TableEmptyRows, CustomTableHead } from 'src/components/table';

import { DashboardTableRow } from '../dashboard-table-row';
import { DashboardFormModal } from '../dashboard-form-modal';

// ----------------------------------------------------------------------

const FILTER_BUTTONS = ['Batch No', 'Invoice No', 'TC No', 'Finish Type', 'Specification'];

export function DashboardView() {
  const table = useTable();
  const { confirm } = useConfirmDialog();

  // Consolidated filter state
  const [filters, setFilters] = useState<IDashboardFilters>(defaultDashboardFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<IDashboardData | null>(null);

  // Helper to update a single filter field
  const updateFilter = useCallback(
    <K extends keyof IDashboardFilters>(key: K, value: IDashboardFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Master data queries
  const {
    data: grades = [],
    isLoading: isGradesLoading,
    isError: isGradesError,
  } = useGetGradesQuery();
  const { data: items = [], isLoading: isItemsLoading, isError: isItemsError } = useGetItemsQuery();
  const { data: sizes = [], isLoading: isSizesLoading, isError: isSizesError } = useGetSizesQuery();

  const isMasterDataLoading = isGradesLoading || isItemsLoading || isSizesLoading;
  const isMasterDataError = isGradesError || isItemsError || isSizesError;

  // Dashboard mutations
  const [createStock, { isLoading: isCreating }] = useDashboardCreateMutation();
  const [updateStock, { isLoading: isUpdating }] = useDashboardUpdateMutation();
  const [deleteStock] = useDashboardDeleteMutation();

  const payload: IDashboardRetrievePayload = {
    limit: table.rowsPerPage,
    offset: table.page * table.rowsPerPage,
    search: filters.search,
    date_from: filters.date_from || undefined,
    date_to: filters.date_to || undefined,
    godown: filters.godown,
    grade: filters.grade,
    brand: filters.brand,
    specification: filters.specification,
    item: filters.item,
    size: filters.size,
    finish: filters.finish,
  };

  const {
    data: stockData,
    pagination,
    isLoading,
    refetch,
  } = useRetrieveApi<IDashboardData, IDashboardRetrievePayload>({
    mutationHook: useDashboardRetrieveMutation,
    payload,
  });

  const handleOpenModal = useCallback((stock?: IDashboardData) => {
    setSelectedStock(stock || null);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedStock(null);
  }, []);

  const handleFilterButtonClick = useCallback((index: number) => {
    setFilters((prev) => {
      const newFilterButtons = [...prev.filterButtons];
      newFilterButtons[index] = !newFilterButtons[index];
      return { ...prev, filterButtons: newFilterButtons };
    });
  }, []);

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        if (selectedStock) {
          await updateStock({ id: selectedStock.id, ...data }).unwrap();
          toast.success('Stock updated successfully');
        } else {
          await createStock(data).unwrap();
          toast.success('Stock created successfully');
        }
        handleCloseModal();
        refetch();
      } catch {
        // Error already handled by apiSlice globally
        // Just cleanup if needed
      }
    },
    [selectedStock, createStock, updateStock, handleCloseModal, refetch]
  );

  const handleDelete = useCallback(
    async (stockId: number) => {
      const confirmed = await confirm({
        title: 'Delete Stock',
        content: 'Are you sure you want to delete this stock entry? This action cannot be undone.',
      });

      if (confirmed) {
        try {
          await deleteStock({ id: stockId }).unwrap();
          toast.success('Stock deleted successfully');
          refetch();
        } catch {
          // Error already handled by apiSlice globally
          // Just cleanup if needed
        }
      }
    },
    [confirm, deleteStock, refetch]
  );

  const notFound = !stockData.length && !!filters.search;

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
            onClick={() => handleOpenModal()}
          >
            Add Stock
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<FlatIcon icon="move-to-folder-2" width={20} />}
          >
            View Total
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<FlatIcon icon="move-to-folder-2" width={20} />}
          >
            Import
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<FlatIcon icon="cloud-download-alt" width={20} />}
          >
            Export
          </Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            ml: 'auto',
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <TextField
          label="Search by Invoice/Batch/TC/Specification/Remarks"
          title="Search by Invoice/Batch/TC/Specification/Remarks"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          sx={{ minWidth: { xs: '100%', sm: '250px' }, flex: 1 }}
        />
        {FILTER_BUTTONS?.map((filter: string, index: number) => (
          <Button
            key={index}
            variant="outlined"
            color={filters.filterButtons[index] ? 'success' : 'inherit'}
            endIcon={
              <Box
                className="filter-icon-box"
                sx={(theme) => ({
                  borderRadius: 1,
                  backgroundColor: filters.filterButtons[index]
                    ? theme.palette.success.main
                    : theme.palette.background.neutral,
                  color: filters.filterButtons[index]
                    ? theme.palette.success.contrastText
                    : theme.palette.text.secondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '30px',
                  width: '30px',
                })}
              >
                {filter.charAt(0).toUpperCase()}
              </Box>
            }
            sx={(theme) => ({
              height: '40px',
              borderColor: filters.filterButtons[index] ? 'success.main' : 'grey.500',
              '&:hover': {
                '.filter-icon-box': {
                  backgroundColor: filters.filterButtons[index]
                    ? theme.palette.success.main
                    : theme.palette.background.default,
                },
              },
            })}
            onClick={() => handleFilterButtonClick(index)}
          >
            {filter}
          </Button>
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Autocomplete
          renderInput={(params) => <TextField {...params} label="Select Godown" />}
          options={[]}
          value={filters.godown || null}
          onChange={(_, newValue) => updateFilter('godown', newValue || '')}
          sx={{ width: 200 }}
        />
        <Autocomplete
          renderInput={(params) => <TextField {...params} label="Select Grade" />}
          options={grades.map((g) => g.name)}
          value={filters.grade || null}
          onChange={(_, newValue) => updateFilter('grade', newValue || '')}
          sx={{ width: 200 }}
        />
        <Autocomplete
          renderInput={(params) => <TextField {...params} label="Select Brand" />}
          options={[]}
          value={filters.brand || null}
          onChange={(_, newValue) => updateFilter('brand', newValue || '')}
          sx={{ width: 200 }}
        />
        <Autocomplete
          renderInput={(params) => <TextField {...params} label="Select Specification" />}
          options={[]}
          value={filters.specification || null}
          onChange={(_, newValue) => updateFilter('specification', newValue || '')}
          sx={{ width: 200 }}
        />
        <Autocomplete
          renderInput={(params) => <TextField {...params} label="Select Item" />}
          options={items.map((i) => i.name)}
          value={filters.item || null}
          onChange={(_, newValue) => updateFilter('item', newValue || '')}
          sx={{ width: 200 }}
        />
        <Autocomplete
          renderInput={(params) => <TextField {...params} label="Select Size" />}
          options={sizes.map((s) => s.name)}
          value={filters.size || null}
          onChange={(_, newValue) => updateFilter('size', newValue || '')}
          sx={{ width: 200 }}
        />
        <Autocomplete
          renderInput={(params) => <TextField {...params} label="Select Finish" />}
          options={[]}
          value={filters.finish || null}
          onChange={(_, newValue) => updateFilter('finish', newValue || '')}
          sx={{ width: 200 }}
        />
        <Box
          onClick={() => refetch()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40px',
            width: '40px',
            borderRadius: 1,
            backgroundColor: 'background.paper',
            color: 'primary.main',
            cursor: 'pointer',
          }}
        >
          <FlatIcon icon="refresh" width={24} />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Loading state */}
      {(isMasterDataLoading || isLoading) && <PageLoader />}

      {/* Error state */}
      {!isMasterDataLoading && !isLoading && isMasterDataError && <PageLoadError />}

      {/* Data table */}
      {!isMasterDataLoading && !isLoading && !isMasterDataError && (
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
                      stockData.map((stock) => stock.id)
                    )
                  }
                  showCheckbox={false}
                  headLabel={[
                    { id: 'godown', label: 'Godown' },
                    { id: 'item', label: 'Item' },
                    { id: 'gr', label: 'GR' },
                    { id: 'size', label: 'Size' },
                    { id: 'brand', label: 'Brand' },
                    { id: 'in_stock', label: 'In Stock' },
                    { id: 'total', label: 'Total' },
                    { id: 'blocked', label: 'Blocked' },
                    { id: 'cart', label: 'Cart' },
                    { id: 'rack_no', label: 'Rack No' },
                    { id: 'batch_no', label: 'Batch No' },
                    { id: 'sku', label: 'SKU' },
                    { id: 'tc_no', label: 'TC No' },
                    { id: 'finish', label: 'Finish' },
                    { id: 'specification', label: 'Specification' },
                    { id: 'entry_date', label: 'Entry Date' },
                    { id: '', label: 'Actions', align: 'right' },
                  ]}
                />
                <TableBody sx={{ position: 'relative' }}>
                  {stockData?.map((row) => (
                    <DashboardTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onEdit={() => handleOpenModal(row)}
                      onDelete={handleDelete}
                    />
                  ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, pagination?.total || 0)}
                  />

                  {notFound && <TableNoData searchQuery={filters.search} />}
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

      <DashboardFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        stock={selectedStock}
        isLoading={isCreating || isUpdating}
      />
    </MainContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('item');
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
