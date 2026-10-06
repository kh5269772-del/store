
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../../common/footer"
function Profile() {

  const [user, setuser] = useState({})
  const [product, setproduct] = useState([])
  const [order, setorder] = useState([])
  const [basket, setbasket] = useState([])
  const Navigate = useNavigate()

  useEffect(() => {
    refresh()
    basket_User()
  }, [])

  async function refresh() {

    try {
      const api_refresh = await fetch("http://localhost:3000/refresh_Tok", {
        method: "GET",
        credentials: 'include'
      })
      const data_refresh = await api_refresh.json()

      if (api_refresh.status == 500) {
        Navigate('/register_req')
        return;
      }
      if (!data_refresh.token) {
        Navigate('/register_req')
        return;
      }
      console.log(data_refresh)
      select_token(data_refresh.token)


    } catch (error) {
      console.log(error)
      Navigate('/register_req')
      return;
    }
  }

  async function select_token(tok) {
    if (!tok) {
      Navigate('/register_req')
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
        setuser(data_select)
        localStorage.setItem('id', JSON.stringify(data_select.id))
        return;
      }
      if (sendtok.status == 500) {
        Navigate('/register_req')
        return;
      }
      refresh()


    } catch (error) {
      console.log(error)
      Navigate('/register_req')
      return
    }
  }

  async function basket_User() {
    const userId = JSON.parse(localStorage.getItem("id"))
    try {
      const api_Basket_User = await fetch("http://localhost:3000/user/basket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId })
      })
      const data_Basket_User = await api_Basket_User.json()
      console.log(data_Basket_User)
      setbasket(data_Basket_User.basket)
      all_product()
      order_User()
    } catch (error) {
      console.log(error)
    }
  }


  async function all_product() {
    try {
      const api_all_product = await fetch("http://localhost:3000/products")
      const data_all_product = await api_all_product.json()
      console.log(data_all_product)
      setproduct(data_all_product.products)
    } catch (error) {
      console.log(error)
    }
  }


  async function order_User() {
    const userId = JSON.parse(localStorage.getItem("id"))
    try {
      const api_Basket_User = await fetch("http://localhost:3000/user/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId })
      })
      const data_Basket_User = await api_Basket_User.json()
      console.log(data_Basket_User)
      setorder(data_Basket_User.orders)
      all_product()
    } catch (error) {
      console.log(error)
    }
  }










  return (
 <div className="profile_and_foot">
     <div className="Profile">
      <div className="detalis_user">
        <h2>you data</h2>
        <div className="avatar">
          <p>Avatar:</p>
          {user.avatar ? <img src={user.avatar} alt="" /> : <div className="avname">{user.name ? user.name[0] : ''}</div>}
        </div>
        <div className="name">
          <p>Name:</p>
          <p> {user.name}</p>
        </div>
        <div className="email">
          <p>Email:</p>

          <p>{user.email}</p>          
            </div>

      </div>
      <div className="detalis_car">
        <h2>orders</h2>
        <div className="order">
          {order.length > 0 ?
            <>
              <table>
                <thead>
                  <tr>
                    <th>image</th>
                    <th>name</th>
                    <th>price</th>
                    <th>quantity</th>
                    <th>total</th>
                    <th>status</th>
                  </tr>
                </thead>
                <tbody>

                  {order.map((item, index) => {
                    const find_product = product.find((e) => {
                      return e.id == item.productId
                    })

                    return (
                      <tr key={index}>
                        <td><img src={find_product && find_product.image} alt="" /></td>
                        <td>{find_product && find_product.name}</td>
                        <td>{find_product && find_product.price}</td>
                        <td>{item.quantity}</td>
                        <td>{parseInt(find_product && find_product.price * item.quantity)}</td>
                        <td style={item.status == 'success' ? { color: '#0cb94e' } : { color: 'red' }}>{item.status}</td>

                      </tr>
                    )
                  })}
                </tbody>
              </table>

            </> : <span style={{ fontSize: "13px", cursor: "pointer", borderBottom: "1px solid #123",margin:"20px" }} onClick={() =>Navigate("/product/user")}>You don't have one; go create one.</span>}
        </div>




        {/* <div className="basket">
          {basket.length > 0 ?
            <>
              {basket.map((item, index) => {
                const find_product = product.find((e) => {
                  return e.id == item.productId
                })

                return (
                  <div className="row_data" key={index}>
                  


                  </div>
                )
              })}
            </> : 'fighikfj'}

        </div> */}
        
      </div>

   

    </div>
       <Footer />
 </div>
  )
}
export default Profile