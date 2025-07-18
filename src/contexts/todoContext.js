import {createContext , useContext, useReducer} from 'react';

import todoReducer from '../reducers/todosReducer';
 
const TodoContext = createContext([]);

const  TodosProvider = ({children})=>{
    const [todos,todosDispatch] = useReducer(todoReducer,[]);
    return (
        <TodoContext.Provider value={{todos,todosDispatch}}>
            {children}
        </TodoContext.Provider>
    )
 }

 export const useTodos = ()=>{
    return useContext(TodoContext);
 }
 export default TodosProvider;