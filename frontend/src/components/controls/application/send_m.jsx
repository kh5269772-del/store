

import { useState, useEffect } from "react"
import { IoMdCloseCircle } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
function Send_M() {

    const [success, setsuccess] = useState('')
    const [cancel, setcancel] = useState('')
    const [phone, setphone] = useState(0)
    const [check, setcheck] = useState(false)
    const [close, setclose] = useState(false)
    const [Country_code,setCountry_code]=useState(0)

    useEffect(() => {
        importMessage()
    }, [])

    async function importMessage() {

        try {
            const api_message = await fetch("http://localhost:3000/importMessage")
            const data_message = await api_message.json()
            setsuccess(data_message.data.success)
            setcancel(data_message.data.cancel)
            setphone(data_message.data.phone)
            setCountry_code(data_message.data.code)
        } catch (error) {
            console.log(error)
        }
    }

    async function sendData() {
        if (phone.length < 8 ||
            success.trim() == ''||
            cancel.trim() == ''||
            Country_code.trim() == ''
        ) {
            setclose(true)
            setTimeout(() => {
                setclose(false)
                 importMessage()
            }, 1000)
            return
        }
        try {
            const api_Storage_Message = await fetch("http://localhost:3000/message/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phone, cancel: cancel, success: success,code:Country_code })
            })
            const data_Storage_Message = await api_Storage_Message.json()
            console.log(data_Storage_Message)
            importMessage()
               setcheck(true)
            setTimeout(() => {
                setcheck(false)
                 importMessage()
            }, 1000)
            return

        } catch (error) {
            console.log(error)
            setclose(true)
            setTimeout(() => {
                setclose(false)
                 importMessage()
            }, 1000)
            return
        }
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
        <div className="Send_M">
            <h2>Settings for messages sent to the user</h2>
            <div className="send_data_email">

                <label htmlFor="phone">Contact number</label>
                <input onChange={(e)=>setCountry_code(e.target.value)}  value ={Country_code}type="text" style={{width:'50px',margin:"0 10px"}} />
                <input  onChange={(e) => setphone(e.target.value)} value={phone} type="number" id="phone" />

                <p><label htmlFor="success">Send an email to the user upon a <span style={{ color: '#15c7a3' }}>successful</span> purchase.</label></p>
                <textarea onChange={(e) => setsuccess(e.target.value)} value={success} name="" id="success" placeholder="enter message"></textarea>

                <p><label htmlFor="cancel">Send an email to the user upon a <span style={{ color: 'red' }}>failed</span> purchase.</label></p>
                <textarea onChange={(e) => setcancel(e.target.value)} value={cancel} name="" id="cancel" placeholder="enter message"></textarea>

                <button onClick={() => sendData()}>storage</button>
            </div>
        </div>
    )
}
export default Send_M