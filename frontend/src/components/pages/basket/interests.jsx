
import { useState, useEffect,useContext } from "react"
import { useNavigate } from "react-router-dom";
import { Details_product } from "../../common/context/context_details_p";
import { RiDeleteBin6Line } from "react-icons/ri";


function Interests() {
  const [product, setproduct] = useState([])
  const [basket, setbasket] = useState([])
  let { setproduct_de } = useContext(Details_product)
  const Navigate = useNavigate()


  useEffect(() => {
    basket_User()
  }, [])

  async function basket_User() {
    const userId = JSON.parse(localStorage.getItem("id"))
    try {
      const api_Basket_User = await fetch("http://localhost:3000/user/basket",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:userId})
      })
      const data_Basket_User = await api_Basket_User.json()
      console.log(data_Basket_User)
      setbasket(data_Basket_User.basket)
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
    basket_User()
  }catch(error){
    console.log(error)
  }
}


function Go_details_p(productId){
setproduct_de(productId)
sessionStorage.setItem('product_details',JSON.stringify(productId))
Navigate("/details_product")
}




let total= 0






  return (

    <div className="Interests">

      <div className="Interests_baskets">
        {basket.length > 0 ?
          <>
            {basket.map((item, index) => {

              const find_product = product.find((e) => {
                return e.id == item.productId
              })
          if(find_product){
              // settotal(total+1)
             total+= parseInt(find_product.price)
          }
   

              return (
                <div className="won_basket" key={index}>
                  <img src={find_product && find_product.image} alt="" />
                  <div className="won_basket_text">
                    <h3>{find_product&&find_product.name}</h3>
                    {item.color&&<p>color {item.color}</p>}
                     {item.size&&<p>size {item.size}</p>}

                     <p>quantity {item.quantity}</p>
                    <p>price {find_product&&find_product.price}</p>

                    <span style={{fontSize:"13px",cursor:"pointer", borderBottom:"1px solid #123"}} onClick={()=>Go_details_p(find_product.id)}>Product Details or Purchase</span>
                    
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
          : 'There is no item in the car.'}
      </div>

      <div className="cart_detalis">
        <h3>cart detalis</h3>

        <div className="cart_detalis_total">
            <p>totle</p>
            <p>{total}</p>
        </div>
        <button onClick={()=> Navigate("/product/user")}>Add a new product</button>
      </div>

    </div>
  )
}
export default Interests