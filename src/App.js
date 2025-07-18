import './App.css';
import TodoList from './components/TodoList';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
// hooks
import { useState } from 'react';
// contexts
import { ToastProvider } from './contexts/toastBoarder';
import TodosProvider from './contexts/todoContext';

const theme = createTheme({
  typography:{
    fontFamily: 'Robo',
  }
});

const tasksInfo = [
  {
    id: uuidv4(),
    title: 'Complete project documentation',
    details: 'Write and format all documentation for the project.',
    isCompleted: false
  },
  {
    id: uuidv4(),
    title: 'Review code changes',
    details: 'Go through recent pull requests and provide feedback.',
    isCompleted: false
  },
  {
    id: uuidv4(),
    title: 'Prepare presentation slides',
    details: 'Create visual slides for the final project presentation.',
    isCompleted: false
  }
];

function App() {
    const [todos , setTodos] = useState(tasksInfo);

  return (
    <ThemeProvider theme={theme}>
      <TodosProvider>
        <ToastProvider >
        <div className="App"> 
            <TodoList />
        </div>
      </ToastProvider>
    </TodosProvider>
    </ThemeProvider>
  );
}

export default App;
