export default function todoReducer(currentTodos,action){
    const actionType = action.type;

    switch(actionType){
        case "load": {
            return action.payload;
             }
        case "add":{
            if(action.todo.title.trim() !== ""){
                const newTask = {
                    id:action.todo.id,
                    title: action.todo.title,
                    description: action.todo.description,
                    status: action.todo.status,
                    dueDate: action.todo.dueDate,
                    };

                const updatedTasks = [...currentTodos,newTask];
                return updatedTasks;
                }}
                
        case "delete":{
            const updatedTasks = currentTodos.filter((t) => t.id !== action.id);
            return updatedTasks;
        }

        case "edit": {
        const updatedTodos = currentTodos.map(todo =>
            todo.id === action.id ? { ...todo, ...action.todo } : todo
        );
        return updatedTodos;
        }

        case "check": {
        const updatedTasks = currentTodos.map((t) => {
            if (t.id === action.id) {
            return { ...t, status: t.status === "Completed" ? "pending" : "Completed" };
            }
            return t;
        });
        return updatedTasks;
        }
        
        default:
            throw Error("UnKnown Type");
    }
}