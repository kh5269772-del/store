

import { createContext, useState } from "react";

export const OrderIdContext = createContext()

function Contextto({children}) {
    const [selectId, setselectId] = useState(null)
    return(
        <OrderIdContext.Provider value={{selectId,setselectId}}>
            {children}
        </OrderIdContext.Provider>
    )
}
export default Contextto