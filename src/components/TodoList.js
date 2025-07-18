import * as React from 'react';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// components
import Todo from './Todo';
import { useToast } from '../contexts/toastBoarder';
import { useTodos } from '../contexts/todoContext';
// hooks
import { useState ,useEffect, useMemo} from 'react';
// dialog
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';


export default function TodoList() {
  const {todos, todosDispatch} = useTodos();
  const {showHideToast} = useToast();
  const [showDeleteDialog,setShowDeleteDialog] = useState(false);
  const [inputTitle,setInputTitle] = useState("");
  const [todoProgress,setTodoProgress] = useState("All");
  const [dialogTodo , setdialogTodo] = useState("");
  const [showEditDialog,setShowEditDialog] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState({});

  // useEffect
  useEffect(()=>{
    todosDispatch({type:"get"});
  },[]);

  // Add Function
  function handleAddClick(){
    todosDispatch({type:"add",todo:{
        title: inputTitle,
      }});
      setInputTitle("");
      showHideToast("Task Added Successfully");
  }

  // filteration arrays
  const completetedTodos = useMemo(() => {
    return todos.filter((t) => {
      return t.isCompleted;
    });
  },[todos]);

  const unCompletetedTodos = useMemo(() => {
    return todos.filter((t) => {
      return !t.isCompleted;
    });
  },[todos]);

  let todosToBeRendered = todos;
  if(todoProgress === "Completed"){
    todosToBeRendered = completetedTodos;
  }
  else if(todoProgress === "UnCompleted"){
    todosToBeRendered = unCompletetedTodos;
  } 
  // end filteration arrays

  // maping todos
  const taskjsx = todosToBeRendered.map((task) => {
    return <Todo key={task.id} todo={task} showDelete={showDeletedialog} showEdit={showEditdialog}/>
  });

  // progress event 
  function handleProgressChange(event,newProgress){
    setTodoProgress(newProgress);
  }
  // end progress event

  // handle DeleteDialog
    function showDeletedialog(todo){
      setdialogTodo(todo);
      setShowDeleteDialog(true);
    }

    function handleDeleteClose(){
        setShowDeleteDialog(false);
    }

    function handleConfirmDelete(){
        todosDispatch({type:"delete",id:dialogTodo.id});
        setShowDeleteDialog(false);
        showHideToast("Task Deleted Successfully");
    }
  // end handle DeleteDialog
  
  // handle EditDialog
    function showEditdialog(todo){
      setShowEditDialog(true);
      setdialogTodo(todo);
      setTaskToEdit({title:todo.title,details:todo.details});
    }  

    function handleCloseEditDialog(){
        setShowEditDialog(false);
    }

    // Edit Dialog Save Handler
    function handleEditSave(){
        todosDispatch({type:"edit",id:dialogTodo.id,todo:taskToEdit});
        handleCloseEditDialog();
        showHideToast("Task Updated Successfully");
    }
  // end handle EditDialog

  return (
    <>
        {/* Delete Dialog */}
        <Dialog
        open={showDeleteDialog}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the task: <strong>{dialogTodo.title}</strong>?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleDeleteClose}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
            </Button>
        </DialogActions>
        </Dialog>
        {/* Delete Dialog */}

        {/* Edit Dialog */}
        <Dialog
            open={showEditDialog}
            onClose={handleCloseEditDialog}
            aria-labelledby="edit-dialog-title"
            >
            <DialogTitle id="edit-dialog-title">Edit Task</DialogTitle>
            <DialogContent>
                <DialogContentText>Edit the title and details of your task.</DialogContentText>
                <TextField
                margin="dense"
                label="Title"
                fullWidth
                variant="outlined"
                value={taskToEdit.title }
                onChange={(e) =>
                    setTaskToEdit({...taskToEdit,title:e.target.value})
                }
                />
                <TextField
                margin="dense"
                label="Details"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={taskToEdit.details || ""}
                onChange={(e) =>
                    setTaskToEdit({...taskToEdit,details:e.target.value})
                }
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseEditDialog}>Cancel</Button>
                <Button onClick={handleEditSave} variant="contained" color="primary">
                Save
                </Button>
            </DialogActions>
        </Dialog>
        {/* Edit Dialog */}
      <Container maxWidth="sm">
          <Card sx={{ minWidth: 275} }
                style={{maxHeight:"80vh",overflowY:"scroll" }}>
              <CardContent>
                  {/* header */}
                  <Typography variant='h2' align='center' style={{fontFamily:"Robo",fontWeight:"bold"}}>
                    My Tasks
                  </Typography>
                  <Divider />
                  {/* header */}
                  {/* Filter Buttons */}
                  <Stack spacing={2} sx={{ alignItems: 'center' , marginTop:2 }}>
                    <ToggleButtonGroup
                            exclusive
                            aria-label="text alignment"
                            value={todoProgress}
                            onChange={(event,todoProgress) => handleProgressChange(event,todoProgress)}
                            >
                            <ToggleButton value="All" aria-label="left aligned">
                              All
                            </ToggleButton>
                            <ToggleButton value="Completed" aria-label="centered">
                              Completed
                            </ToggleButton>
                            <ToggleButton value="UnCompleted" aria-label="right aligned">
                              UnCompleted
                            </ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                {/* Filter Buttons */}
                {/* Add Task */}
                  <Grid container spacing={1} style={{marginTop:"10px"}}>
                      <Grid size={8} >
                              <TextField style={{width:"100%"}} id="outlined-basic" label="TaskName" variant="outlined"  value={inputTitle} onChange={(e) => setInputTitle(e.target.value)} />
                      </Grid>
                      <Grid size={4}>
                              <Button style={{width:"100%",height:"100%"}} variant="contained" onClick={handleAddClick}>AddTask</Button>
                      </Grid>
                  </Grid>
                {/* Add Task */}
                {/* Todos */}
                {taskjsx}
                {/* Todos */}
              </CardContent>
          </Card>
      </Container>
    </>
  );
}