

import { useState, useEffect, useRef, useContext } from "react"
import { product_context } from "../../common/context/context_product"
import { useNavigate } from "react-router-dom";
import { RxPinBottom } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { FaLongArrowAltRight } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
function All_Products() {
    const [product, setproduct] = useState([])
    const [all, setall] = useState([])
    const [id, setid] = useState(false)
    const [idDelete, setidDelete] = useState(false)
    const [scroll, setscroll] = useState(false)
    const [toggle, settoggle] = useState(null)

    const Navigate = useNavigate()

    let {setproduct_con} = useContext(product_context)

    useEffect(() => {
        import_prodects()
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



    async function import_prodects() {

        try {
            const api_product = await fetch("http://localhost:3000/products")
            const data = await api_product.json()
            console.log(data)
            setproduct(data.products)
            setall(data.products)

        } catch (error) {
            console.log(error)
        }
    }




    async function deleteProduct(id) {
        console.log(id)
        try {
            const apiDelete = await fetch(`http://localhost:3000/delete/product?id=${id}`)

            const message = await apiDelete.json()
            console.log(message)
            setid(false)
            import_prodects()

        } catch (error) {
            console.log(error)
            setid(false)
        }
    }

    function igateSave(id) {
        setproduct_con(id)
        localStorage.setItem("productId", JSON.stringify(id))
        Navigate('/control/product')
    }




    function hh(value) {
        if (value == '') {
            setproduct(all)
            return;
        }

        const elemSea = all.filter((element) => {
            return element.name.trim().toLowerCase().includes(value)
        })

        if (!elemSea) {
            setproduct('no')
        }
        setproduct(elemSea)



    }



    function bottomDa() {
        divref.current.scrollTo({
            behavior: "smooth",
            top: divref.current.scrollHeight
        })
    }





    return (
        <div className="All_Products">

            {idDelete ?
                <div className="deleted" >
                    <div className="box_delete">
                        <h3>delete user</h3>
                        <p>Are you sure about deleting it?</p>
                        <div className="tobutton">
                            <div className="butleft">
                                <button onClick={() => deleteProduct(id)}>Yeah</button>
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

                    {product.length > 0 ?
                        <table>
                            <thead>
                                <tr>
                                    <th>image</th>
                                    <th>name</th>
                                    <th>id</th>
                                    <th>show</th>
                                    <th>price</th>
                                    <th><i><HiDotsVertical /></i></th>

                                </tr>
                            </thead>

                            <tbody>

                                {product.map((item, index) => (
                                    <tr key={index}>
                                        <td><img src={item.image} alt="ptodect" /></td>
                                        <td>{item.name}</td>
                                        <td>{item.id}</td>
                                        <td style={item.is_visible == 1 ? { color: '#15c7a3' } : { color: "red" }}>{item.is_visible == 1 ? 'yeah' : 'no'}</td>
                                        <td>{item.price}</td>
                                        <td> <i onClick={() => {
                                            toggleInd(index)
                                            setid(item.id)
                                        }}><HiDotsVertical /></i></td>

                                    </tr>
                                ))}
                            </tbody>
                        </table> : <div className="" style={{ padding: '20px', fontSize: '25px', fontWeight: "700" }}>There is no product</div>}

                    {toggle != null ?
                        <div className="skills">
                            <button className="detailsOrder" onClick={() => igateSave(id)}><i><FaLongArrowAltRight /></i> <p>details</p></button>
                            <button className="deleteOrder" onClick={() => setidDelete(id)}><i><MdDelete /></i> <p>delete</p></button>
                        </div> : ''}



                </div>
                {scroll ? <i className="bottom" onClick={() => bottomDa()}><RxPinBottom /></i> : ''}

            </div>

        </div>
    )
}

export default All_Products