import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Skeleton, // NEW: For the loading skeleton
  Fade, // NEW: For a smooth fade-in transition
} from '@mui/material';
import { userProfile, tasksCount as taskCounter } from '../services/authService';

// --- ICONS ---
import EditSquareIcon from '@mui/icons-material/EditSquare';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import ChecklistIcon from '@mui/icons-material/Checklist';

// NEW: Skeleton component for a better loading experience
const ProfileSkeleton = () => (
  <Grid container spacing={4} sx={{ padding: 3, marginTop: 2 }}>
    {/* Left Skeleton Card */}
    <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: { xs: '85%', sm: '370px' }, padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Skeleton variant="circular" width={220} height={220} sx={{ mt: 2 }} />
        <CardContent sx={{ textAlign: 'center', width: '80%' }}>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" height={20} width="60%" />
        </CardContent>
        <CardActions sx={{ width: '100%', paddingX: 2, pb: 2 }}>
          <Skeleton variant="rounded" width="100%" height={45} />
        </CardActions>
      </Card>
    </Grid>

    {/* Right Skeleton Cards */}
    <Grid item xs={12} md={6}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Skeleton variant="rounded" height={150} />
        <Skeleton variant="rounded" height={90} />
      </Box>
    </Grid>
  </Grid>
);

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

  // Loading State: Show skeleton
  if (loading) {
    return <ProfileSkeleton />;
  }

  // Error State: Show alert message
  if (error) {
    return (
      <Box sx={{ padding: 3, marginTop: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Success State: Show profile
  return (
<Fade in={!loading}>
  <Box sx={{flexGrow: 1, bgcolor: 'grey.50', p: { xs: 2, md: 4 }, minHeight: '90vh' , background: 'linear-gradient(45deg, #fce4ec 30%, #e3f2fd 90%)',}}>
    <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">

      {/* --- LEFT: Main Profile Card (ENLARGED) --- */}
      {/* CHANGED: md={5} is now md={7} to give this column more space */}
      <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center' }}>
        {/* CHANGED: Removed maxWidth to allow the card to grow */}
        <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
          <CardMedia
            component="img"
            image={user.image}
            alt="Profile"
            sx={{
              // CHANGED: Increased image size for better proportion
              width: 250,
              height: 250,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid',
              borderColor: 'primary.main',
              mt: 2,
            }}
          />
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h4" component="div" fontWeight="bold"> {/* Optional: Increased variant for larger card */}
              {user.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{mt: 1}}> {/* Optional: Increased variant */}
              {user.role}
            </Typography>
          </CardContent>
          <CardActions sx={{ width: '100%', p: 2, mt: 'auto' }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/editProfile')}
              startIcon={<EditSquareIcon />}
              sx={{ textTransform: 'none', fontSize: '1.1rem', py: 1.5 }} // Optional: Slightly larger text/padding
            >
              Edit Profile
            </Button>
          </CardActions>
        </Card>
      </Grid>

      {/* --- RIGHT: Info Cards --- */}
      {/* CHANGED: md={6} is now md={5} to make room for the larger left card */}
      <Grid item xs={12} md={5}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card>
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
          <Card>
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
        </Box>
      </Grid>
    </Grid>
  </Box>
</Fade>
  );
}