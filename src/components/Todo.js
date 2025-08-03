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
            <CardContent sx={{ padding: { xs: 1.5, sm: 2 } }}> 
                {/* Mobile Layout - Stacked */}
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                    {/* Text Content */}
                    <Box sx={{ marginBottom: 1 }}>
                        <Typography 
                            variant='h5' 
                            sx={{
                                textAlign:'left', 
                                fontWeight:"bold",
                                fontSize: '1.1rem'
                            }} 
                        >
                            {todo.title}
                        </Typography>
                        <Typography 
                            variant='h6' 
                            sx={{
                                textAlign:'left',
                                fontSize: '0.9rem',
                                marginTop: 0.5
                            }} 
                        >
                            {todo.description}
                        </Typography>
                    </Box>
                    
                    {/* Buttons Below Text */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                            onClick={handleCheckClick}
                            className="iconButton"
                            aria-label="isComplete"
                            sx={{
                                color: todo.status === 'Completed' ? 'white' : 'green',
                                background: todo.status === 'Completed' ? 'green' : 'white',
                                border: 'solid lightgray 2px',
                                minWidth: 40,
                                minHeight: 40
                            }}
                        >
                            <CheckIcon />
                        </IconButton>
                        
                        <IconButton 
                            onClick={handleDeleteClick} 
                            className='iconButton' 
                            aria-label="delete"
                            sx={{
                                color:'red',
                                background:'white',
                                border:'solid lightgray 2px',
                                minWidth: 40,
                                minHeight: 40
                            }}
                        >
                            <DeleteOutlineIcon />
                        </IconButton>
                        
                        <IconButton 
                            onClick={handleEditClick} 
                            className='iconButton' 
                            aria-label="Edit"
                            sx={{
                                color:'blue',
                                background:'white',
                                border:'solid lightgray 2px',
                                minWidth: 40,
                                minHeight: 40
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* Desktop/Tablet Layout - Side by Side */}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Grid container spacing={2} alignItems="center">
                        {/* Content Section */}
                        <Grid 
                            item
                            xs={8}   
                            sm={8}   
                            md={8}   
                            lg={8}   
                        >
                            <Typography 
                                variant='h5' 
                                sx={{
                                    textAlign:'left', 
                                    fontWeight:"bold"
                                }} 
                            >
                                {todo.title}
                            </Typography>
                            <Typography 
                                variant='h6' 
                                sx={{
                                    textAlign:'left',
                                    marginTop: 0.5
                                }} 
                            >
                                {todo.description}
                            </Typography>
                        </Grid>
                        
                        {/* Action Buttons Section */}
                        <Grid 
                            item
                            xs={4}   
                            sm={4}   
                            md={4}   
                            lg={4}   
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center'
                            }}
                        >
                            <Stack 
                                direction="row"
                                spacing={1}
                                sx={{
                                    alignItems: 'center'
                                }}
                            >
                                <IconButton
                                    onClick={handleCheckClick}
                                    className="iconButton"
                                    aria-label="isComplete"
                                    sx={{
                                        color: todo.status === 'Completed' ? 'white' : 'green',
                                        background: todo.status === 'Completed' ? 'green' : 'white',
                                        border: 'solid lightgray 2px',
                                        minWidth: 40,
                                        minHeight: 40
                                    }}
                                >
                                    <CheckIcon />
                                </IconButton>
                                
                                <IconButton 
                                    onClick={handleDeleteClick} 
                                    className='iconButton' 
                                    aria-label="delete"
                                    sx={{
                                        color:'red',
                                        background:'white',
                                        border:'solid lightgray 2px',
                                        minWidth: 40,
                                        minHeight: 40
                                    }}
                                >
                                    <DeleteOutlineIcon />
                                </IconButton>
                                
                                <IconButton 
                                    onClick={handleEditClick} 
                                    className='iconButton' 
                                    aria-label="Edit"
                                    sx={{
                                        color:'blue',
                                        background:'white',
                                        border:'solid lightgray 2px',
                                        minWidth: 40,
                                        minHeight: 40
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    </>
);
}