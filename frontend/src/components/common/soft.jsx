

import Login from "./login";
import Register from "./register";
import { useState } from "react";
function Soft() {
    const [pages, setpages] = useState(true)
    return (
        <div className="Soft">
            {
                pages ? <div className="">
                    <Login />
                    <p>don't have an account <span onClick={() => setpages(!pages)}>register</span> </p>

                </div>

                    : <div className="">
                        <Register />
                        <p>already have an account <span onClick={() => setpages(!pages)}>login</span> </p>
                    </div>

            }


        </div >
    )
}
export default Soft