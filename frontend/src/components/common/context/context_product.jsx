
import { useState,createContext } from "react";

export const product_context = createContext()

function Create_Context_Product({children}){

    const [product_con,setproduct_con] = useState(null)
    return(
        <product_context.Provider value={{product_con,setproduct_con}}>
            {children}
        </product_context.Provider>
    )
}

export default Create_Context_Product