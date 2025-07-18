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
import { useTodos } from '../contexts/todoContext';
import { useToast } from '../contexts/toastBoarder';



export default function Todo({todo , showDelete , showEdit}){
    const {todos , todosDispatch} = useTodos();

    const {showHideToast} = useToast();
    // Check Click Handler
    function handleCheckClick(){
        todosDispatch({type:"check",id:todo.id});
        showHideToast("Task Edited Successfully");
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
                    <Grid size={8}>
                       <Typography variant='h5' sx={{textAlign:'left', fontWeight:"bold"}} >
                            {todo.title}
                       </Typography>
                       <Typography variant='h6' sx={{textAlign:'left'}} >
                            {todo.details}
                       </Typography>
                    </Grid>
                    <Grid size={4}>
                        {/* Action Buttons */}
                            <Stack direction="row" spacing={1}>
                                <IconButton onClick={handleCheckClick} className='iconButton' aria-label="isComplete" 
                                            style={{color:todo.isCompleted?'white':'green',background:todo.isCompleted?'green':'white',border:'solid lightgray 3px'}}>
                                    <CheckIcon />
                                </IconButton>
                                <IconButton onClick={handleDeleteClick} className='iconButton' aria-label="delete"  color="primary" 
                                            style={{color:'red',background:'white',border:'solid lightgray 3px'}}>
                                    <DeleteOutlineIcon />
                                </IconButton>
                                <IconButton onClick={handleEditClick} className='iconButton' color="secondary" aria-label="Edit" style={{color:'blue',background:'white',border:'solid lightgray 3px'}}>
                                    <EditIcon />
                                </IconButton>
                            </Stack>
                        {/* Action Buttons */}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
        </>
    )
}