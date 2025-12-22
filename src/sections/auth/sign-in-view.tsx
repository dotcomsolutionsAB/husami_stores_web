import type { ValidationError } from 'src/utils/validation';

import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { validateFormData } from 'src/utils/validation';

import { signInSchema } from 'src/joi/auth.schema';
import { setUser } from 'src/store/slices/authSlice';
import { useSignInMutation } from 'src/services/auth';

import { FlatIcon } from 'src/components/flaticon';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signIn, { isLoading }] = useSignInMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationError>({});
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

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

  const handleSignIn = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // Prevents the default page reload

      // Validate form
      const { isValid, errors: validationErrors } = validateFormData(formData, signInSchema);

      if (!isValid) {
        setErrors(validationErrors || {});
        return;
      }

      try {
        // Call API
        const response = await signIn(formData).unwrap();

        // Store user in Redux
        dispatch(setUser(response.data));

        // Show success toast
        toast.success('Sign in successful!');

        // Redirect to dashboard
        router.push('/');
      } catch (error: any) {
        const errorMessage = error?.data?.message || 'Sign in failed. Please try again.';
        toast.error(errorMessage);
      }
    },
    [formData, signIn, dispatch, router]
  );

  return (
    <Box component="form" onSubmit={handleSignIn}>
      <Typography variant="h4">Welcome Back</Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mt: 1,
          mb: 2,
        }}
      >
        Please enter your details
      </Typography>

      <TextField
        fullWidth
        name="username"
        label="Username"
        required
        value={formData.username}
        onChange={handleInputChange}
        error={!!errors.username}
        helperText={errors.username}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        required
        value={formData.password}
        onChange={handleInputChange}
        error={!!errors.password}
        helperText={errors.password}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <FlatIcon icon={showPassword ? 'eye' : 'eye-closed'} width={24} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <Box
        sx={{
          mb: 1.5,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Link variant="body2" color="inherit">
          Forgot password?
        </Link>
      </Box>

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </Box>
  );
}
