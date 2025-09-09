import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

// Icons
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

export default function Todo({ todo, showDelete, showEdit, onStatusChange }) {
  
  // This handler now simply tells the parent component to update the status.
  function handleCheckClick() {
    const newStatus = todo.status === "Completed" ? "pending" : "Completed";
    // Call the function passed down from the parent (TodoList.js)
    onStatusChange(todo, newStatus);
  }

  // This handler tells the parent to show the delete confirmation dialog.
  function handleDeleteClick() {
    showDelete(todo);
  }

  // This handler tells the parent to show the edit dialog.
  function handleEditClick() {
    showEdit(todo);
  }

  return (
    <Card className='todoCard' sx={{ minWidth: 275, backgroundColor: '#283593', color: 'white', marginTop: 2 }}>
      <CardContent>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between" 
          wrap="nowrap" 
        >
          {/* Section for Title and Description (Now fluid) */}
          <Grid item xs> 
            <Typography
              variant='h5'
              sx={{
                textAlign: 'left',
                fontWeight: "bold",
                textDecoration: todo.status === "Completed" ? 'line-through' : 'none',
                wordBreak: 'break-word', // KEY CHANGE: Prevents long text from overflowing
              }}
            >
              {todo.title}
            </Typography>
            <Typography variant='body1' sx={{ textAlign: 'left' }}>
              {todo.description}
            </Typography>
          </Grid>
          {/* Section for Action Buttons (Now has a fixed width based on content) */}
          <Grid item xs="auto" sx={{ pl: 2 }}> {/* KEY CHANGE: Takes only needed space + padding */}
            <Stack direction="row" spacing={1}>
              {/* Check/Complete Button */}
              <IconButton
                onClick={handleCheckClick}
                aria-label="isComplete"
                sx={{ // Use the `sx` prop for consistency
                  color: todo.status === 'Completed' ? 'white' : '#4caf50',
                  backgroundColor: todo.status === 'Completed' ? '#4caf50' : 'white',
                  border: '2px solid',
                  borderColor: todo.status === 'Completed' ? '#4caf50' : '#e0e0e0',
                  '&:hover': {
                    backgroundColor: todo.status === 'Completed' ? '#388e3c' : '#f5f5f5',
                  }
                }}
              >
                <CheckIcon />
              </IconButton>
              
              {/* Edit Button */}
              <IconButton
                onClick={handleEditClick}
                aria-label="Edit"
                sx={{
                    color: 'white',
                    backgroundColor: '#2196f3',
                    border: '2px solid #e0e0e0'
                }}
              >
                <EditIcon />
              </IconButton>

              {/* Delete Button */}
              <IconButton
                onClick={handleDeleteClick}
                aria-label="delete"
                sx={{
                    color: 'white',
                    backgroundColor: '#f44336',
                    border: '2px solid #e0e0e0'
                }}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}