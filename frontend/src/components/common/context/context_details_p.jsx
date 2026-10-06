
import { useState,createContext } from "react";

export const Details_product = createContext()

function  Context_Details_P({children}){
    const [product_de,setproduct_de] = useState(null)

    return (
        <Details_product.Provider value={{product_de,setproduct_de}}>
            {children}
        </Details_product.Provider>
    )
}

export default Context_Details_P