// hooks
import { useEffect, useState } from 'react';
// MUI
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Pagination,
  Avatar,
} from '@mui/material';
import api from './AxiosIntercepterRefresh';
import Cookies from 'js-cookie';
//Icons
import GroupIcon from '@mui/icons-material/Group';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  // State for pagination
  const [userPage, setUserPage] = useState(() => {
    return Number(Cookies.get('userPage')) || 1;
  });
  const [taskPage, setTaskPage] = useState(() => {
    return Number(Cookies.get('taskPage')) || 1;
  });

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const [totalUsersPages, setTotalUsersPages] = useState(1);
  const [totalTasksPages, setTotalTasksPages] = useState(1);

  // Consolidated loading state
  const [loading, setLoading] = useState(true);

  // Override App.css styles for this component only
  useEffect(() => {
    // Save original App styles
    const appElement = document.querySelector('.App');
    const originalStyles = {
      display: appElement?.style.display || '',
      justifyContent: appElement?.style.justifyContent || '',
      alignItems: appElement?.style.alignItems || '',
      height: appElement?.style.height || ''
    };

    // Apply new styles for dashboard
    if (appElement) {
      appElement.style.display = 'block';
      appElement.style.justifyContent = 'unset';
      appElement.style.alignItems = 'unset';
      appElement.style.height = 'auto';
      appElement.style.minHeight = '100vh';
    }

    // Cleanup function to restore original styles
    return () => {
      if (appElement) {
        appElement.style.display = originalStyles.display;
        appElement.style.justifyContent = originalStyles.justifyContent;
        appElement.style.alignItems = originalStyles.alignItems;
        appElement.style.height = originalStyles.height;
        appElement.style.minHeight = '';
      }
    };
  }, []);

  // Fetches a specific page of users
  const fetchUsers = async (value) => {
    try {
      const response = await api.get(`User/GetAllUsers`, {
        params: { pageNumber: value }
      });
      setUsers(response.data.users || []);
      setTotalUsers(response.data.pageInfo.totalCount);
      setTotalUsersPages(response.data.pageInfo.totalPages);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Fetches a specific page of tasks
  const fetchTasks = async (value) => {
    try {
      const response = await api.get(`Task/GetAllTasks`, {
        params: { pageNumber: value }
      });
      setTasks(response.data.tasks || []);
      setTotalTasks(response.data.pageInfo.totalCount || 0);
      setTotalTasksPages(response.data.pageInfo.totalPages);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  // Initial data fetch for both users and tasks5
  useEffect(() => {
    const uPage = Cookies.get('userPage');
    const tPage = Cookies.get('taskPage');
    const fetchInitialData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUsers(uPage),
        fetchTasks(tPage)
      ]);
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  // Handlers for pagination changes
  const handleUserPageChange = (event, value) => {
    Cookies.set('userPage', value);
    setUserPage(value);
    fetchUsers(value);
  };

  const handleTaskPageChange = (event, value) => {
    Cookies.set('taskPage', value);
    setTaskPage(value);
    fetchTasks(value);
  };

  const handleDeleteUser = async (userId) => {
    const res = await api.delete(`User/AdminDelete/${userId}`);
    if(res.status === 200){
      const uPage = Cookies.get('userPage');
      const tPage = Cookies.get('taskPage');
      const fetchInitialData = async () => {
        setLoading(true);
        await Promise.all([
          fetchUsers(uPage),
          fetchTasks(tPage)
        ]);
        setLoading(false);
      };
      fetchInitialData();
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        gap: { xs: 2, lg: 3 },
        minHeight: '100vh',
        paddingTop: { xs: 2, md: 3 },
      }}
    >
      {/* Main Content Area (Tables) */}
      <Box
        sx={{
          flex: 1,
          width: { xs:'100%',md: '95%', lg: '70%' },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Paper elevation={3} sx={{ p: 2, borderRadius: '16px' }}>
          <Typography variant="h6" gutterBottom>Users List</Typography>
          
          <Box sx={{ overflowX: 'auto' }}>
            <Table >
              <TableHead>
                <TableRow sx={{ '& .MuiTableCell-root': { bgcolor: 'primary.main', color: 'white' } }}>
                  <TableCell>User Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role.join(', ')}</TableCell>
                    <TableCell>
                      <IconButton aria-label="delete" onClick={() => handleDeleteUser(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination count={totalUsersPages} page={userPage} onChange={handleUserPageChange} color="primary" />
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, borderRadius: '16px' }}>
          <Typography variant="h6" gutterBottom>Tasks List</Typography>
          
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ '& .MuiTableCell-root': { bgcolor: 'primary.main', color: 'white' } }}>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>User Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{task.userName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination count={totalTasksPages} page={taskPage} onChange={handleTaskPageChange} color="primary" />
          </Box>
        </Paper>
      </Box>

      {/* Sidebar Area (Statistics) */}
      <Box
        sx={{
          flex: 1,
          width: {xs:'100%' ,md: '95%', lg: '30%' },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>Statistics</Typography>
        
        {/* Total Users Card */}
        <Card elevation={3} sx={{ borderRadius: '16px' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
              <GroupIcon fontSize="large" sx={{ color: 'primary.contrastText' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">{totalUsers}</Typography>
              <Typography color="text.secondary">Total Users</Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Total Tasks Card */}
        <Card elevation={3} sx={{ borderRadius: '16px' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.light', width: 56, height: 56 }}>
              <TaskAltIcon fontSize="large" sx={{ color: 'secondary.contrastText' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">{totalTasks}</Typography>
              <Typography color="text.secondary">Total Tasks</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminDashboard;