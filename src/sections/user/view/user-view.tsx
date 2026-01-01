import type { Dayjs } from 'dayjs';
import type { UserData } from 'src/services/user';

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
  useUserCreateMutation,
  useUserDeleteMutation,
  useUserUpdateMutation,
  useUserRetrieveMutation,
} from 'src/services/user';

import { FlatIcon } from 'src/components/flaticon';
import { Scrollbar } from 'src/components/scrollbar';
import { PageLoader } from 'src/components/page-loader';
import { PageLoadError } from 'src/components/page-error';
import { useConfirmDialog } from 'src/components/confirm-dialog';
import { emptyRows, TableNoData, TableEmptyRows, CustomTableHead } from 'src/components/table';

import { UserTableRow } from '../user-table-row';
import { UserFormModal } from '../user-form-modal';

import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

export function UserView() {
  const table = useTable();
  const { confirm } = useConfirmDialog();

  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const [createUser, { isLoading: isCreating }] = useUserCreateMutation();
  const [updateUser, { isLoading: isUpdating }] = useUserUpdateMutation();
  const [deleteUser] = useUserDeleteMutation();

  const {
    data: users,
    pagination,
    isLoading,
    error: apiError,
    refetch,
  } = useRetrieveApi<UserData, any>({
    mutationHook: useUserRetrieveMutation,
    payload: {
      limit: table.rowsPerPage,
      offset: table.page * table.rowsPerPage,
      search,
    },
  });

  const handleOpenModal = useCallback((user?: UserData) => {
    setSelectedUser(user || null);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        if (selectedUser) {
          await updateUser({ id: selectedUser.id, ...data }).unwrap();
          toast.success('User updated successfully');
        } else {
          await createUser(data).unwrap();
          toast.success('User created successfully');
        }
        handleCloseModal();
        refetch();
      } catch (error: any) {
        // Error already handled by apiSlice globally
        // Just cleanup if needed
      }
    },
    [selectedUser, createUser, updateUser, handleCloseModal, refetch]
  );

  const handleDelete = useCallback(
    async (userId: number) => {
      const confirmed = await confirm({
        title: 'Delete User',
        content: 'Are you sure you want to delete this user? This action cannot be undone.',
      });

      if (confirmed) {
        try {
          await deleteUser({ id: userId }).unwrap();
          toast.success('User deleted successfully');
          refetch();
        } catch (error: any) {
          // Error already handled by apiSlice globally
          // Just cleanup if needed
        }
      }
    },
    [confirm, deleteUser, refetch]
  );

  // Map API data to UserProps
  const mappedUsers: UserProps[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    avatarUrl: '',
    mobile: '',
    userType: user.role,
  }));

  const notFound = !mappedUsers.length && !!search;

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
            startIcon={<FlatIcon icon="users-alt" width={20} />}
            onClick={() => handleOpenModal()}
          >
            Add User
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
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            sx={{ width: '200px' }}
          />
          <DatePicker
            label="Date To"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
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
                      mappedUsers.map((user) => user.id)
                    )
                  }
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'username', label: 'Username' },
                    { id: 'mobile', label: 'Mobile' },
                    { id: 'email', label: 'Email' },
                    { id: 'userType', label: 'User Type' },
                    { id: '', label: 'Actions', align: 'right' },
                  ]}
                />
                <TableBody sx={{ position: 'relative' }}>
                  {mappedUsers?.map((row) => {
                    const userData = users.find((u) => u.id === row.id);
                    return (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onEdit={() => handleOpenModal(userData)}
                        onDelete={handleDelete}
                      />
                    );
                  })}

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

      <UserFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        user={selectedUser}
        isLoading={isCreating || isUpdating}
      />
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
