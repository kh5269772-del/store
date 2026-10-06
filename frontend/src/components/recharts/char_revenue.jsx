
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';


const data = [
    { name: 'Group A', value: 400, y: 500 },
    { name: 'Group B', value: 300, y: 500 },
    { name: 'Group C', value: 100, y: 500 },
    { name: 'Group D', value: 200, y: 500 },
];

const ChartRevenue = () => {

    const [orders, setorders] = useState([])
    const [product, setproduct] = useState([])
    const [show , setshow ] =useState(false)

    


    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "June",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];




    const now = new Date()
    const date_day = now.toISOString().split("T")[0]
    const year = date_day.split("-")[0]
    const day = '00'
    const start_year = `${year}-${day}-${day}`
    const end_year = `${year}-12-31`
  


    useEffect(() => {
        import_orders()
        import_prodects()
    }, [])



    async function import_prodects() {

        try {
            const api_product = await fetch("http://localhost:3000/products")
            const data = await api_product.json()
            console.log(data)
            setproduct(data.products)



        } catch (error) {
            console.log(error)
        }
    }



    async function import_orders() {

        try {
            const api_order = await fetch("http://localhost:3000/orders")
            const data_orders = await api_order.json()
            setorders(data_orders.orders)
            console.log(data_orders.orders)
        } catch (error) {
            console.log(error)
        }
    }

    const filter_orders = orders.filter((item) => {
        if (item.created_at < end_year) {
            return item.created_at > start_year
        }
    })


    const moth_da = monthNames.map((name)=>{  
      return  {
            name:name,
            price:0,
            num:0,
        } 
})


    const filt = filter_orders.forEach((item,index) => {
        if(product.length == 0){
            return;
        }
        console.log(index)
        const fit_month = product.find((e) => {
            return e.id == item.productId
        })
        // const filter_index = filter_orders.filter((e)=>{
        //     return e.
        // })
      if(fit_month){
          const monthString  = item.created_at.split('T')[0].split('-')[1]
           const monthnum = parseInt(monthString) -1

          if(item.created_at.split('T')[0].split('-')[1] == monthString){
            moth_da[monthnum].num+= 1
          }
         
          console.log(monthnum )
          const price  = parseInt(fit_month.price * item.quantity)


          if(monthnum >= 0 && monthnum <= 11){
            moth_da[monthnum].price +=price
           
          }
      }
    
    })
    console.log(moth_da)


   
   



    return (
      <>
      {/* {moth_da.fill((e) => e.price > 0)?  */}
       <div
            style={{ width: '100%', minWidth:'600px', maxHeight: '70vh', height: '400px',aspectRatio: 1.618 }}>

            <ResponsiveContainer width={"100%"}>
                <BarChart
                    data={moth_da}
                    margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid />
                    <XAxis dataKey="name" />
                    <YAxis width="auto" stroke='#123' />
                    <Tooltip cursor={{ fill: 'rgba(17, 34, 51, 0.56)' }} />
                    <Legend />
                    <Bar dataKey="price" radius={[10, 10, 0, 0]} fill='#4160e9' stroke='#4160e9' />
                    <Bar dataKey="num" radius={[10, 10, 0, 0]} fill='#d83838' stroke='#d83838' />
                </BarChart>
            </ResponsiveContainer>

        </div> 
          {/* :''}  */}
      </>
    );
};

export default ChartRevenue;