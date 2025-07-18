// uuid
import { v4 as uuidv4 } from 'uuid';

export default function todoReducer(currentTodos,action){
    const actionType = action.type;

    switch(actionType){
        case "add":{
            if(action.todo.title.trim() !== ""){
                const newTask = {
                    id: uuidv4(),
                    title: action.todo.title,
                    details: "",
                    isCompleted: false
                    };
                const updatedTasks = [...currentTodos,newTask];
                localStorage.setItem("todos",JSON.stringify(updatedTasks));
                return updatedTasks;
                }}
        case "delete":{
            const updatedTasks = currentTodos.filter((t) => t.id !== action.id);
            localStorage.setItem("todos",JSON.stringify(updatedTasks));
            return updatedTasks;
        }

        case "edit":{
            const updatedTasks = currentTodos.map((t) => {
                if(t.id === action.id){
                    return {...t,title:action.todo.title,details:action.todo.details};
                }
                return t;
            });
            localStorage.setItem("todos",JSON.stringify(updatedTasks));
            return updatedTasks;
        }
        
        case "get":{
                const storedTasks = localStorage.getItem("todos");
                if(storedTasks){
                    return JSON.parse(storedTasks);
                }
        }

        case "check":{
            const updatedTasks = currentTodos.map((t) => {
                if(t.id === action.id){
                    return {...t,isCompleted:!t.isCompleted};
                }
                return t;
            });
            localStorage.setItem("todos",JSON.stringify(updatedTasks));
            return updatedTasks;
        }
        
        default:
            throw Error("UnKnown Type");
    }
}