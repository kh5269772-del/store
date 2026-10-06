
import { GoogleLogin } from "react-oauth-google";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useState, useContext } from "react";
import "./common.css"
import { UserContext } from "./context/context";
import { IoMdCloseCircle } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
function Login() {
    const [unacceptable, setunacceptable] = useState(false)
    const [truedata, settruedata] = useState(false)
    const [toggleeye, settoggleeye] = useState(false)
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const { setuser } = useContext(UserContext)


    async function google_log(params) {
        // console.log(params)
        try {
            const google_api = await fetch('http://localhost:3000/google/sing_in', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: params }),
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

    async function login(e) {
        e.preventDefault()
        try {
            const login_api = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password }),
                    credentials:'include'
            })
            const login_data = await login_api.json()
            console.log(login_data)
            if (login_api.status == 500) {
                setunacceptable(true)
                setTimeout(() => {
                    setunacceptable(false)
                }, 1000);

            }
            if (login_data.token) {
                settruedata(true)
                setTimeout(() => {
                    settruedata(false)
                }, 1000);
              
                const data = {
                    token: login_data.token,
                    name: login_data.name,
                    avatar: login_data.avatar,
                  
                }
                setuser(data)
                // localStorage.setItem('token', JSON.stringify(login_data.token))
           
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
                   
                    google_log(resulte.credential)
                }} onError={() => {
                    console.log("no acount")
                }} />
            </div>
            <p className="or">____________ or ____________</p>

            <form action="" onSubmit={(e) => login(e)}>
                <label htmlFor="email">email</label>
                <input onChange={(e) => setemail(e.target.value)} value={email} type="email" id="email" placeholder="email" />
                <div className="pass">
                    <label htmlFor="password">password</label>
                    <input onChange={(e) => setpassword(e.target.value)} value={password} type={toggleeye ? "text" : "password"} id="password" placeholder="password" />
                    <i className="eye" onClick={() => settoggleeye(!toggleeye)}>{toggleeye ? <FaEye /> : <FaEyeSlash />}</i>
                </div>
                <button type="submit" className="continue">continue</button>
            </form>



        </div>
    )
}

export default Login