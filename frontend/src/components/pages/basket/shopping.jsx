
import { useState, useEffect } from "react"
import { RiDeleteBin6Line } from "react-icons/ri";


function Shopping() {
  const [product, setproduct] = useState([])
  const [order, setorder] = useState([])

  useEffect(() => {
   order_User()
  },[])

  async function order_User() {
    const userId = JSON.parse(localStorage.getItem("id"))
    try {
      const api_Basket_User = await fetch("http://localhost:3000/user/order",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:userId})
      })
      const data_Basket_User = await api_Basket_User.json()
      console.log(data_Basket_User)
      setorder(data_Basket_User.orders)
      all_product()
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






async function delete_basket(id) {
  try{
    const api_delete_basket = await fetch(`http://localhost:3000/delete/basket?id=${id}`)
    const data_delete_basket = await api_delete_basket.json()
    console.log(data_delete_basket)
    order_User()
  }catch(error){
    console.log(error)
  }
}










  return (

    <div className="Shopping">

      <div className="Shopping_baskets">
        {order.length > 0 ?
          <>
            {order.map((item, index) => {

              const find_product = product.find((e) => {
                return e.id == item.productId
              })
              const now = new Date(item.created_at)

              return (
                <div className="won_basket" key={index}>
                  <img src={find_product && find_product.image} alt="" />
                  <div className="won_basket_text">
                    <h3>{find_product&&find_product.name}</h3>
                    {item.color&&<p>color: {item.color}</p>}
                     {item.size&&<p>size: {item.size}</p>}
                     <p>date: {now.toLocaleDateString()}</p>
                     <p style={{color:item.status == 'success'?'#0cb94e':'red' }}>status: {item.status}</p>

                     <p>quantity: {item.quantity}</p>
                    <p>price: {find_product&&find_product.price}</p>
                    
            <div className="total">
              <h3>${find_product&& parseInt(item.quantity * find_product.price)}</h3><span style={{fontSize:'12px'}}>(quantity * price = {find_product&& parseInt(item.quantity * find_product.price)})</span>
            </div>
                    
                  </div>
                  <div className="won_basket_delete">
                    <i onClick={()=>delete_basket(item.id)}><RiDeleteBin6Line /></i>
                  </div>

                </div>
              )
            })}
          </>
          : 'There is no order.'}
      </div>

    </div>
  )
}
export default Shopping