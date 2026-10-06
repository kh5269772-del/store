import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import '../src/components/pages/app.css'
import Nav from './components/common/nav'
import Home from './components/pages/home/home'
import About from './components/pages/about/about.jsx'
import { GoogleOAuthProvider } from 'react-oauth-google'
import Control from './components/controls/control.jsx'
import Select_Order from './components/controls/orders/select_order.jsx'
import Select_Product from './components/controls/products/select_product.jsx'


import Login_Req from './components/pages/signing/Login_request.jsx'
import Details_Product from './components/pages/details/details_product.jsx'
import Basket from './components/pages/basket/basket.jsx'
import Register_Request from './components/pages/signing/register_request.jsx'
import Product_User from './components/pages/details/product_user.jsx'
import Profile from './components/pages/home/profile.jsx'


function App() {


  const socket = io('http://localhost:3000')
  const use = JSON.parse(localStorage.getItem('id'))



  useEffect(() => {
    if (use) {
      socket.emit('join', use)
    }
    socket.on('onlineUser', (data) => {
      console.log(data)
    })
  }, [])


  useEffect(() => {
    Type_Browser()
  }, [])



  async function Type_Browser() {

    const userAgent = navigator.userAgentData
    console.log(userAgent)
    const brand = userAgent.brands.find((e) => {
  
      return e.brand == "Google Chrome" || e.brand == "Firefox" ||e.brand == "Safari"||e.brand =="Microsoft Edge"
    
    })
    console.log(brand)

    if (sessionStorage.getItem('agent')) {
      console.log('The visit has already taken place.')
      return;
    }

    sessionStorage.setItem("agent", JSON.stringify(brand))

    try {
      const api_user_agent = await fetch("http://localhost:3000/Type_Browser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: userAgent.platform, brand: brand.brand })
      })
      const data_user_agent = await api_user_agent.json()
      console.log(data_user_agent)

    } catch (error) {
      console.log(error)
    }
  }



  return (
    <GoogleOAuthProvider clientId={'12713413126-1qroacgal6rm8jqrij4ffegav1nb58f8.apps.googleusercontent.com'}>
      <div className='App'>

        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path='/' element={<Home />} />
            < Route path='/profile' element={<Profile />} />
            < Route path='/control' element={<Control />} />
            < Route path='/control/order' element={<Select_Order />} />
            <Route path='/control/product' element={<Select_Product />} />
            <Route path='/login_req' element={<Login_Req />} />
            <Route path='/register_req' element={<Register_Request />} />
             <Route path='/details_product' element={<Details_Product />} />
             <Route path='/basket' element={<Basket />}/>
             <Route path='/product/user' element={<Product_User />}/>

          </Routes>
        </BrowserRouter>

      </div>
    </GoogleOAuthProvider>
  )
}

export default App
