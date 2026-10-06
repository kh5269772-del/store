
import { GoogleLogin } from "react-oauth-google";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useState, useContext } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import {UserContext} from "./context/context";
import "./common.css"
function Register() {
    const [toggleeye, settoggleeye] = useState(false)
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [avatar, setavatar] = useState("")
    const [unacceptable, setunacceptable] = useState(false)
    const [truedata, settruedata] = useState(false)
    const { setuser } = useContext(UserContext)


    async function google_register(params) {
        try {
            const google_api = await fetch('http://localhost:3000/google/sing_in',{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({credential:params}),
                credentials:'include'
            })
            const google_data = await google_api.json()
            console.log(google_data)
            if (google_data.token) {

                const data = {
                    token: google_data.token,
                    name: google_data.payload.name,
                    avatar: google_data.message == 'register' ? google_data.payload.picture : google_data.payload.avatar
                }
                setuser(data)
                // localStorage.setItem("token", JSON.stringify(google_data.token));

            
            }
        } catch (error) {
            console.log(error)
        }
    }


    async function sendRegister(e) {
        e.preventDefault()
        if (password.length < 8 ||
            ! /[1-9]/.test(password) ||
            name == '' ||
            email == ''
        ) {
            console.log('no data')
            setunacceptable(true)
            setTimeout(() => {
                setunacceptable(false)
            }, 1000);

            return;
        }
        const form_data = new FormData()
        form_data.append('name', name.trim())
        form_data.append('email', email.trim())
        form_data.append('password', password.trim())
        form_data.append('avatar', avatar)

        try {
            const api_register = await fetch("http://localhost:3000/register", {
                method: "POST",
                // headers:{"Content-Type":"application/json"},
                body: form_data,
                credentials:'include'
            })

            const dataregister = await api_register.json()
            console.log(dataregister)
            if (dataregister.token) {
                settruedata(true)
                setTimeout(() => {
                    settruedata(false)
                }, 1000);
                // setuser(dataregister)
                const data = {
                    token: dataregister.token,
                    name: dataregister.name,
                    avatar: dataregister.avatar
                }
                
                setuser(data)

                // localStorage.setItem("token", JSON.stringify(dataregister.token));
                // localStorage.setItem("name", JSON.stringify(dataregister.name));
                // localStorage.setItem("avatar", JSON.stringify(dataregister.avatar));

            }
        } catch (error) {
            console.log(error)
        }
    }
    if (unacceptable) {
        return (
            <div className="message_show">
                <p>Incorrect data.</p>
                <i className="Close"><IoMdCloseCircle /></i>
            </div>
        )
    }
    if (truedata) {
        return (
            <div className="message_show">
                <p>Incorrect data.</p>
                <i className="Check"><FaRegCheckCircle /></i>
            </div>
        )
    }
    return (
        <div className="Register">

            <p className="welcome">Welcome, please create an account</p>
            <div className="google_acount">
                <GoogleLogin onSuccess={(resulte) => {

                    google_register(resulte.credential)
                }} onError={() => {
                    console.log("no acount")
                }} />
            </div>
            <p className="or">____________ or ____________</p>

            <form action="" onSubmit={(e) => sendRegister(e)}>
                <label htmlFor="name">name</label>
                <input type="text" onChange={(e) => setname(e.target.value)} value={name} id="name" placeholder="name" />

                <label htmlFor="email">email</label>
                <input type="email" onChange={(e) => setemail(e.target.value)} value={email} id="email" placeholder="email" />

                <div className="pass">
                    <label htmlFor="password">password</label>
                    <input type={toggleeye ? "text" : "password"} onChange={(e) => setpassword(e.target.value)} value={password} id="password" placeholder="password" />
                    <i className="eye" onClick={() => settoggleeye(!toggleeye)}>{toggleeye ? <FaEye /> : <FaEyeSlash />}</i>
                </div>

                <label htmlFor="file" style={{ cursor: "pointer", border: '1px solid #7067676c', padding: "5px", borderRadius: "5px", }}>Choose an avatar</label>
                <input type="file" onChange={(e) => setavatar(e.target.files[0])} id="file" placeholder="file" style={{ display: "none" }} />
                <button className="continue" type="submit"> continue</button>
            </form>



        </div>
    )
}
export default Register