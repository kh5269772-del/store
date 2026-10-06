
import { useState, useEffect, useContext } from "react"
import { Link,useNavigate } from "react-router-dom"
import { product_context } from "../../common/context/context_product"
import Chart_Product from "../../recharts/chart_broduct"

import { MdOutlineSecurity } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { GrStatusGood } from "react-icons/gr";

function Select_Product() {

    const Navigate = useNavigate()
    const [product, setproduct] = useState([])
    const [orders, setorders] = useState([])
    const [colors, setcolors] = useState('')
    const [data, setdata] = useState({
        total: 0,
        quantity: 0,
        length: 0,
    })

    let { product_con } = useContext(product_context)
    const id = product_con || JSON.parse(localStorage.getItem("productId"))

    const icons_product = [
        { background: '#c4c71563', icon: <AiOutlineProduct /> },
        { background: '#15c7a35e', icon: <GrStatusGood /> },
        { background: '#1562c76c', icon: <MdOutlineSecurity /> },
    ]


    console.log(colors)

    
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
            import_details_product()

        } catch (error) {
            console.log(error)
            Navigate('/')

        }
    }


















    async function import_details_product() {
        const id = product_con || JSON.parse(localStorage.getItem("productId"))

        try {
            const api_product = await fetch("http://localhost:3000/details/product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id })
            })
            const data_product = await api_product.json()
            setproduct(data_product.product)
            setcolors(data_product.product.colors.split(','))
            console.log(data_product)
            import_orders(data_product.product)
        } catch (error) {
            console.log(error)
        }
    }

    async function import_orders(product) {
        try {
            const api_orders = await fetch("http://localhost:3000/orders/success")
            const data_orders = await api_orders.json()
            console.log(data_orders.orders)
            setorders(data_orders.orders)
            filter_data(product, data_orders.orders)
        } catch (error) {
            console.log(error)
        }
    }




    function filter_data(product, orders) {
        console.log(product, orders)

        const fit = orders.filter((e) => {
            return e.productId == product.id
        })




        if (!fit) return;
        let total = 0
        let quantity = 0

        const fit_price = fit.forEach(element => {
            total += parseInt(product.price * element.quantity)
            quantity += parseInt(element.quantity)
        });
        let fit_length = fit.length


        setdata({
            total: total,
            quantity: quantity,
            length: fit_length
        })


    }

    console.log(data)


    return (
        <div className="Select_Product">

            <div className="to_data_p_o">
                <div className="show_product_se">
                    <h2>product</h2>
                    <div className="icon_product">
                        {icons_product.map((item, index) => (
                            <i key={index} style={{ background: item.background }}>
                                {item.icon}
                            </i>
                        ))}
                    </div>
                    <img src={product.image} alt="" />
                    <p>name : {product.name}</p>
                    <p>category : {product.category}</p>
                    <p style={{ color: product.is_visible == 1 ? "#15c7a3" : "red" }}>is_visible : {product.is_visible == 1 ? 'yeah' : 'no'}</p>
                    <p>description : {product.description}</p>
                    <p>price : ${product.price}$</p>
                    <p className="colors">colors : {colors ? colors.map((item) => (
                        <p className="color" style={{ background: item, }}></p>
                    )) : ''}</p>
                    <p>sizes : {product.sizes}</p>

                </div>
                <div className="data_order">
                   
                   <h2>Product sales details</h2>
                    <p>Orders containing the product : {data.length}</p>
                     <p>Product sales volume : {data.quantity}</p>
                     <p>Total product profits : {data.total}</p>
                </div>
            </div>


            <Chart_Product productId={id} />


            <div className="Control_panel">
                <Link to={'/control'}>Return</Link>
            </div>
        </div>
    )
}
export default Select_Product