import type { Dayjs } from 'dayjs';
import type { UserData } from 'src/services/user';

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
import CircularProgress from '@mui/material/CircularProgress';

import { useRetrieveApi } from 'src/hooks/use-retrieve-api';

import { MainContent } from 'src/layouts/main';
import { useUserRetrieveMutation } from 'src/services/user';

import { FlatIcon } from 'src/components/flaticon';
import { Scrollbar } from 'src/components/scrollbar';
import { emptyRows, TableNoData, TableEmptyRows, CustomTableHead } from 'src/components/table';

import { UserTableRow } from '../user-table-row';

import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

export function UserView() {
  const table = useTable();

  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const {
    data: users,
    pagination,
    isLoading,
  } = useRetrieveApi<UserData, any>({
    mutationHook: useUserRetrieveMutation,
    payload: {
      limit: table.rowsPerPage,
      offset: table.page * table.rowsPerPage,
      search,
    },
  });

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
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          >
            Add User
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DatePicker
            label="Date From"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
          />
          <DatePicker
            label="Date To"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <TextField
        label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Card sx={{ overflow: 'auto' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
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
                  <TableBody>
                    {mappedUsers?.map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
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
          </>
        )}
      </Card>
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
