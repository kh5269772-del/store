
import { useState } from "react"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

import { IoMdCloseCircle } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
function Add_User() {
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [avatar, setavatar] = useState('')
    const [password, setpassword] = useState('')
    const [hash, sethash] = useState(true)
    const [check, setcheck] = useState(false)
    const [close, setclose] = useState(false)



    async function add_us(e) {

        e.preventDefault()

        if (
            name.trim() == '' ||
            email.trim() < 5 ||
            password.trim() < 8 ||
            !/[1-9]/.test(password) ||
            !/[a-z]/.test(password)
        ) {
            setclose(true)
            setTimeout(() => {
                setclose(false)
            }, 1000)
            return;
        }

        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('avatar', avatar)
         delete_stat()

        try {
            const add_api = await fetch("http://localhost:3000/add/user", {
                method: "POST",
                body: formData
            })
            const add_data = await add_api.json()
            console.log(add_data)
           
            if (add_api.status == 201) {
                setcheck(true)
                setTimeout(() => {
                    setcheck(false)
                }, 1000)
            } else {
                setclose(true)
                setTimeout(() => {
                    setclose(false)
                }, 1000)
                return;
            }
        } catch (error) {
            console.log(error)
            setclose(true)
            setTimeout(() => {
                setclose(false)
            }, 1000)
            return;
        }
    }
    

    function delete_stat(){
        setavatar('')
        setname('')
        setemail('')
        setpassword('')
    }








    if (check) {
        return (
            <div className="message_show" style={{ padding: '20px' }}>
                <p>Added successfully</p>
                <i className="Check"><FaRegCheckCircle /></i>
            </div>
        )
    }
    if (close) {
        return (
            <div className="message_show" style={{ padding: '20px' }}>
                <p>An error occurred. Please enter the data correctly.</p>
                <i className="Close"><IoMdCloseCircle /></i>
            </div>
        )
    }



    return (
        <div className="Add_User">

            <form action="" onSubmit={(e) => add_us(e)}>
                <h2>add user</h2>
                <label htmlFor="name">name</label>
                <input onChange={(e) => setname(e.target.value)} value={name} type="text" placeholder="name" id="name" />

                <label htmlFor="email">email</label>
                <input onChange={(e) => setemail(e.target.value)} value={email} type="email" id="email" placeholder="email" />

                <label htmlFor="password">password</label>
                <div className="pass">
                    <input onChange={(e) => setpassword(e.target.value)} value={password} type={hash ? 'password' : 'text'} id="password" placeholder="password" />
                    <i onClick={() => sethash(!hash)} className="passIcon">{hash ? <FaEye /> : <FaEyeSlash />}</i>
                </div>

                <label htmlFor="avatar">avatar</label>
                <input onChange={(e) => setavatar(e.target.files[0])} type="file" id="avatar" />

                <button type="submit">add user</button>
            </form>
        </div>
    )
}
export default Add_User