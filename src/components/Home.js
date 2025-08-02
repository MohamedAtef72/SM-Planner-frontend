import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 5, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            📝 Task Manager
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Organize your daily tasks efficiently and stay productive.
          </Typography>

          <List dense sx={{ mt: 3, textAlign: 'left' }}>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="Create and manage your tasks easily" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccessTimeIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Set deadlines and reminders" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BarChartIcon color="warning" />
              </ListItemIcon>
              <ListItemText primary="Track your productivity over time" />
            </ListItem>
          </List>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LoginIcon />}
              sx={{ mr: 2, px: 4 }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AppRegistrationIcon />}
              sx={{ px: 4 }}
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
