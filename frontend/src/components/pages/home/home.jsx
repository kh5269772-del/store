
// import React from "react";
// import { useParams } from "react-router-dom"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { Details_product } from "../../common/context/context_details_p";
import Aos from "aos";
import "aos/dist/aos.css"
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoMdSearch } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { FaRegCheckCircle } from "react-icons/fa";
import Footer from "../../common/footer";


function Home() {

  const Slider = SlickSlider.default || SlickSlider;

  const [products, setproducts] = useState([])
  const [product_search, setproduct_search] = useState([])
  const [Unknown, setUnknown] = useState(false)
  const [Unauthorized, setUnauthorized] = useState(false)
  const [Check, setCheck] = useState(false)
  const [userId, setuserId] = useState(0)
  const [all_category_da, setall_category_da] = useState([
    { id: 0, name: 'all' }
  ])
  const [toggle, settoggle] = useState(null)
  const Navigate = useNavigate()

  let { setproduct_de } = useContext(Details_product)

  const slid = [
    { img: "./public/9ccf0890-bef9-462e-81cb-8307b1b72ff9__1_-removebg-preview (1).png", p: 'beats solo', h2: 'wireless', button_color: 'red' },

    { img: "./public/meta-quest-pro-removebg-preview.png", p: 'beats solo', h2: 'wireless', button_color: 'red' },
  ]

  // 


  useEffect(() => {
    Aos.init({ duration: 1000 })
    all_category()
    refresh()
    all_product()
  }, [])

  function togindex(index) {
    settoggle(index)
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


  

  async function refresh() {

    try {
      const api_refresh = await fetch("http://localhost:3000/refresh_Tok", {
        method: "GET",
        credentials: 'include'
      })
      const data_refresh = await api_refresh.json()

      if (api_refresh.status == 500) {
        setUnknown(false)
        setUnauthorized(false)
        return;
      }
      if (!data_refresh.token) {
        setUnknown(false)
        setUnauthorized(false)
        return;
      }
      console.log(data_refresh)
      select_token(data_refresh.token)


    } catch (error) {
      console.log(error)
      setUnknown(false)
      setUnauthorized(false)

    }
  }

  async function select_token(tok) {
    if (!tok) {
      setUnknown(false)
      setUnauthorized(false)
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
        setUnauthorized(false)
        setuserId(data_select.id)
        localStorage.setItem('id', JSON.stringify(data_select.id))
        user_role(tok)
        return;
      }
      if (sendtok.status == 500) {
        setUnknown(false)
        setUnauthorized(false)
        return;
      }
      refresh()


    } catch (error) {
      console.log(error)
      setUnknown(false)
      setUnauthorized(false)
    }
  }




  async function user_role(tok) {
    if (!tok) {
      setUnknown(false)
      setUnauthorized(false)
      return
    }
    try {
      const select_role = await fetch("http://localhost:3000/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authhead: tok })
      })
      const data_role = await select_role.json()
      console.log(data_role)
      if (select_role.status == 400 || select_role.status == 500) {
        setUnknown(true)
        setUnauthorized(false)
        return;
      } if (select_role.status == 200) {
        setUnknown(true)
        setUnauthorized(true)
      }

    } catch (error) {
      console.log(error)
      setUnknown(false)
      setUnauthorized(false)
    }
  }



  function transmission(id) {
    setproduct_de(id)
    sessionStorage.setItem('product_details', JSON.stringify(id))
    Navigate(Unknown ? '/details_product' : '/register_req')

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












  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // initialSlide: 2,
  };


  return (
    <div className="Home" >

      <div className="home_top_show">
        <div className="section_left" data-aos="zoom-in">
          <div className="section_left_text">
            <h2>You will love our products</h2>
            <h2>Her job is to earn your trust</h2>
          </div>
          <div className="section_left_image">
            <img src="./public/young-girl-smiling-with-turquoise-headphones-on-a-transparent-background-png.webp" />
          </div>
        </div>


        <div className="section_right">

          <div className="section_right_top" data-aos="flip-up">
            <div className="section_right_top_text">
              <h3>discount 20% </h3>
              <h3>160$ <del>200$</del></h3>
            </div>
            <img src="./public/pexels-anna-nekrashevich-8534088-removebg-preview.png" alt="" />
          </div>



          <div className="section_right_bottom" data-aos="flip-down">
            <div className="section_right_bottom_text">
              <h3>discount 20% </h3>
              <h3>160$ <del>200$</del></h3>
            </div>
            <img src="./public//pexels-regeci-9142237-removebg-preview.png" alt="" />
          </div>

        </div>
      </div>



      <div className="section_to">

        <div className="Slider"   >
          <Slider  {...settings}>
            {slid.map((item, index) => (
              <div className="won_slid" key={index}  >
                <div className="toimgSlid" data-aos="zoom-in" >
                  <div>
                    <p>{item.p}</p>
                    <h2>{item.h2}</h2>
                    <button onClick={()=>Navigate('/product/user')} style={{ background: item.button_color }}>show by category</button>
                  </div>
                  <div className="image_slide">
                    <img src={item.img} alt="" />
                  </div>
                </div>



              </div>
            ))}

          </Slider>
        </div>
        <div className="right_model"   >
          <img src="./public/594x594.jpg" alt="" data-aos="fade-up" />
        </div>
      </div>
      {/* data-aos="zoom-in" */}



      <div className="category_search">
        <div className="nav_category"  >
          <div className="category"  >
            {all_category_da.length > 0 ? all_category_da.map((item, index) => (
              <span style={{cursor:"pointer"}} onClick={()=>search_catetory (item.name.trim())} key={index} >{item.name}</span>
            )) : 'actegory < 0'}

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






      {Unauthorized && Unknown ?
        <div className="Control_panel">
          <Link to={'/control'}>Control</Link>
        </div> : ''}

        <Footer />
    </div>
  )
}

export default Home