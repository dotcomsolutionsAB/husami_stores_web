import type { UserData } from 'src/services/user';

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
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

interface UserFormData {
  name: string;
  email: string;
  mobile?: string;
  username: string;
  role: string;
  password?: string;
  password_confirmation?: string;
}

export interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  user?: UserData | null;
  isLoading?: boolean;
}

// ----------------------------------------------------------------------

export function UserFormModal({ open, onClose, onSubmit, user, isLoading }: UserFormModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      username: '',
      role: 'user',
      password: '',
      password_confirmation: '',
    },
  });

  useEffect(() => {
    if (open) {
      // Reset form with user data when modal opens
      if (user) {
        reset({
          name: user.name,
          email: user.email,
          mobile: user.mobile || '',
          username: user.username,
          role: user.role,
          password: '',
          password_confirmation: '',
        });
      } else {
        reset({
          name: '',
          email: '',
          mobile: '',
          username: '',
          role: 'user',
          password: '',
          password_confirmation: '',
        });
      }
    }
  }, [open, user, reset]);

  const handleFormSubmit = async (data: UserFormData) => {
    await onSubmit(data);
    // Parent handles modal close and refetch on success
    // Form will be reset when modal closes (via useEffect watching `open` prop)
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="username"
                control={control}
                rules={{ required: 'Username is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Username"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="mobile"
                control={control}
                render={({ field }) => <TextField {...field} label="Mobile" fullWidth required />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="role"
                control={control}
                rules={{ required: 'Role is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Role"
                    error={!!errors.role}
                    helperText={errors.role?.message}
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>

            {!user && (
              <>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Password"
                        type="password"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        fullWidth
                        required
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="password_confirmation"
                    control={control}
                    rules={{
                      required: 'Password confirmation is required',
                      validate: (value, formValues) =>
                        value === formValues.password || 'Passwords do not match',
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Confirm Password"
                        type="password"
                        error={!!errors.password_confirmation}
                        helperText={errors.password_confirmation?.message}
                        fullWidth
                        required
                      />
                    )}
                  />
                </Grid>
              </>
            )}
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
            {user ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
