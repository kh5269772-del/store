
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect, useContext } from 'react';
import { OrderIdContext } from '../common/context/cotext_order';


const OrderComparisonChart = () => {


  let { selectId } = useContext(OrderIdContext)

  const [data, setdata] = useState([])
  const [orderDate, setorderDate] = useState([])
  // const [product, setproduct] = useState([])

  useEffect(() => {
    import_prodects()

  }, [])










  async function import_prodects() {

    try {
      const api_product = await fetch("http://localhost:3000/products")
      const datap = await api_product.json()
      console.log(datap.products)
      // setproduct(datap.products)
    await  detalis_order(datap.products)

    } catch (error) {
      console.log(error)
    }
  }


  async function detalis_order(product) {

    const id = selectId || JSON.parse(localStorage.getItem("orderId"))
    if (!id) return;
    try {
      const api_detalis = await fetch('http://localhost:3000/details/order', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
      })
      const data_detalis = await api_detalis.json()
      const now = new Date(data_detalis.order.created_at)
      const data_t = now.toLocaleString().split(',')[0].split('/')
      const jj = data_t[2]+'-'+data_t[0]+'-'+data_t[1]
      console.log(jj)
   await   orderReqDay(jj,product)

    } catch (error) {
      console.log(error)
    }
  }





  async function orderReqDay(c,product) {

    try {
      const apiReqDay = await fetch(`http://localhost:3000/orders_req/day?item=${c}`)
      const dataReqDay = await apiReqDay.json()
      console.log(dataReqDay)
      // console.log(created)
      setorderDate(dataReqDay.orders)
    await  filterProduct(dataReqDay.orders,product);
    } catch (error) {
      console.log(error)
    }
  }

  async function filterProduct(order,product) {

    const chartData = order.map((eorder) => {
      const matchProduct = product.find((p) => p.id == eorder.productId)
      const productName = matchProduct.name;
      const productPrice = matchProduct.price;
      console.log(matchProduct, productName, productPrice)
      return {
        label: productName,
        totalPrice: parseInt(productPrice * eorder.quantity),
        quantity: parseInt(eorder.quantity)
      }


    })

    setdata(chartData)
    console.log(chartData)
  }
  console.log(data)



  return (
    <div
      style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid />
          <XAxis dataKey="label" />
          <YAxis width="auto" />
          <Tooltip cursor={{ fill: '#1e293b', opacity: 0.5 }} />
          <Legend />
          <Bar dataKey="totalPrice" radius={[10, 10, 0, 0]} stroke='#55f' fill='#55f' />
          <Bar dataKey="quantity" radius={[10, 10, 0, 0]} fill='#d83838' stroke='#d83838' />
        </BarChart>

      </ResponsiveContainer>


    </div>
  );
};

export default OrderComparisonChart;



