import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
// Icons
import EditSquareIcon from '@mui/icons-material/EditSquare';
import api from './AxiosIntercepterRefresh';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [tasksCount, setTasksCount] = useState(0);
  const [user , setUser] = useState({
    name:'',
    email:'',
    phoneNumber:'',
    country:'',
    image:'',
    role:''
  })

  async function fetchUser() {
    const response = await api.get('User/UserProfile');  
    setUser({...user,
      name:response.data.user.userName,
      email:response.data.user.email,
      phoneNumber:response.data.user.phoneNumber,
      country:response.data.user.country,
      image:`https://sm-planner.runasp.net/${response.data.user.imagePath}`,
      role:response.data.user.role[0]
    });
  }

  async function fetchTasksCount(){
    const response = await api.get('Task/Count');
    setTasksCount(response.data.count);
  }
  useEffect(()=>{
    fetchUser();
    fetchTasksCount();
  },[])

  return (
    <Box
      className="main-profile"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // column on mobile, row on desktop
        gap: 4,
        padding: 3,
        justifyContent: 'center',
        alignItems: 'flex-start',
        width:'100%',
      }}
    >
      {/* LEFT: Profile Card */}
      <Card sx={{ minWidth: {xs:'90%',md:'370px',lg:'370px'}, maxWidth: '80%', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CardMedia
          component="img"
          image={user.image}
          alt="Profile"
          sx={{
            width: 220,
            height: 220,
            objectFit: 'cover',
            borderRadius: '50%',
            border: '2px solid #ccc',
            boxShadow: 2,
            mt: 2
          }}
        />

        <CardContent sx={{ textAlign: 'center' }}>
          <Typography gutterBottom variant="h5" component="div">
            {user.name}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {user.role}
          </Typography>
        </CardContent>

        <CardActions sx={{ width: '100%', paddingX: 2 }}>
          <Button
            fullWidth
            onClick={() => navigate('/editProfile')}
            sx={{
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              backgroundColor: '#181d38',
              padding: '10px 10px',
              borderRadius: '10px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#2b2f57',
              },
            }}
          >
            <EditSquareIcon sx={{ marginRight: '10px' }} /> Edit Profile
          </Button>
        </CardActions>
      </Card>


      {/* RIGHT: Two Secondary Cards */}
      <Box
        className="secondary-cards"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '40%',
          minWidth: {xs:'90%',md:'370px',lg:'370px'},
        }}
      >
        <Card>
          <CardActionArea>
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {user.email}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.phoneNumber}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.country}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card>
          <CardActionArea>
            <CardContent>
              <Typography variant="h6">Tasks</Typography>
              <Typography variant="body1" color="text.secondary">
                {tasksCount}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </Box>
  );
}
