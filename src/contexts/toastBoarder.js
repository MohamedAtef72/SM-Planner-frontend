import { createContext , useContext, useState } from "react";
import MySnackBar from "../components/MySnackBar";

const ToastBoarder = createContext({});

export const ToastProvider = ({children})=>{
    const [open, setOpen] = useState(false);
    const [message,setMessage] = useState("");

    function showHideToast(message){
      setMessage(message);
      setOpen(true);
      setTimeout(
        ()=>{
          setOpen(false);
        },2000
      )
    }
    return (
        <ToastBoarder.Provider value={{showHideToast}}>
            <MySnackBar open = {open} message={message}/>
            {children}
        </ToastBoarder.Provider>
    )
}

export const useToast = ()=>{
    return useContext(ToastBoarder);
}