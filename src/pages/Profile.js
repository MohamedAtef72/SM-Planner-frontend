import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Grid,
  Container
} from '@mui/material';

import { userProfile, tasksCount as taskCounter } from '../services/authService';

// --- ICONS ---
import EditSquareIcon from '@mui/icons-material/EditSquare';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import ChecklistIcon from '@mui/icons-material/Checklist';

export default function Profile() {
    
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // Start with null to better handle initial state
  const [tasksCount, setTasksCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);

        const [userResponse, tasksResponse] = await Promise.all([
          userProfile(),
          taskCounter(),
        ]);

        if (userResponse.data?.user) {
          const userData = userResponse.data.user;
          setUser({
            name: userData.userName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            country: userData.country,
            image: `https://sm-planner.runasp.net/${userData.imagePath}`,
            role: userData.role?.[0] || 'N/A',
          });
        }

        if (tasksResponse.data) {
          setTasksCount(tasksResponse.data.count);
        }

      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError("Could not load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

if (loading) return <Typography>Loading...</Typography>;
if (error) return <Typography color="error">{error}</Typography>;
if (!user) return null;

return (
  <Container maxWidth="md">
        <Card sx={{ p: 3, textAlign: "center", mb: 4 , mt:2 }}>
          <Avatar src={user.image} sx={{ width: 150, height: 150, mx: "auto", mb: 2 }} />
          <Typography variant="h5" fontWeight="bold">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">{user.role}</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/editProfile')}
            startIcon={<EditSquareIcon />}
            sx={{ textTransform: 'none', fontSize: '1.1rem', py: 1.5, mt:2 }}
          >
            Edit Profile
          </Button>
        </Card>

        <Card sx={{ p: 3, textAlign: "center",mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Contact Information</Typography>
            <List>
              <ListItem disablePadding>
                <ListItemIcon><EmailOutlinedIcon /></ListItemIcon>
                <ListItemText primary={user.email} secondary="Email" />
              </ListItem>
              <Divider component="li" sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemIcon><PhoneOutlinedIcon /></ListItemIcon>
                <ListItemText primary={user.phoneNumber} secondary="Phone" />
              </ListItem>
              <Divider component="li" sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemIcon><FlagOutlinedIcon /></ListItemIcon>
                <ListItemText primary={user.country} secondary="Country" />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card sx={{ p: 3, textAlign: "center",mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Activity</Typography>
            <List>
              <ListItem disablePadding>
                <ListItemIcon><ChecklistIcon /></ListItemIcon>
                <ListItemText primary={tasksCount} secondary="Tasks Created" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
  </Container>
);

}