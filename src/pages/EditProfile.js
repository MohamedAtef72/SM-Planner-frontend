//MUI
import { TextField, Button, Box, Typography, Avatar, Container, Paper, CircularProgress, Alert } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
// hooks
import { useState, useEffect } from 'react';
// Component
import { userProfile, userUpdate } from '../services/authService';
// hooks
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [form, setForm] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    country: '',
    imagePath: '',
    role: []
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);


  // --- DATA FETCHING ---
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await userProfile();
        const u = res.data.user;
        setForm({
          userName: u.userName || '',
          email: u.email || '',
          phoneNumber: u.phoneNumber || '',
          country: u.country || '',
          imagePath: u.imagePath || '',
          role: u.role ? [u.role[0]] : [],
        });
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Could not load your profile data.');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append('userName', form.userName);
    formData.append('email', form.email);
    formData.append('phoneNumber', form.phoneNumber);
    formData.append('country', form.country);
    if (form.role.length > 0) {
        formData.append('role', form.role[0]);
    }
    if (image) {
      formData.append('Image', image);
    }

    try {
      const res = await userUpdate(formData);
      if (res.status === 200) {
        navigate('/profile');
      }
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // --- RENDER LOGIC ---
  if (loading) {
    return (
      <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Loading Profile...
          </Typography>
          <CircularProgress sx={{ display: 'block', mx: 'auto' }} />
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ my: 4}}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography component="h1" variant="h5" textAlign="center">
          Edit Your Profile
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              src={imagePreview || (form.imagePath ? `https://sm-planner.runasp.net/${form.imagePath}` : '')}
              sx={{ width: 150, height: 150, border: '2px solid', borderColor: 'divider' }}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
            >
              Change Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            fullWidth
            name="userName"
            label="Name"
            value={form.userName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            required
            type="email"
          />
          <TextField
            fullWidth
            name="phoneNumber"
            label="Phone"
            value={form.phoneNumber}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="country"
            label="Country"
            value={form.country}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={saving}
            sx={{ mt: 2, py: 1.5 }}
          >
            {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}