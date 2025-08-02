//MUI
import { TextField, Button, Box, Typography , Avatar } from '@mui/material';
// hooks
import { useState, useEffect } from 'react';
// Component
import api from './AxiosIntercepterRefresh';
// hooks
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    country: '',
    imagePath: '',
    role: []
  });

  useEffect(() => {
    async function fetchUser() {
      const res = await api.get('http://localhost:5122/api/User/UserProfile');
      const u = res.data.user;
      setForm({
        userName: u.userName,
        email: u.email,
        phoneNumber: u.phoneNumber,
        country: u.country,
        imagePath: u.imagePath,
        role: [u.role[0]],
      });
    }
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('userName', form.userName);
    formData.append('email', form.email);
    formData.append('phoneNumber', form.phoneNumber);
    formData.append('country', form.country);
    formData.append('role', form.role[0]);
    if (image) {
      formData.append('Image', image);
    }

    try {
      const res = await api.put('http://localhost:5122/api/User/Update', formData);
      if (res.status === 200) {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: 'white',
        maxWidth: '600px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
      }}
    >
      <Typography variant="h5" textAlign="center">
        Edit Your Profile
      </Typography>

      {form.imagePath && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2}}>
          <Avatar
            src={`http://localhost:5122/${form.imagePath}`}
            sx={{ width: 170, height: 170 }}
          />
        </Box>
      )}

      <TextField
        fullWidth
        name="userName"
        label="Name"
        value={form.userName}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        name="email"
        label="Email"
        value={form.email}
        onChange={handleChange}
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
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginTop: '8px' }}
      />

      <Button onClick={handleSubmit} variant="contained" fullWidth>
        Save
      </Button>
    </Box>
  );
}

