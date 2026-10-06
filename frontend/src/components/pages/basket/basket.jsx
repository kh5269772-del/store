

import { useState, useEffect } from "react"
import Interests from "./interests"
import Shopping from "./shopping"
import Footer from "../../common/footer"

function Basket() {
    const [youdata, setyoudata] = useState(1)



    return (
       <div className="Basket_and_foot">
         <div className="Basket">
            <h2>your shopping cart</h2>

            <div className="nav_basket">
                <span style={youdata == 1 ? { borderBottom: '2px solid #000' } : { borderBottom: '2px solid #00000000' }} onClick={() => setyoudata(1)}>Interests Basket</span>
                <span style={youdata == 2 ? { borderBottom: '2px solid #000' } : { borderBottom: '2px solid #00000000' }} onClick={() => setyoudata(2)}>shopping cart</span>
            </div>

            {youdata == 1 && <Interests />}
            {youdata == 2 && <Shopping />}




    
        </div>
            <Footer />
       </div>
    )
}

export default Basket