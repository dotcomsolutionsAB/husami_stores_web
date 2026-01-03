import type { UserData } from 'src/services/user';
import type { UserFormData } from 'src/joi/user.schema';
import type { ValidationError } from 'src/utils/validation';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { validateFormData } from 'src/utils/validation';

import { userCreateSchema, userUpdateSchema } from 'src/joi/user.schema';

// ----------------------------------------------------------------------

export interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  user?: UserData | null;
  isLoading?: boolean;
}

const defaultFormData: UserFormData = {
  name: '',
  email: '',
  mobile: '',
  username: '',
  role: 'user',
  password: '',
  password_confirmation: '',
};

export function UserFormModal({ open, onClose, onSubmit, user, isLoading }: UserFormModalProps) {
  const [formData, setFormData] = useState<UserFormData>(defaultFormData);
  const [errors, setErrors] = useState<ValidationError>({});

  useEffect(() => {
    if (open) {
      // Reset form with user data when modal opens
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          mobile: user.mobile || '',
          username: user.username,
          role: user.role,
          password: '',
          password_confirmation: '',
        });
      } else {
        setFormData(defaultFormData);
      }
      setErrors({});
    }
  }, [open, user]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [errors]
  );

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Choose schema based on create or update
    const schema = user ? userUpdateSchema : userCreateSchema;
    const { isValid, errors: validationErrors } = validateFormData(formData, schema);

    if (!isValid) {
      setErrors(validationErrors || {});
      return;
    }

    await onSubmit(formData);
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
      <Box component="form" onSubmit={handleFormSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleInputChange}
                error={!!errors.username}
                helperText={errors.username}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                name="mobile"
                label="Mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                error={!!errors.mobile}
                helperText={errors.mobile}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                name="role"
                label="Role"
                value={formData.role}
                onChange={handleInputChange}
                error={!!errors.role}
                helperText={errors.role}
                fullWidth
                required
              />
            </Grid>

            {!user && (
              <>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    name="password_confirmation"
                    label="Confirm Password"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    error={!!errors.password_confirmation}
                    helperText={errors.password_confirmation}
                    fullWidth
                    required
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
