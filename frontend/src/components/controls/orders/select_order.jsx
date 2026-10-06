
import { useNavigate, Link, data } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { OrderIdContext } from "../../common/context/cotext_order"
import OrderComparisonChart from "../../recharts/chart_order"
import { MdOutlineSecurity } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { GrStatusGood } from "react-icons/gr";
import { BsFillSendFill } from "react-icons/bs";
import { AiOutlineProduct } from "react-icons/ai";

import { IoMdCloseCircle } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import { FiAnchor } from "react-icons/fi";





function Select_Order() {

    const [order, setorder] = useState([])
    const [product, setproduct] = useState([])
    const [user, setuser] = useState([])
    const [status, setstatus] = useState([])
    const [showSend, setshowSend] = useState(false)
    const [message, setmessage] = useState('')
    const [check, setcheck] = useState(false)
    const [close, setclose] = useState(false)
    const [checkout, setcheckout] = useState(true)
    const [loginSend, setloginsend] = useState(false)
    const now = new Date(order.created_at)
   



    let { selectId } = useContext(OrderIdContext)
    const Navigate = useNavigate()


    const icons_user = [
        { background: '#c4c71563', icon: <FaRegUser /> },
        { background: '#15c7a35e', icon: <GrStatusGood /> },
        { background: '#1562c76c', icon: <MdOutlineSecurity /> },
    ]
    const icons_product = [
        { background: '#c4c71563', icon: <AiOutlineProduct /> },
        { background: '#15c7a35e', icon: <GrStatusGood /> },
        { background: '#1562c76c', icon: <MdOutlineSecurity /> },
    ]



    useEffect(() => {
        refresh()
    }, [])



    async function refresh() {

        try {
            const api_refresh = await fetch("http://localhost:3000/refresh_Tok", {
                method: "GET",
                credentials: 'include'
            })
            if (api_refresh.status == 500) {
                Navigate('/')
                return
            }
            const data_refresh = await api_refresh.json()

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
        try {
            const sendtok = await fetch("http://localhost:3000/select_data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ authhead: tok })
            })

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
            if (select_role.status != 200) {
                Navigate('/')
                return;
            }
            detalis_order()

        } catch (error) {
            console.log(error)
            Navigate('/')

        }
    }




    async function detalis_order() {
        setcheckout(false)
        const id = selectId || JSON.parse(localStorage.getItem("orderId"))
        if (!id) return;
        try {
            const api_detalis = await fetch('http://localhost:3000/details/order', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id })
            })
            const data_detalis = await api_detalis.json()
            console.log(data_detalis)
            setorder(data_detalis.order)
            setproduct(data_detalis.product)
            setuser(data_detalis.user)
            setcheckout(false)
             localStorage.setItem("created", JSON.stringify(data_detalis.order.created_at))


        } catch (error) {
            console.log * (error)
        }
    }

    const socket = io("http://localhost:3000")

    socket.on('onlineUser', (data) => {
        setstatus(data)
    })

    function dataShow() {
        setshowSend(!showSend)
    }

    async function send_email() {
        setshowSend(!showSend)
        const emailUser = user.email

        if (message.trim() == '' || emailUser == '') {
            setclose(true)
            setmessage('')
            setTimeout(() => {
                setclose(false)
            }, 1000);
            return
        }
             setloginsend(true)

        try {
            const email_api = await fetch("http://localhost:3000/send/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: message, user: emailUser })
            })
            setmessage('')

            if (email_api.status != 200) {
                setclose(true)
                setTimeout(() => {
                    setclose(false)
                }, 1000);
                return
            }

            const email_data = await email_api.json()
            console.log(email_data)

            setcheck(true)
            setloginsend(false)
            setTimeout(() => {
                setcheck(false)
            }, 1000);
            return


        } catch (error) {
            console.log(error)
        }
    }

    function isEventKey(e) {
        if (e.key == 'Enter') {
            send_email()
        } else {
            return;
        }
    }




    if (check) {
        return (
            <div className="message_show" style={{ width: '100%', height: 'calc(100vh - 70px)', background: "#0d1117", padding: '20px', color: "#fff" }}>
                <p>Sent successfully.</p>
                <i className="Check"><FaRegCheckCircle /></i>
            </div>
        )
    }
    if (close) {
        return (
            <div className="message_show" style={{ width: '100%', height: 'calc(100vh - 70px)', background: "#0d1117", padding: '20px', color: "#fff" }}>
                <p>An error occurred. Please enter the data correctly.</p>
                <i className="Close"><IoMdCloseCircle /></i>
            </div>
        )
    }



    if (checkout) {
        return (
            <div className="stop" style={{ height: 'calc(100vh - 70px)', background: "#000" }}>

                <svg height={'150px'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g fill="#da5e17" stroke="#da5e17" stroke-width="15"><circle r="15" cx="40" cy="150"><animateTransform attributeName="transform" type="translate" calcMode="spline" dur="2" values="0 0;60 -100" keySplines=".5 0 .5 1" repeatCount="indefinite"></animateTransform></circle><circle r="15" cx="100" cy="50"><animateTransform attributeName="transform" type="translate" calcMode="spline" dur="2" values="0 0;60 100" keySplines=".5 0 .5 1" repeatCount="indefinite"></animateTransform></circle><circle r="15" cx="160" cy="150"><animateTransform attributeName="transform" type="translate" calcMode="spline" dur="2" values="0 0;-120 0" keySplines=".5 0 .5 1" repeatCount="indefinite"></animateTransform></circle></g></svg>
            </div>
        )
    }



    return (
        <div className="Select_Order">




            <div className="data_detalis">

                <div className="detalis_user">
                    <h2>user</h2>
                    <div className="icons_user">
                        {icons_user.map((item) => (
                            <i className="svg_icons" style={{ background: item.background }}>{item.icon}</i>
                        ))}
                    </div>
                    <div className="detalis_user_top">
                        {user.avatar ? <img src={user.avatar} alt="" /> :
                            <div className="avatar_name">{user.name ? user.name[0] : ''}</div>}
                        <p>{user.name}</p>
                    </div>
                    <p>Email : {user.email}</p>
                    <p style={{ textTransform: "capitalize" }}>Role : {user.role} </p>
                    <p style={status.find((element) => element == user.id) ? { color: '#15c7a3' } : { color: 'red' }}>Status : {status.find((element) => element == user.id) ? 'online' : 'ofline'}</p>
                    {!showSend ?
                        <>
                            <button onClick={() => dataShow()}>send message</button>
                            {loginSend && <span>
                                <svg height={'40px'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><radialGradient id="a18" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="#DA5E17"></stop><stop offset=".3" stop-color="#DA5E17" stop-opacity=".9"></stop><stop offset=".6" stop-color="#DA5E17" stop-opacity=".6"></stop><stop offset=".8" stop-color="#DA5E17" stop-opacity=".3"></stop><stop offset="1" stop-color="#DA5E17" stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a18)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="#DA5E17" stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg></span>}
                        </>
                        :
                        <div className="sendEmail">
                            <textarea onKeyUp={(e) => isEventKey(e)} onChange={(e) => setmessage(e.target.value)} value={message} type="text" id="message" />
                            <i onClick={() => send_email()}><BsFillSendFill /></i>
                        </div>
                    }
                </div>





                <div className="detalis_product">

                    <h2>order</h2>
                    <div className="icons_product">
                        {icons_product.map((item) => (
                            <i className="svg_icons" style={{ background: item.background }}>{item.icon}</i>
                        ))}
                    </div>
                    <div className="detalis_product_top">
                        <img src={product.image} alt="" />
                        <p>Name : {product.name}</p>
                    </div>

                    <p style={{ textTransform: "capitalize" }}>price : {product.price} </p>
                    <p>Quantity : {order.quantity}</p>
                    <p>Totle : {parseInt(product.price * order.quantity)}</p>
                    <p style={{ color: order.status == 'success' ? '#15c7a3' : 'red' }}>Status : {order.status} {order.status == 'success' ? '😀' : '😢'}</p>
                    <p>Category : {product.category}</p>
                    <p>Creadet_at : {now.toLocaleString().split(',')[0]}</p>
                    <p>Time : {now.toLocaleString().split(',')[1]}</p>



                </div>

                <div className="detalis_order">

                </div>

            </div>


            <OrderComparisonChart />










            <div className="Control_panel">
                <Link to={'/control'}>Return</Link>
            </div>
        </div>
    )
}

export default Select_Order
