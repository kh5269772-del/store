

import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { Details_product } from "../../common/context/context_details_p";
import Aos from "aos";
import "aos/dist/aos.css"
import { IoMdSearch } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { FaRegCheckCircle } from "react-icons/fa";
import Footer from "../../common/footer";
function Product_User(){

      const [products, setproducts] = useState([])
  const [product_search, setproduct_search] = useState([])
  const [Unknown, setUnknown] = useState(false)

  const [Check, setCheck] = useState(false)
  const [userId, setuserId] = useState(0)
  const [all_category_da, setall_category_da] = useState([
    { id: 0, name: 'all' }
  ])
  const [toggle, settoggle] = useState(null)
  const Navigate = useNavigate()

  let { setproduct_de } = useContext(Details_product)



  useEffect(() => {
    Aos.init({ duration: 1000 })
    all_category()
    refresh()
    all_product()
  }, [])

  function togindex(index) {
    settoggle(index)
  }


    async function refresh() {

    try {
      const api_refresh = await fetch("http://localhost:3000/refresh_Tok", {
        method: "GET",
        credentials: 'include'
      })
      const data_refresh = await api_refresh.json()

      if (api_refresh.status == 500) {
        setUnknown(false)
        return;
      }
      if (!data_refresh.token) {
        setUnknown(false)
        return;
      }
      console.log(data_refresh)
      select_token(data_refresh.token)


    } catch (error) {
      console.log(error)
      setUnknown(false)

    }
  }

  async function select_token(tok) {
    if (!tok) {
      setUnknown(false)
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

        setUnknown(true)
        setuserId(data_select.id)
        localStorage.setItem('id', JSON.stringify(data_select.id))
        return;
      }
      if (sendtok.status == 500) {
        setUnknown(false)
        return;
      }
      refresh()


    } catch (error) {
      console.log(error)
      setUnknown(false)
    }
  }




  async function all_category() {
    try {
      const api_category = await fetch("http://localhost:3000/categorys")
      const data_category = await api_category.json()
      setall_category_da([...all_category_da, ...data_category.category])

    } catch (error) {
      console.log(error)
    }
  }




  async function all_product() {
    try {

      const api_all_product = await fetch("http://localhost:3000/product/user/all")
      const data_all_product = await api_all_product.json()
      console.log(data_all_product)
      setproduct_search(data_all_product.products)
      setproducts(data_all_product.products)
    } catch (error) {
      console.log(error)
    }
  }





async function add_basket(productId) {
    try {
      const api_add_basket = await fetch("http://localhost:3000/add_basket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
          quantity: 1,
        })

      })
      const data_add_basket = await api_add_basket.json()
      console.log(data_add_basket)
    } catch (error) {
      console.log(error)
    }
  }

   function transmission(id) {
    setproduct_de(id)
    sessionStorage.setItem('product_details', JSON.stringify(id))
    Navigate(Unknown ? '/details_product' : '/register_req')

  }


    
  function search_catetory(value){
    if(value == 'all'||!value){
      setproducts(product_search)
      return
    }

    const filterproduct = product_search.filter((e)=>{
      return e.category == value
    })

    if(!filterproduct){
      setproducts(product_search)
      return;
    }
    setproducts(filterproduct)
  }



function searsh(value) {
    if (value.trim() == '') {
      setproducts(product_search)
      return;
    }
    const filter_product = product_search.filter((e) => {
      return e.name.toLowerCase().includes(value.toLowerCase())
    })

    if (!filter_product) {
      setproducts(setproduct_search)
      return
    }

    setproducts(filter_product)

  }




    return(
        <div className="Product_User">
             <div className="category_search">
                    <div className="nav_category"  >
                      <div className="category"  >
                        {all_category_da.length > 0 ? all_category_da.map((item, index) => (
                          <span style={{cursor:"pointer"}} onClick={()=>search_catetory (item.name.trim())} key={index} >{item.name}</span>
                        )) : 'actegory < 0'}
                        {/* {all_category_da.length > 0 ? all_category_da.map((item, index) => (
                          <Link key={index} to={'/'}>{item.name}</Link>
                        )) : 'actegory < 0'}
                        {all_category_da.length > 0 ? all_category_da.map((item, index) => (
                          <Link key={index} to={'/'}>{item.name}</Link>
                        )) : 'actegory < 0'}
                        {all_category_da.length > 0 ? all_category_da.map((item, index) => (
                          <Link key={index} to={'/'}>{item.name}</Link>
                        )) : 'actegory < 0'}
                        {all_category_da.length > 0 ? all_category_da.map((item, index) => (
                          <Link key={index} to={'/'}>{item.name}</Link>
                        )) : 'actegory < 0'}
                        {all_category_da.length > 0 ? all_category_da.map((item, index) => (
                          <Link key={index} to={'/'}>{item.name}</Link>
                        )) : 'actegory < 0'}
                        {all_category_da.length > 0 ? all_category_da.map((item, index) => (
                          <Link key={index} to={'/'}>{item.name}</Link>
                        )) : 'actegory < 0'}
                        {all_category_da.length > 0 ? all_category_da.map((item, index) => (
                          <Link key={index} to={'/'}>{item.name}</Link>
                        )) : 'actegory < 0'}
             */}
                      </div>
                    </div>
                    <div className="search">
                      <input onKeyUp={(e) => { searsh(e.target.value) }} type="text" placeholder="search by name" />
                      <i className="search_icon"><IoMdSearch /></i>
                    </div>
                  </div>
            
            
                  {products.length > 0 ?
                    <div className="show_product" >
                      {products.map((item, index) => {
            
                        const colors = item.colors != '' && item.colors.split(',')
                        const sizes = item.sizes != '' && item.sizes.split(',')
                        console.log(colors)
            
            
            
                        return (
                          <div className="own_product" data-aos="fade-up">
                            <div className="link" onClick={() => transmission(item.id)} key={index} >
                              <img src={item.image} alt="" />
                              <div className="data_product">
                                <h3>{item.name}</h3>
                                <div className="description">
                                  <p>{item.description} </p>
                                </div>
                                <div className="to_color_size">
            
                                  <div>
                                    <h3>colors</h3>
                                    <div className="colors">
                                      {colors.length > 0 ?
            
                                        <>
                                          {colors.map((i) => (
                                            <p style={{ background: i, border: '1px solid #eb6506', }}></p>
                                          ))}
            
                                        </>
                                        : 'There are no colors.'}
                                    </div>
                                  </div>
            
                                  <div>
            
                                    <h3>sizes</h3>
            
                                    {sizes.length > 0 ? <>
                                      <select name="" id="">
                                        {sizes.map((i) => (
            
                                          <option value={i}>{i}</option>
            
                                        ))} </select></> : 'There are no sizes.'}
            
                                  </div>
                                </div>
                              </div>
                            </div>
            
                            <div className="price">
                              <p>${item.price}</p>
                              {Check && toggle == index ? <i style={{ fontSize: '25px', color: '#1dc756' }}>{<FaRegCheckCircle />}</i> :
                                <button onClick={() => {
                                  add_basket(item.id)
                                  setCheck(true)
                                  togindex(index)
                                  setTimeout(() => {
                                    settoggle(null)
                                    togindex(null)
                                  }, 1000);
            
                                }}> <i><IoCartOutline /></i>add to cart</button>}
                            </div>
            
                          </div>
                        )
            
                      })}</div>
                    : <div className="no_product">We couldn't find any products.</div>}
                            <Footer />
        </div>
    )
}

export default Product_User