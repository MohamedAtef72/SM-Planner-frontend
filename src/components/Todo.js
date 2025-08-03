import React from 'react';
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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Component
import { useTodos } from '../contexts/todoContext';
import { useToast } from '../contexts/toastBoarder';
import api from './AxiosIntercepterRefresh';


export default function Todo({todo , showDelete , showEdit}){
    const {todos , todosDispatch} = useTodos();
    const {showHideToast} = useToast();

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('xs')) || useMediaQuery('(max-width:600px)');

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
    // Edit Events 
    function handleEditClick(){
        showEdit(todo);
    }

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
                    <Grid item xs={12} sm={4} sx={{display: 'flex', justifyContent: isXs ? 'flex-start' : 'flex-end', alignItems: 'center'}}>
                        {/* Action Buttons */}
                            <Stack direction={isXs ? "column" : "row"} spacing={1} sx={{width: isXs ? '100%' : 'auto'}}>
                                <IconButton
                                onClick={handleCheckClick}
                                className="iconButton"
                                aria-label="isComplete"
                                style={{
                                    color: todo.status === 'Completed' ? 'white' : 'green',
                                    background: todo.status === 'Completed' ? 'green' : 'white',
                                    border: 'solid lightgray 3px'
                                }}
                                >
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