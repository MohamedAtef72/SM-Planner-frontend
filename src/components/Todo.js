import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
// Icons
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
// Component
import { useTodos } from '../contexts/todoContext';
import { useToast } from '../contexts/toastBoarder';
import api from './AxiosIntercepterRefresh';


export default function Todo({todo , showDelete , showEdit}){
    const {todos , todosDispatch} = useTodos();

    const {showHideToast} = useToast();
    // Check Click Handler
async function handleCheckClick(){
        try {
        const updatedStatus = todo.status === "Completed" ? "pending" : "Completed";
    
        // API call to update status
        await api.put(`/Task/Update/${todo.id}`, {
        ...todo,
        status: updatedStatus
        });

        todosDispatch({type:"check",id:todo.id});
        showHideToast("Task Edited Successfully");
        } catch (err) {
            console.error("Error updating task status:", err);
        }
    }
    // Delete Events
    function handleDeleteClick(){
        showDelete(todo);
    }
    // End Delete Events
    // Edit Events 
    function handleEditClick(){
        showEdit(todo);
    }
    // End Edit Events
    return(
        <>
        <Card className='todoCard' sx={{ minWidth: 275,backgroundColor:'#283593',color:'white',marginTop:2}}>
            <CardContent>
                <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <Typography variant='h5' sx={{textAlign:'left', fontWeight:"bold"}} >
                        {todo.title}
                    </Typography>
                    <Typography variant='h6' sx={{textAlign:'left'}} >
                        {todo.description}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    <IconButton size="small" onClick={handleCheckClick}>
                        <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={handleDeleteClick}>
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={handleEditClick}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    </Stack>
                </Grid>
                </Grid>
            </CardContent>
        </Card>
        </>
    )
}