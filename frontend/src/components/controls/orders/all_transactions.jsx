



import { useState, useEffect, useRef,useContext } from "react"
import { RxPinBottom } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";
import { OrderIdContext } from "../../common/context/cotext_order";

import { HiDotsVertical } from "react-icons/hi";
function All_Transactions() {
    const [orders, setorders] = useState([])
    const [all, setall] = useState([])
    const [product, setproduct] = useState([])
    const [id, setid] = useState(false)
    const [idDelete, setidDelete] = useState(false)
    const [scroll, setscroll] = useState(false)
    const [toggle, settoggle] = useState(null)

    let {setselectId} = useContext(OrderIdContext)

    const Navigate =useNavigate()



    useEffect(() => {
        import_orders()
    }, [])


    function toggleInd(index) {
        settoggle(toggle == null ? index : null)
        console.log(index)
    }

    const divref = useRef(null)
    useEffect(() => {
        const element = divref.current

        if (!element) return;

        function sc() {
            console.log('sfa')
            if (element.scrollTop < 1) {
                setscroll(false)
            } else { setscroll(true) }
        }

        element.addEventListener("scroll", sc)

        return () => element.removeEventListener("scroll", sc)

    }, [divref.current])



    async function import_orders() {

        try {
            const api_order = await fetch("http://localhost:3000/orders")
            const data = await api_order.json()
            console.log(data)
            setorders(data.orders)
            setall(data.orders)

            import_prodects()

        } catch (error) {
            console.log(error)
        }
    }




    async function import_prodects() {

        try {
            const api_product = await fetch("http://localhost:3000/products")
            const data = await api_product.json()
            console.log(data.products)
            setproduct(data.products)

        } catch (error) {
            console.log(error)
        }
    }






    async function deleteOrders(id) {
        console.log(id)
        try {
            const apiDelete = await fetch(`http://localhost:3000/delete/order?id=${id}`)

            const message = await apiDelete.json()
            console.log(message)
            setid(false)
            import_orders()

        } catch (error) {
            console.log(error)
            setid(false)
        }
    }


    function igateSave(id){
        setselectId(id)
        localStorage.setItem("orderId",JSON.stringify(id))
        Navigate('/control/order')
    }




    function hh(value) {
        if (value == '') {
            setorders(all)
            return;
        }

        const elemSea = all.filter((element) => {
            return element.name.trim().toLowerCase().includes(value)
        })

        if (!elemSea) {
            setorders('no')
        }
        setorders(elemSea)



    }



    function bottomDa() {
        divref.current.scrollTo({
            behavior: "smooth",
            top: divref.current.scrollHeight
        })
    }






    return (
        <div className="All_Transactions">

            {idDelete ?
                <div className="deleted" >
                    <div className="box_delete">
                        <h3>delete user</h3>
                        <p>Are you sure about deleting it?</p>
                        <div className="tobutton">
                            <div className="butleft">
                                <button onClick={() => deleteOrders(id)}>Yeah</button>
                            </div>
                            <div className="butright">
                                <button onClick={() => setidDelete(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div> : ""

            }
            <div className="Registered" id="toSeectionTableForm">

                <div className="datata" ref={divref}>
                    <input onKeyUp={(e) => hh(e.target.value.trim().toLowerCase())} type="text" placeholder="Search by name" />

                    {orders.length > 0 ?
                        <table>
                            <thead>
                                <tr>
                                    <th>image</th>
                                    <th>quantity</th>
                                    <th>date</th>
                                    <th>price</th>
                                    <th>stats</th>
                                    <th><i><HiDotsVertical /></i></th>

                                </tr>
                            </thead>

                            <tbody>

                                {orders.map((item, index) => {
                                    const Product_it = product.find((element) => element.id == item.productId)
                                    const now = new Date(item.created_at)
                                    const date = now.toLocaleString()
                                    return (
                                        <tr key={index}>
                                            <td><img src={Product_it ? Product_it.image : ''} alt="" /></td>
                                            <td>{item.quantity}</td>
                                            <td>{date.split(',')[0]}</td>
                                            <td>{Product_it ? parseInt(Product_it.price * item.quantity) : ''}</td>
                                            <td style={{ color: item.status == 'success' ? '#15c7a3' : 'red' }}>{item.status}</td>
                                            <td> <i onClick={()=>{
                                                toggleInd(index)
                                                setid(item.id)
                                                }}><HiDotsVertical /></i></td>
                                        </tr>
                                    )

                                })}


                            </tbody>
                        </table> : <div className="" style={{ padding: '20px', fontSize: '25px', fontWeight: "700" }}>There is no orders</div>}

                   {toggle != null?
                    <div className="skills">
                        <button className="detailsOrder" onClick={()=> igateSave(id) }><i><FaLongArrowAltRight /></i> <p>details</p></button>
                        <button className="deleteOrder" onClick={() =>setidDelete(id)}><i><MdDelete /></i> <p>delete</p></button>
                    </div>:''}


                </div>
                {scroll ? <i className="bottom" onClick={() => bottomDa()}><RxPinBottom /></i> : ''}

            </div>

        </div >
    )
}

export default All_Transactions
