import './App.css';
// Components
import TodoList from './components/TodoList';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import EditProfile from './components/EditProfile';
import AdminDashBoard from './components/AdminDashBoard';

// Other Libraries
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {createTheme, ThemeProvider} from '@mui/material/styles';
// hooks
import { useState} from 'react';
// contexts
import { ToastProvider } from './contexts/toastBoarder';
import TodosProvider from './contexts/todoContext';

const theme = createTheme({
  typography:{
    fontFamily: 'Robo',
  }
});

function App() {
    const [todos, setTodos] = useState([]);
return (
  <ThemeProvider theme={theme}>
    <TodosProvider>
      <ToastProvider>
        <Router>
          <Header />
          <div className="App">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute><TodoList todos={todos} setTodos={setTodos} /></ProtectedRoute>} />
                <Route path="/editProfile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><AdminDashBoard /></ProtectedRoute>} />
              </Routes>
          </div>
        </Router>
      </ToastProvider>
    </TodosProvider>
  </ThemeProvider>
);
}

export default App;
