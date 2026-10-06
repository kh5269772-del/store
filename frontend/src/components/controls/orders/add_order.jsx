

// import { useNavigate,Link } from "react-router-dom"

import { GiCheckMark } from "react-icons/gi";
import { useState, useEffect } from "react"
import { GrAddCircle } from "react-icons/gr";
import { IoMdCloseCircle } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
function Add_Order() {
    const [show, setshow] = useState(false)
    const [mark, setmark] = useState(null)
    const [id, setid] = useState('')
    const [search, setsearch] = useState('name')
    const [products, setproducts] = useState([])
    const [all, setall] = useState([])
    const [payment, setpayment] = useState('upon receipt')
    const [productId, setproductId] = useState('')
    const [check, setcheck] = useState(false)
    const [close, setclose] = useState(false)
    const [quantity, setquantity] = useState(1)
    const userId = JSON.parse(localStorage.getItem('id'))

    useEffect(() => {
        import_prodects()

    }, [])

    async function import_prodects() {

        try {
            const api_product = await fetch("http://localhost:3000/products")
            const data = await api_product.json()
            console.log(data)
            setproducts(data.products)
            setall(data.products)


        } catch (error) {
            console.log(error)
        }
    }

    function toggle_show() {

        setmark(null)
        setid('')
        setsearch('name')

        setshow(!show)
    }

    function toggle(index) {
        setmark(mark == index ? null : index)
    }

    function search_data(value) {

        if (value == '') {
            setproducts(all)
            return;
        }

        const element_data = all.filter((element) => {
            return search == 'name' ? element.name.includes(value.toLowerCase()) : element.category.includes(value.toLowerCase())
        })
        if (!element_data) {
            setproducts(all)
        }
        setproducts(element_data)

    }

    async function Add_Order() {

        if (!productId || !userId || !payment) {
            setclose(true)
            setTimeout(() => {
                setclose(false)
            }, 1000)
            return
        }

        console.log(productId, userId, payment,)

        try {
            const add_order_api = await fetch("http://localhost:3000/add/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId,
                    productId: productId,
                    payment_method: payment,
                    quantity:quantity
                })
            })

            const add_order_data = await add_order_api.json()
            console.log(add_order_data)

            if (add_order_api.status == 200) {
                setcheck(true)
                setTimeout(() => {
                    setcheck(false)
                }, 1000);
            }

            remove_stat()


        } catch (error) {
            console.log(error)
        }
    }






    



    function open(e) {
        if (e && mark != null) {

            setproductId(e)
        }
        else {
            console.log('error')
        }
        toggle_show()

    }

    function remove_stat() {
        setproductId('')
        setquantity(1)

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
        <div className="Add_Order">
            <h2>Add_Order</h2>
            <div className="od_top">
                <label htmlFor="payment_method">payment method</label>
                <button className="show_produ" onClick={() => toggle_show()}>select product</button>
                <label htmlFor="quantity">quantity</label>
                <input onChange={(e)=>setquantity(e.target.value)} value={quantity} type="text" placeholder="Quantity" id="quantity" style={{ width: "50px" }} />

                <div className="dds">
                    <button onClick={() => Add_Order()} className="add" ><i><GrAddCircle /> <samp>add</samp> </i></button>
                    <input type="text" id="payment_method" onChange={(e) => setpayment(e.target.value)} value={payment} placeholder="payment method" />
                </div>

            </div>



            {show ?
                <div className="select_product">

                    <div className='group_data_product'>

                        <div className="profu">
                            {products.length > 0 ?
                                <>

                                    {products.map((item, index) => (

                                        <div className="single" key={index} onClick={() => {
                                            toggle(index)
                                            setid(item.id)
                                        }} >
                                            <img src={item.image} alt="" />
                                            <div className="text_product">
                                                <p>prise: {item.price}</p>
                                                <p>name: {item.name}</p>
                                                <p>category: {item.category}</p>
                                                {/* <span>prise: {item.prise}</span> */}
                                                <div className="square">
                                                    {mark == index ? <i><GiCheckMark /></i> : ''}
                                                </div>
                                            </div>

                                        </div>

                                    ))
                                    }

                                </>

                                : <h3 className="No_products" style={{ padding: '10px' }}>
                                    No products
                                </h3>
                            }
                        </div>
                    </div>

                    <div className="detelse">
                        <input type="text" placeholder={`searsh ${search}`} onKeyUp={(e) => search_data(e.target.value)} />

                        <div className="toggle_searsh">
                            <label htmlFor="search">Choose a search method</label>
                            <select name="search" id="search" onChange={(e) => setsearch(e.target.value)}>
                                <option value="name">name</option>
                                <option value="category">category</option>
                            </select>
                        </div>
                        <div className="tobutyon">
                            <p style={{ marginRight: 'auto', fontSize: '15px' }}>Choose only one product</p>
                            <button onClick={() => toggle_show()}>Cancel</button>
                            <button onClick={() => open(id)}>Open</button>
                        </div>
                    </div>
                </div>
                : ""}


        </div>
    )
}

export default Add_Order

