
import { useState,useEffect } from "react";
import { Link } from "react-router-dom"
import { DiNpm } from "react-icons/di";
import { SlSocialLinkedin } from "react-icons/sl";
import { CiTwitter } from "react-icons/ci";
import { PiGithubLogo } from "react-icons/pi";
import { MdOutlinePhone } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";

function Footer() {
    const [Unknown,setUnknown] = useState(false)


    useEffect(()=>{
        refresh()
    },[])

    
  async function refresh() {

    try {
      const api_refresh = await fetch("http://localhost:3000/refresh_Tok", {
        method: "GET",
        credentials: 'include'
      })
      const data_refresh = await api_refresh.json()

      if (api_refresh.status == 500) {
        setUnknown(false)

        return;
      }
      if (!data_refresh.token) {
        setUnknown(false)
        return;
      }
      select_token(data_refresh.token)
    } catch (error) {
      console.log(error)
      setUnknown(false)
    }
  }

  async function select_token(tok) {
    if (!tok) {
      setUnknown(false)
      return
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
        setUnknown(true)
        localStorage.setItem('id', JSON.stringify(data_select.id))
        return;
      }
      if (sendtok.status == 500) {
        setUnknown(false)
        return;
      }
      refresh()

    } catch (error) {
      console.log(error)
      setUnknown(false)
    }
  }
    return (

        <div className="Footer">
            <div className="Footer_top">
                <div className="row_data">
                <h2 className="lo"><span>rp</span>ctr.</h2>
                <p>Welcome to rpctr. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta quas sint harum? Exercitationem aperiam, nostrum ut minus cupiditate sunt qui quae voluptatibus? Perferendis laudantium id harum non qui eos maiores!</p>
            </div>

            <div className="row_data">
                <h2>pages</h2>
                <Link to={'/'}>hame</Link>
                <Link to={'/product/user'}>products</Link>
                <Link to={Unknown?'/profile':'/'}>profile</Link>
                <Link to={Unknown?'/basket':'/'}>basket</Link>

            </div>

            <div className="row_data">
                <h2>contact</h2>
                <p><i><MdOutlinePhone /></i> 0123456789</p>
                <p><i><MdOutlineEmail /></i> @kgmail.com</p>
                <p><i><FiMapPin /></i> Egypt, Kafr El Sheikh, Division 2</p>


            </div>
            </div>

            <div className="footer_icons">
                <i><DiNpm /></i>
                <i><SlSocialLinkedin /></i>
                <i><CiTwitter /></i>
                <i><PiGithubLogo /></i>
            </div>
            <p className="copy"><span>&copy;All rights reserved. <a  target="parent" href="http://wa.me/201012753041">khaled</a></span></p>
        </div>
    )
}



export default Footer