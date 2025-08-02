import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import Cookies  from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import api from './AxiosIntercepterRefresh';

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

  const fetchRole = async () => {
    try {
      const res = await api.get('/User/GetRole');
      setRole(res.data.role[0]);
    } catch (error) {
      console.error('Failed to get role:', error);
    }
  };

  React.useEffect(() => {
    if (token) {
      fetchRole();
    }
  }, [token]);

  let settings = [];
  if (!token) {
    settings = ['Login', 'Register'];
  } else if (role === 'Admin') {
    settings = ['Profile', 'Dashboard', 'Tasks', 'Logout'];
  } else if (role === 'User') {
    settings = ['Profile', 'Tasks', 'Logout'];
  }

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
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography
                    textAlign="center"
                    onClick={() => {
                      if (setting === 'Logout') {
                        sessionStorage.removeItem('token');
                        Cookies.remove('refreshToken');
                        Cookies.remove('currentPage');
                        navigate('/');
                      } else {
                        navigate(`/${setting.toLowerCase()}`);
                      }
                    }}
                  >
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;