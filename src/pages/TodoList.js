import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Pagination,
  Skeleton,
  CircularProgress,
  IconButton
} from '@mui/material';
import Cookies from 'js-cookie';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CloseIcon from '@mui/icons-material/Close';

// Components, Contexts, and Services
import Todo from '../components/Todo';
import { useToast } from '../contexts/toastBoarder';
import { useTodos } from '../contexts/todoContext';
import { taskCreate, taskDelete, taskUpdate, myTasks } from '../services/authService';


// NEW: Skeleton Component for a better loading experience
const TodoListSkeleton = () => (
  <Box>
    <Stack alignItems='center' sx={{ my: 2 }}>
      <Skeleton variant="rounded" width={280} height={40} />
    </Stack>
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={8}><Skeleton variant="rounded" height={56} /></Grid>
      <Grid item xs={4}><Skeleton variant="rounded" height={56} /></Grid>
    </Grid>
    <Box sx={{ mt: 3 }}>
      <Skeleton variant="rounded" height={50} sx={{ mb: 1.5 }} />
      <Skeleton variant="rounded" height={50} sx={{ mb: 1.5 }} />
      <Skeleton variant="rounded" height={50} />
    </Box>
  </Box>
);

// NEW: Component for when no tasks are found
const EmptyState = () => (
  <Stack alignItems="center" spacing={2} sx={{ my: 6 }}>
    <AssignmentTurnedInIcon sx={{ fontSize: 60, color: 'grey.400' }} />
    <Typography variant="h6" color="text.secondary">No Tasks Found</Typography>
    <Typography variant="body2" color="text.secondary">
      Try adjusting your filter or adding a new task.
    </Typography>
  </Stack>
);


export default function TodoList() {
  const { todos, todosDispatch } = useTodos();
  const { showHideToast } = useToast();

  // State for UI and Dialogs
  const [inputTitle, setInputTitle] = useState("");
  const [todoProgress, setTodoProgress] = useState("All");
  const [totalPages, setTotalPages] = useState(0);
  const [dialogTodo, setDialogTodo] = useState(null);

  // Loading and Submitting States
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Dialog State
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState({});

  // Delete Dialog State
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Pagination State with Cookie persistence
  const [currentPage, setCurrentPage] = useState(() => Number(Cookies.get('currentPage')) || 1);

  // Fetch todos from the server
  const fetchTodos = async (page = currentPage, status = todoProgress) => {
    setLoading(true);
    try {
      const res = await myTasks(page, status);
      setTotalPages(res.data.pagination.totalPages);
      todosDispatch({ type: "load", payload: res.data.tasks });
    } catch (error) {
      console.error("Error fetching todos:", error);
      showHideToast("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch todos when page or filter changes
  useEffect(() => {
    fetchTodos(currentPage, todoProgress);
  }, [currentPage, todoProgress]);

  // === EVENT HANDLERS ===

  const handlePaginationClick = (event, page) => {
    setCurrentPage(page);
    Cookies.set('currentPage', page);
  };

  const handleProgressChange = (event, newProgress) => {
    if (newProgress !== null) {
      setTodoProgress(newProgress);
      setCurrentPage(1);
      Cookies.set('currentPage', 1);
    }
  };

  async function handleAddClick(e) {
    e.preventDefault(); // Prevent form reload
    if (inputTitle.trim() === "") {
      showHideToast("Task Title is Required", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await taskCreate({
        title: inputTitle,
        description: "details",
        status: "pending",
        dueDate: new Date().toISOString()
      });
      setInputTitle("");
      showHideToast("Task created successfully", "success");
      await fetchTodos(currentPage, todoProgress); // Refetch to stay on the same page
    } catch (error) {
      showHideToast("Failed to create task", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusUpdate(todo, newStatus) {
    try {
      await taskUpdate(todo.id, { ...todo, status: newStatus }, newStatus);
      showHideToast("Status updated!", "success");
      await fetchTodos();
    } catch (error) {
      showHideToast("Failed to update status", "error");
    }
  }

  function showEditdialog(todo) {
    setDialogTodo(todo);
    setTaskToEdit({ title: todo.title, details: todo.description });
    setShowEditDialog(true);
  }

  async function handleEditSave() {
    setIsSubmitting(true);
    try {
      await taskUpdate(dialogTodo.id, {
        ...dialogTodo,
        title: taskToEdit.title,
        description: taskToEdit.details,
      });
      setShowEditDialog(false);
      showHideToast("Task successfully updated", "success");
      await fetchTodos();
    } catch (error) {
      showHideToast("Failed to update task", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  function showDeletedialog(todo) {
    setDialogTodo(todo);
    setShowDeleteDialog(true);
  }

  async function handleConfirmDelete() {
    setIsSubmitting(true);
    try {
      await taskDelete(dialogTodo.id);
      setShowDeleteDialog(false);
      showHideToast("Task deleted successfully", "success");

      const newPage = (todos.length === 1 && currentPage > 1) ? currentPage - 1 : currentPage;
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      } else {
        await fetchTodos();
      }
    } catch (error) {
      showHideToast("Failed to delete task", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const taskList = todos.map((task) => (
    <Todo
      key={task.id}
      todo={task}
      showDelete={showDeletedialog}
      showEdit={showEditdialog}
      onStatusChange={handleStatusUpdate}
    />
  ));

  return (
    <>
      {/* Dialogs */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <DeleteForeverIcon sx={{ mr: 1 }} /> Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
            <Typography component="div" sx={{ mt: 1 }}><strong>{dialogTodo?.title}</strong></Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>
            <Box display="flex" alignItems="center">
                <EditIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Edit Task
                </Typography>
                <IconButton onClick={() => setShowEditDialog(false)}><CloseIcon /></IconButton>
            </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={taskToEdit.title || ""}
            onChange={(e) => setTaskToEdit({ ...taskToEdit, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Details"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={taskToEdit.details || ""}
            onChange={(e) => setTaskToEdit({ ...taskToEdit, details: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Content */}
      <Box sx={{ bgcolor: 'grey.100', minHeight: '90vh' , py: 4 }}>
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
            <Typography variant='h4' component="h1" align='center' sx={{ fontWeight: "bold", mb: 2 }}>
              My Tasks
            </Typography>
            <Divider />

            {loading ? (
              <TodoListSkeleton />
            ) : (
              <>
                <Stack alignItems='center' sx={{ my: 2 }}>
                  <ToggleButtonGroup exclusive value={todoProgress} onChange={handleProgressChange}>
                    <ToggleButton value="All">All</ToggleButton>
                    <ToggleButton value="Completed">Completed</ToggleButton>
                    <ToggleButton value="pending">Pending</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                <Box component="form" onSubmit={handleAddClick}>
                  <Grid container spacing={2}>
                    <Grid  size={{ xs: 6, md: 8 }}>
                      <TextField fullWidth label="Add a new task..." variant="outlined" value={inputTitle} onChange={(e) => setInputTitle(e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <Button type="submit" fullWidth sx={{ height: '100%', py: 1.8 }} variant="contained" startIcon={<AddIcon />} disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24} /> : 'Add Task'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                
                {todos.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        <Box sx={{ mt: 3 }}>
                            {taskList}
                        </Box>
                        {totalPages > 1 && (
                            <Stack alignItems="center" sx={{ mt: 4 }}>
                                <Pagination count={totalPages} page={currentPage} onChange={handlePaginationClick} color="primary" />
                            </Stack>
                        )}
                    </>
                )}
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
}