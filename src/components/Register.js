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
import api from './AxiosIntercepterRefresh';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
    phoneNumber: '',
    country: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrorMessage('');
  setSuccessMessage('');

  try {

    const formData = new FormData();
      formData.append("UserName", form.userName);
      formData.append("Password", form.password);
      formData.append("Email", form.email);
      formData.append("PhoneNumber", form.phoneNumber);
      formData.append("Country", form.country);
      formData.append("Image", imageFile);
    const res = await api.post('/Account/Register', formData);

    if (res.status === 201 || res.status === 200) {
      console.log('Registration successful');      
      setSuccessMessage('Registration successful! Redirecting to login...');
      // Optional: clear form after registration
      setForm({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setErrorMessage('Registration failed. Please try again.');
      console.warn('Unexpected response:', res);
    }

  } catch (error) {
    console.error('Register error:', error);

    if (error.response) {
      const { status, data } = error.response;

      if (status === 400 && data?.errors) {
        // Show validation errors from API
        const messages = Object.values(data.errors).flat().join('\n');
        setErrorMessage(messages);
      } else if (status === 409) {
        setErrorMessage('This user already exists.');
      } else {
        setErrorMessage(data?.message || 'An error occurred. Please try again.');
      }
    } else {
      setErrorMessage('Network error. Please check your connection.');
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          <AppRegistrationIcon fontSize="large" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Register
        </Typography>

        <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
          <TextField
            label="Username"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
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

          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <input
            type="file"
            accept="image/*"
            style={{ marginTop: 16 }}
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1 }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>

            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}


          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link component="button" onClick={() => navigate('/login')}>
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}