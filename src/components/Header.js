import * as React from 'react';
import { AppBar,Box,Toolbar,IconButton,Typography,Menu,Container,Avatar,Tooltip,MenuItem, } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import Cookies  from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../services/authService';
import { Link } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const [role, setRole] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleGetRole = async () => {
    try {
      const role = await getRole();
      setRole(role);
    } catch (error) {
      console.error('Failed to get role:', error);
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    Cookies.remove('refreshToken');
    Cookies.remove('currentPage');
    handleCloseUserMenu();
    navigate('/');
  };


  React.useEffect(() => {
    if (token) {
      handleGetRole();
    }
  }, [token]);


   const menuItems = {
    public: [{ label: 'Login', path: '/login' }, { label: 'Register', path: '/register' }],
    User: [{ label: 'Profile', path: '/profile' }, { label: 'Tasks', path: '/tasks' }],
    Admin: [{ label: 'Profile', path: '/profile' }, { label: 'Dashboard', path: '/dashboard' }, { label: 'Tasks', path: '/tasks' }],
    };

    const currentSettings = token ? (role ? menuItems[role] : []) : menuItems.public;

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              flexGrow: 1,
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SM Planner
          </Typography>

          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SM
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="SM" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
            sx={{ mt: '5px' }}
              // Attach the menu to the element that was clicked (the avatar)
              anchorEl={anchorElUser}

              // The menu is open if anchorElUser is not null
              open={Boolean(anchorElUser)}

              // Call this function when the user clicks away from the menu
              onClose={handleCloseUserMenu}
            >
              {currentSettings.map((setting) => (
                <MenuItem key={setting.label} component={Link} to={setting.path} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting.label}</Typography>
                </MenuItem>
              ))}
              {token && (
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;