import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Context from './components/common/context/context.jsx'
import Contextto from './components/common/context/cotext_order.jsx'
import Create_Context_Product from './components/common/context/context_product.jsx'
import Context_Details_P from './components/common/context/context_details_p.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Context>
    <Contextto>
     <Create_Context_Product>
     <Context_Details_P>
        <App />
     </Context_Details_P>
     </Create_Context_Product>
    </Contextto>
    </Context>
  </StrictMode>,
)
