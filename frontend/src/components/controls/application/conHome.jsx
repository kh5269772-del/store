
import { useEffect, useState } from "react"
import CustomActiveShapePieChart from "../../recharts/cart_agent"
import ChartRevenue from "../../recharts/char_revenue"
import AreaChartVisitor from "../../recharts/chart_visitor"
import { FaUserAstronaut } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";
import { FaBasketShopping } from "react-icons/fa6";
import { GrCreditCard } from "react-icons/gr";
function ConHome() {
    const [browser, setbrowser] = useState([])
    const [transaction, settransaction] = useState([])
    const [product, setproduct] = useState([])
    const [users, setusers] = useState([])
    const [Data_Registered, setData_Registered] = useState({})
    const [top_product_state, settop_product_state] = useState([])


    useEffect(() => {
        import_type()
        import_prodects()
    }, [])

    async function import_type() {
        try {
            const api_agent = await fetch("http://localhost:3000/users/agent")
            const data_agent = await api_agent.json()
            console.log(data_agent.agent)
            setbrowser(data_agent.agent)

        } catch (error) {
            console.log(error)
        }
    }

    let Visitors = browser.map((item) => {
        return item.person
    })

    let totle = 0
    for (let i = 0; i < Visitors.length; i++) {
        totle += Visitors[i]
    }


    async function import_prodects() {

        try {
            const api_product = await fetch("http://localhost:3000/products")
            const data = await api_product.json()
            console.log(data)
            setproduct(data.products)
            selectUsers()
            top_product()


        } catch (error) {
            console.log(error)
        }
    }

    async function selectUsers() {

        try {
            const userapi = await fetch("http://localhost:3000/users");
            const all_User = await userapi.json()
            setusers(all_User.users)
            console.log(all_User.users)
            import_transaction()
        } catch (error) {
            console.log(error)
        }
    }




    async function import_transaction() {
        try {
            const api_transaction = await fetch("http://localhost:3000/latest/transactions")
            const data_transaction = await api_transaction.json()
            console.log(data_transaction)
            settransaction(data_transaction.data)
            All_Data_Registered()
        } catch (error) {
            console.log(error)
        }
    }

    // async function popular() {
    //     try {
    //         const api_popular = await fetch("http://localhost:3000/popular")
    //         const data_popular = await api_popular.json()
    //         console.log(data_popular)


    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    async function All_Data_Registered() {
        try {
            const api_All_Data_Registered = await fetch("http://localhost:3000/All_Data_Registered")
            const req_All_Data_Registered = await api_All_Data_Registered.json()
            console.log(req_All_Data_Registered)
            setData_Registered(req_All_Data_Registered)

        } catch (error) {
            console.log(error)
        }
    }




    async function top_product() {
        try {
            const api_top_product = await fetch("http://localhost:3000/top_product")
            const data_top_product = await api_top_product.json()
            console.log(data_top_product)
            settop_product_state(data_top_product.results)

        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className="ConHome">
            <div className="Con_Home_Top">

                <div className="total_revenue">
                    <h2>total revenue</h2>
                    <ChartRevenue />
                </div>

                <div className="latest_transaction">
                    <h3 style={{ padding: "10px 15px ", textTransform: "capitalize", fontFamily: "sans-serif" }}>latest transaction</h3>

                    {product.length < 1 || users.length < 1 || transaction.length < 1 ?
                        "data < 0" :
                        <>
                            {transaction.map((item, index) => {
                                const detalsproduct = product.find((e) => {
                                    return e.id == item.productId
                                })
                                const detalsuser = users.find((e) => {
                                    return e.id == item.userId
                                })

                                return (<>



                                    <div className="user_trans" key={index}>
                                        <div className="img_name_user">
                                            {detalsuser&& detalsuser.avatar? <img src={detalsuser.avatar} alt="" /> : <div className="avname">{detalsuser.name[0]}</div>}
                                            <div> <h4>payment</h4>
                                                <p>{detalsuser.name}</p></div>
                                        </div>

                                        <h3 className="price">${parseInt(detalsproduct.price * item.quantity)}$</h3>
                                    </div>


                                </>)
                            })}</>}
                </div>
                <div className="all_gains">
                    <h2 style={{ padding: "10px 15px " }}>browser usage</h2>
                    <CustomActiveShapePieChart />
                    <p>Visitors this month: {totle}+</p>
                </div>



            </div>
            <div className="Con_Home_Bottom"> 
                {/* <div className="visiter">
                    <AreaChartVisitor />
                </div>

                <div className="product_popular">

                </div>
            </div>  */}

            <div className="All_Data_Registered">
                <div className="Data_Registered">
                    <h2>usrs</h2>
                    <div>
                        <i><FaUserAstronaut /></i>
                        <p> {Data_Registered.users}</p>
                    </div>
                </div>
                <div className="Data_Registered">
                    <h2>products</h2>
                    <div>
                        <i><AiOutlineProduct /></i>
                        <p> {Data_Registered.products}</p>
                    </div></div>
                <div className="Data_Registered">
                    <h2>basket</h2>
                    <div>
                        <i><FaBasketShopping /></i>
                        <p> {Data_Registered.baskets}</p>
                    </div></div>
                <div className="Data_Registered">
                    <h2>orders</h2>
                    <div>
                        <i><GrCreditCard /></i>
                        <p> {Data_Registered.orders}</p>
                    </div>
                    </div>
                    </div>


                    <div className="top_products">
                        <h2 style={{fontSize:"18px",marginBottom:"10px"}}>Most popular products</h2>
                        {top_product_state.length>0?
                        <>
                        {top_product_state.map((item,index)=>{
                            const filter_ptoduct = product.find((e)=>{
                                return e.id == item.productId
                            })

                            return(
                                <div className="won_cont_product" key={index}>
                                    <img src={filter_ptoduct&&filter_ptoduct.image} alt="" />
                                    <p>{filter_ptoduct&&filter_ptoduct.name}</p>
                                    <p>{item.won_product} req</p>
                                </div>
                            )
                        })}
                        </>
                    :''}
                    </div>




            </div>
        </div>
    )
}
export default ConHome
// latest/transactions
// import { FaUserAstronaut } from "react-icons/fa";
// import { AiOutlineProduct } from "react-icons/ai";
// import { FaBasketShopping } from "react-icons/fa6";
// import { GrCreditCard } from "react-icons/gr";