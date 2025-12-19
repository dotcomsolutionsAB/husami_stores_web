import type { ValidationError } from 'src/utils/validation';

import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { validateFormData } from 'src/utils/validation';

import { useSignInMutation } from 'src/services/auth';
import { signInSchema } from 'src/schemas/auth.schema';
import { setUser, setToken } from 'src/store/slices/authSlice';

import { Iconify } from 'src/components/iconify';

// Remember me storage key
const REMEMBER_ME_KEY = 'husami_remember_username';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signIn, { isLoading }] = useSignInMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationError>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Load remembered username on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem(REMEMBER_ME_KEY);
    if (savedUsername) {
      setFormData((prev) => ({
        ...prev,
        username: savedUsername,
      }));
      setRememberMe(true);
    }
  }, []);

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

  const handleSignIn = useCallback(async () => {
    // Validate form
    const { isValid, errors: validationErrors } = validateFormData(formData, signInSchema);

    if (!isValid) {
      setErrors(validationErrors || {});
      return;
    }

    try {
      // Call real API
      const response = await signIn(formData).unwrap();

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, formData.username);
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }

      // Store token and user in Redux
      dispatch(setToken(response.token));
      dispatch(setUser(response.user));

      // Show success toast
      toast.success('Sign in successful!');

      // Redirect to dashboard
      router.push('/');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Sign in failed. Please try again.';
      toast.error(errorMessage);
    }
  }, [formData, rememberMe, signIn, dispatch, router]);

  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
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
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
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
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <FormControlLabel
          label="Remember me"
          control={
            <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          }
        />
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
        onClick={handleSignIn}
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1,
          display: 'flex',
          flexDirection: 'column',
          mb: 4,
        }}
      >
        <Typography variant="h4">Welcome Back</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Please enter your details
        </Typography>
      </Box>
      {renderForm}
    </>
  );
}
