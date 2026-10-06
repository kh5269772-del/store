
import { useState, useEffect, useContext } from "react"
import { Details_product } from "../../common/context/context_details_p";
import { FaMinus } from "react-icons/fa6";
import { MdOutlineAdd } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { FaCcStripe } from "react-icons/fa";
import Footer from "../../common/footer";
import { FaRegCheckCircle } from "react-icons/fa";
import { RiVisaFill } from "react-icons/ri";
import { FaCcMastercard } from "react-icons/fa";
function Details_Product() {
    const [product, setproduct] = useState([])
    const [colors, setcolors] = useState([])
    const [sizes, setsizes] = useState([])
    const [select_color, setselect_color] = useState('')
    const [select_size, setselect_size] = useState('')
    const [quantity, setquantity] = useState(1)
    let { product_de } = useContext(Details_product)
    const productId = product_de || JSON.parse(sessionStorage.getItem("product_details"))
    const userId = JSON.parse(localStorage.getItem('id'))
    const [loding, setloding] = useState(false)
    const [Check, setCheck] = useState(false)
    console.log(colors, sizes)




    useEffect(() => {
        ptoduct_show()
    }, [])

    async function ptoduct_show() {

        console.log(productId)
        try {
            const api_ptoduct_show = await fetch("http://localhost:3000/details/product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: productId })
            })
            const data_ptoduct_show = await api_ptoduct_show.json()
            console.log(data_ptoduct_show)
            setproduct(data_ptoduct_show.product)
            setcolors(data_ptoduct_show.product.colors != '' ? data_ptoduct_show.product.colors.split(',') : [])
            setsizes(data_ptoduct_show.product.sizes != '' ? data_ptoduct_show.product.sizes.split(',') : [])

            setselect_color(data_ptoduct_show.product.colors != '' ? data_ptoduct_show.product.colors.split(',')[0] : [])
            setselect_size(data_ptoduct_show.product.sizes != '' ? data_ptoduct_show.product.sizes.split(',')[0] : [])
        } catch (error) {
            console.log(error)
        }
    }


    async function add_basket() {
        try {
            const api_add_basket = await fetch("http://localhost:3000/add_basket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId,
                    productId: product.id,
                    quantity: quantity,
                    color: select_color,
                    size: select_size
                })

            })
            const data_add_basket = await api_add_basket.json()
            console.log(data_add_basket)
        } catch (error) {
            console.log(error)
        }
    }


    async function add_order() {
        if (loding) return;

        if (productId == null ||
            userId == null
        ) {
            return
        }
        setloding(true)
        try {
            const api_add_order = await fetch("http://localhost:3000/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: product.id,
                    productName: product.name,
                    productPrice: product.price,
                    userId: userId,
                    quantity: quantity,
                    color: select_color,
                    size: select_size
                })

            })
            const data_add_product = await api_add_order.json()
            console.log(data_add_product)
            if (data_add_product.url) {
                location.href = data_add_product.url
            }

        } catch (error) {
            console.log(error)
        }
    }




    return (
        <div className="detalis_userAnd_foot">
            <div className="Details_Product">

                <img src={product.image} alt="" />
                <div className="product_data">
                    <h2>{product.name}</h2>
                    <p>{product.description} </p>
                    <h3>${product.price}</h3>

                    <h3>colors</h3>
                    <div className="colors">
                        {colors.length > 0 ?
                            <>
                                {colors.map((i, x) => (
                                    <div style={select_color == i ? { border: '2px solid rgba(17, 34, 85, 0.37)' } : { border: '2px solid rgba(17, 34, 85, 0)' }} onClick={() => setselect_color(i)} className="color" key={x}>
                                        <p style={{ background: i }}></p>
                                    </div>
                                ))}
                            </> : <span>There are no colors.</span>}
                    </div>


                    <h3>sizes</h3>
                    <div className="sizes">
                        {sizes.length > 0 ?
                            <>
                                {sizes.map((i, x) => (
                                    <div className="size" style={select_size == i ? { border: '2px solid rgba(17, 34, 85, 0.37)' } : { border: '2px solid rgba(17, 34, 85, 0)' }} onClick={() => setselect_size(i)} key={x}>
                                        <p>{i}</p>
                                    </div>
                                ))}
                            </> : <span>There are no sizes.</span>}
                    </div>


                    <h3>quantity</h3>
                    <div className="quantity">
                        <button onClick={() => setquantity(quantity + 1)}><MdOutlineAdd /></button>
                        <span>{quantity}</span>
                        <button onClick={() => setquantity(quantity - 1)}><FaMinus /></button>
                    </div>


                    <div className="payment_car">
                        <button onClick={() => {
                            setCheck(true)
                            add_basket()
                            setTimeout(() => {
                                setCheck(false)
                            }, 1000);
                        }
                        }>{Check ?
                            <i style={{ fontSize: '25px', color: '#1dc756' }}>{<FaRegCheckCircle />}</i>
                            : <><MdOutlineAdd /> add to car</>}</button>




                        <button onClick={() => add_order()}>
                            {loding ?
                                <span><svg height={'40px'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><radialGradient id="a18" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="#DA5E17"></stop><stop offset=".3" stop-color="#DA5E17" stop-opacity=".9"></stop><stop offset=".6" stop-color="#DA5E17" stop-opacity=".6"></stop><stop offset=".8" stop-color="#DA5E17" stop-opacity=".3"></stop><stop offset="1" stop-color="#DA5E17" stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a18)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="#DA5E17" stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg></span>
                                : <><IoCartOutline /> buy this item</>}
                        </button>


                        <div className="card">
                            <i className="stripe" style={{color: "#a525e0"}}><FaCcStripe /></i>
                            <i style={{color: "#2570e0"}}>< RiVisaFill /></i>
                            <i style={{color: "#e04a25"}}><FaCcMastercard /></i>
                        </div>
                    </div>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit minima debitis incidunt saepe expedita repudiandae molestias itaque accusantium vitae. Nihil soluta laborum odit doloremque ut vitae sapiente cum recusandae ipsa?</p>



                </div>


            </div>
            <Footer />
        </div>
    )
}

export default Details_Product