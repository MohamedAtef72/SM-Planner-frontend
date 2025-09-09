import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Avatar,Button,TextField,Box,Typography,Container,Alert,Grid,CircularProgress,IconButton,InputAdornment } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate} from "react-router-dom";
import { login,getRole } from '../services/authService';
import Cookies from 'js-cookie';

// Define a validation schema for the login form using Yup
const validationSchema = yup.object({
  userName: yup
    .string()
    .required("UserName is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault(); // Prevents the password field from losing focus
  };

  // This function is called when the form is submitted and validated
  const onSubmit = async (data) => {
    try {
      setServerError(""); // Reset previous errors
      const response = await login(data);
      sessionStorage.setItem("token", response.data.token); 
      Cookies.set("refreshToken", response.data.refreshToken, {secure: true, sameSite: 'strict'});
      const role = await getRole();
      if (role === 'Admin') {
        navigate("/dashboard"); // Redirect to admin dashboard
      } else if (role === 'User') {
        navigate("/tasks"); // Redirect to user tasks page
      } else {
            navigate("/Login"); // Default redirect
      }
    } catch (err) {
      const errorMessage ="Login failed. Please check your username and password.";
      setServerError(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
        background: 'linear-gradient(45deg, #e3f2fd 30%, #fce4ec 90%)',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
            borderRadius: 2,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
            backgroundColor: "white",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Sign in to access your services
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            {serverError && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{serverError}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              id="userName"
              label="userName"
              name="userName"
              autoComplete="username"
              autoFocus
              {...register("userName")}
              error={!!errors.userName}
              helperText={errors.userName?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"} // Dynamically set type
              id="password"
              autoComplete="current-password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{ // Add the icon button to the input
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Typography variant="body2">
                  Don't have an account?{" "}
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                     <Typography component="span" color="primary" sx={{ fontWeight: 'medium' }}>
                        Sign Up
                    </Typography>
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}