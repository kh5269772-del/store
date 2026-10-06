
import { createContext,useState } from "react";

export const UserContext = createContext()

function Context({children}){
    const [user,setuser]=useState(null)
    return(
        <UserContext.Provider value={{user,setuser}}>
            {children}
        </UserContext.Provider>
    )
}
export default Context 