
import { useState, useEffect, useContext } from "react"
import { UserContext } from "../common/context/context"
import { BsSignStopFill } from "react-icons/bs";
import { IoMdReturnLeft } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { FaHandPointer } from "react-icons/fa";

import { TiHomeOutline } from "react-icons/ti";
import { IoMdSettings } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { IoShirtOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { LuUserRound } from "react-icons/lu";
import { FcInspection } from "react-icons/fc";
import { BsFillSendFill } from "react-icons/bs";
import { SiHackmd } from "react-icons/si";

import ConHome from "./application/conHome";
import All_Users from "./users/all_users";
import All_Products from "./products/all_products";
import AddProduct from "./products/add_product";
import Add_User from "./users/add_user";
import Add_Category from "./products/category";
import Add_Order from "./orders/add_order";
import All_Transactions from "./orders/all_transactions";
import Send_M from "./application/send_m";
import Settings from "./application/settings"



function Control() {
    const bar_content = [
        { icon: <TiHomeOutline />, text: "Home" },
        { icon: <IoMdSettings />, text: "Settings" },
        { icon: <BsFillSendFill />, text: "Send" },
        { icon: <IoMdAdd />, text: "add product" },
        { icon: <IoMdAdd />, text: "add category" },
        { icon: <SiHackmd />, text: "all products" },
        { icon: <IoMdAdd />, text: "add user" },
        { icon: <LuUserRound />, text: "all users" },
        { icon: <IoMdAdd />, text: "add order" },
        { icon: <FcInspection />, text: "all orders" },

    ]
    // const [nada,setnada]=useState(true)
    const [type, settype] = useState(0)
    const [checkout, setcheckout] = useState(true)

    const Navigate = useNavigate()
    // const { user } = useContext(UserContext)
    // const [tokenIn, settokenIn] = useState('')

    let { user } = useContext(UserContext)
    const token = user

    useEffect(() => {
        refresh()

    }, [])

    function checkindex(text) {
        settype(text)
    }
    console.log(type)











    async function refresh() {

        try {
            const api_refresh = await fetch("http://localhost:3000/refresh_Tok", {
                method: "GET",
                credentials: 'include'
            })
            const data_refresh = await api_refresh.json()

            if (api_refresh.status == 500) {
                Navigate('/')
                return;
            }
            if (!data_refresh.token) {
                Navigate('/')
                return;
            }
            console.log(data_refresh)
            select_token(data_refresh.token)


        } catch (error) {
            console.log(error)
            Navigate('/')
        }
    }

    async function select_token(tok) {
        if (!tok) {

            return Navigate('/')
        }
        try {
            const sendtok = await fetch("http://localhost:3000/select_data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ authhead: tok })
            })

            const data_select = await sendtok.json()
            console.log(data_select)

            //  settokenIn(tok)

            if (sendtok.status == 200) {

                user_role(tok)
                return;
            }
            if (sendtok.status == 500) {
                navigation('/')
                return;
            }
            refresh()


        } catch (error) {
            console.log(error)
            Navigate('/')
        }
    }




    async function user_role(tok) {
        if (!tok) {

            return Navigate('/')
        }
        try {
            const select_role = await fetch("http://localhost:3000/role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ authhead: tok })
            })
            const data_role = await select_role.json()
            console.log(data_role)
            if (select_role.status == 400 || select_role.status == 500) {
                Navigate('/')
                return;
            } if (select_role.status == 200) {
                setcheckout(false)
            }

        } catch (error) {
            console.log(error)
            Navigate('/')

        }
    }

    if (checkout) {
        return (
            <div className="stop" style={{ height: 'calc(100vh - 70px)', background: "#000" }}>

                <svg height={'150px'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g fill="#da5e17" stroke="#da5e17" stroke-width="15"><circle r="15" cx="40" cy="150"><animateTransform attributeName="transform" type="translate" calcMode="spline" dur="2" values="0 0;60 -100" keySplines=".5 0 .5 1" repeatCount="indefinite"></animateTransform></circle><circle r="15" cx="100" cy="50"><animateTransform attributeName="transform" type="translate" calcMode="spline" dur="2" values="0 0;60 100" keySplines=".5 0 .5 1" repeatCount="indefinite"></animateTransform></circle><circle r="15" cx="160" cy="150"><animateTransform attributeName="transform" type="translate" calcMode="spline" dur="2" values="0 0;-120 0" keySplines=".5 0 .5 1" repeatCount="indefinite"></animateTransform></circle></g></svg>
            </div>
        )
    }



    return (
        <div className="Control">
            <div className="control_bar">

                {bar_content.map((item, index) => (

                    <>
                        {index == 0 ? <p className="gopt">application</p> : ''}
                        <div className="item_bar" onClick={() => { checkindex(index) }} key={index}>
                            <i>{item.icon}</i>
                            <p className="text_items">{item.text}</p>

                        </div>
                        {index == 2 ? <p className="gopt">progucts</p> : ""}
                        {index == 5 ? <p className="gopt">users</p> : ""}
                        {index == 7 ? <p className="gopt">orders</p> : ""}
                    </>
                ))}


            </div>
            <div className="control_data">

                {type == 0 && <ConHome />}
                {type == 1 && <Settings />}
                {type == 2 && <Send_M />}
                {type == 3 && <AddProduct />}
                {type == 4 && <Add_Category />}
                {type == 5 && <All_Products />}
                {type == 6 && <Add_User />}
                {type == 7 && <All_Users />}
                {type == 8 && <Add_Order />}
                {type == 9 && <All_Transactions />}


                <div className="Control_panel">
                    <Link to={'/'}>Return</Link>
                </div>
            </div>

        </div>
    )
}

export default Control