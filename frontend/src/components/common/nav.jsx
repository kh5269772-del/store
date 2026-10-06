

// import { Link } from "react-router-dom"
import "./common.css"
import { IoStorefrontOutline } from "react-icons/io5";
import { FaStoreAlt } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import {IoCartOutline} from"react-icons/io5"  
// import { useParams } from "react-router-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiAiGenerate3dLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import { LuLogOut } from "react-icons/lu";
import { googleLogout } from "react-oauth-google";
import Soft from "./soft";
import { UserContext } from "./context/context";




function Nav() {
    const [toggle, settoggle] = useState(false)
      const [Unknown, setUnknown] = useState(false)  
    const location = useLocation()
    const path = location.pathname.split('/')[1]
    const Navigate = useNavigate()




    let { user } = useContext(UserContext)
    const { setuser } = useContext(UserContext)


    const [avatar_s, setavatar_s] = useState('')
    const [name_s, setname_s] = useState('')
    const [tokenIn, settokenIn] = useState('')
    const [logou,setlogou] = useState(false)




    let token = user ? user.token : tokenIn
    let avatar = user ? user.avatar : avatar_s
    let name = user ? user.name : name_s

    useEffect(() => {
        console.log(user)
        settoggle(false)
    }, [user])

    useEffect(() => {

        refresh()
    })

    async function refresh() {
        try {
            const api_refresh = await fetch("http://localhost:3000/refresh_Tok", {
                method: "GET",
                credentials: 'include'
            })
            const data_refresh = await api_refresh.json()
            console.log(data_refresh)
            if(!data_refresh.token){
                return;
            }
            select_token(data_refresh.token)
        } catch (error) {
            console.log(error)
        }
    }

    async function select_token(tok) {
        try {
            const sendtok = await fetch("http://localhost:3000/select_data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ authhead: tok })
            })

            const data_select = await sendtok.json()
            console.log(data_select)

 

            if (sendtok.status == 500) {
                 setUnknown(false)
                googleLogout()
                localStorage.clear()
                setuser(null)
                return;

            }
             setUnknown(true)
            settokenIn(tok)
            setname_s(data_select.name)
            setavatar_s(data_select.avatar)
            localStorage.setItem('id', JSON.stringify(data_select.id))


        } catch (error) {
            console.log(error)
             setUnknown(false)
        }
    }
    const use = JSON.parse(localStorage.getItem('id'))
    const socket = io('http://localhost:3000')

    if (use) {
        socket.emit('join', use)
    }


    socket.on('onlineUser', (data) => {
        //    console.log(data)
    })

    function deleteal(){
      
       settokenIn('')
    }


    async function goole_logout() {
        settoggle(!toggle)
        try {
            const logout = await fetch("http://localhost:3000/logout", {
                credentials: "include"
            })
            const dat = await logout.json()
            console.log(dat)
            deleteal()
        } catch (error) {
            console.log(error)
            deleteal()
        }
    }

    function tologin() {
        settoggle(!toggle)
    }
    return (
        <div className={path =='control' ? 'black_Nav' : 'Nav'}>
            <div className="navbar">

                <div className="logo" onClick={() => Navigate('/')} style={{ cursor: "pointer" }}><h1><span>rp</span>ctr.</h1></div>

                <div className="links">

                    <div className="icon2">
                        <i  onClick={()=>Navigate('/product/user')}><IoStorefrontOutline /></i>
                        <i onClick={()=>Navigate(Unknown?'/basket':'/register_req')}><IoCartOutline /></i>
                    </div>

                    {tokenIn !='' && <div className="avamor" onClick={() => tologin()}>{avatar ? <img src={avatar} alt="" /> : <div className="nam" >{name[0]}</div>}</div>}

                    {tokenIn == '' && <button onClick={() => tologin()}>login</button>}

                </div>

            </div>
            {tokenIn !='' ? <div className="sing_out">{toggle ? <div className="sing_in">
                <Link to={'/profile'} onClick={()=>settoggle(!toggle)}> <i><RiAiGenerate3dLine /></i> <p>my_profile</p> </Link>
                <button onClick={() => goole_logout()}><i><LuLogOut /></i> <p>logout</p></button>

            </div> : ''}</div> :
                <div>
                    {toggle ? <div className="sing_in">
                        <i className="close" onClick={() => tologin()}><IoMdClose /></i>
                        <Soft />

                    </div> : ''}
                </div>}
        </div>

    )
}
export default Nav