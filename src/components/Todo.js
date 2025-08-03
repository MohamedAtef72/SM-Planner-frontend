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
return (
    <>
        <Card className='todoCard' sx={{ minWidth: 275, backgroundColor:'#283593', color:'white', marginTop:2}}>
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    {/* Content Section */}
                    <Grid 
                        item
                        xs={8}   // 8/12 on mobile screens to leave space for buttons
                        sm={8}   // 8/12 on small screens
                        md={8}   // 8/12 on medium screens
                        lg={8}   // 8/12 on large screens
                    >
                        <Typography variant='h5' sx={{textAlign:'left', fontWeight:"bold"}} >
                            {todo.title}
                        </Typography>
                        <Typography variant='h6' sx={{textAlign:'left'}} >
                            {todo.description}
                        </Typography>
                    </Grid>
                    
                    {/* Action Buttons Section */}
                    <Grid 
                        item
                        xs={4}   // 4/12 on mobile screens
                        sm={4}   // 4/12 on small screens
                        md={4}   // 4/12 on medium screens
                        lg={4}   // 4/12 on large screens
                        sx={{
                            display: 'flex',
                            justifyContent: { xs: 'center', sm: 'flex-end' }, // Center on mobile, right-align on larger screens
                            alignItems: 'center'
                        }}
                    >
                        <Stack 
                            direction="row" 
                            spacing={0.5} // Reduced spacing on mobile
                            sx={{
                                flexWrap: 'nowrap', // Prevent wrapping
                                justifyContent: 'center'
                            }}
                        >
                            <IconButton
                                onClick={handleCheckClick}
                                className="iconButton"
                                aria-label="isComplete"
                                size="small" // Make buttons smaller on mobile
                                sx={{
                                    color: todo.status === 'Completed' ? 'white' : 'green',
                                    background: todo.status === 'Completed' ? 'green' : 'white',
                                    border: 'solid lightgray 2px', // Thinner border
                                    minWidth: { xs: 32, sm: 40 }, // Even smaller on mobile
                                    minHeight: { xs: 32, sm: 40 },
                                    padding: { xs: 0.5, sm: 1 } // Less padding on mobile
                                }}
                            >
                                <CheckIcon fontSize="small" />
                            </IconButton>
                            
                            <IconButton 
                                onClick={handleDeleteClick} 
                                className='iconButton' 
                                aria-label="delete"
                                size="small"
                                sx={{
                                    color:'red',
                                    background:'white',
                                    border:'solid lightgray 2px', // Thinner border
                                    minWidth: { xs: 32, sm: 40 },
                                    minHeight: { xs: 32, sm: 40 },
                                    padding: { xs: 0.5, sm: 1 }
                                }}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                            
                            <IconButton 
                                onClick={handleEditClick} 
                                className='iconButton' 
                                aria-label="Edit"
                                size="small"
                                sx={{
                                    color:'blue',
                                    background:'white',
                                    border:'solid lightgray 2px', // Thinner border
                                    minWidth: { xs: 32, sm: 40 },
                                    minHeight: { xs: 32, sm: 40 },
                                    padding: { xs: 0.5, sm: 1 }
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </>
);
}