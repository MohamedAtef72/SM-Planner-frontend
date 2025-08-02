import Cookies from 'js-cookie';
import api from './AxiosIntercepterRefresh';
import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ userName: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrorMessage('');

  try {
    const res = await api.post('/Account/Login', form);

    if (res.status === 200) {
      console.log('Login successful');
    // Store token in cookie for 7 days
    sessionStorage.setItem('token', res.data.token);
    // save refresh token
    Cookies.set('refreshToken', res.data.refreshToken, { expires: 7 }); // 7 days
    
    // Get role
      const roleRes = await api.get("/User/GetRole",{
        headers:{
          Authorization:`Bearer ${sessionStorage.getItem("token")}`
        }
      });
      if(roleRes.data.role[0] === "Admin"){
        navigate('/dashboard');
      }
      else{
      navigate('/tasks');
      }
    } else {
      setErrorMessage('Login failed. Please try again.');
      console.log('Unexpected response:', res);
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.response?.status === 401) {
      setErrorMessage('Invalid username or password.');
    } else {
      setErrorMessage('An error occurred. Please try again later.');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          <LockOpenIcon fontSize="large" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Login
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
          <TextField
            label="userName"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

          {errorMessage && (
              <Typography color="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link component="button" onClick={() => navigate('/register')}>
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
