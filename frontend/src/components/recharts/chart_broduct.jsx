

import { useState, useEffect } from "react"
import { Pie, PieChart, ResponsiveContainer, Sector, useActiveTooltipDataPoints, useIsTooltipActive } from 'recharts';

function Chart_Product(props) {

  console.log(props)
  const [data, setdata] = useState([])


  const RADIAN = Math.PI / 180;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


  useEffect(() => {
    if (props.productId) {
      import_details_product(props.productId)
    }

  }, [props.productId])


  async function import_details_product(id) {


    try {
      const api_product = await fetch("http://localhost:3000/details/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
      })
      const data_product = await api_product.json()
      console.log(data_product)
      import_orders(data_product.product)
    } catch (error) {
      console.log(error)
    }
  }

  async function import_orders(product) {
    try {
      const api_orders = await fetch("http://localhost:3000/orders/success")
      const data_orders = await api_orders.json()
      console.log(data_orders.orders)
      filter_data(product, data_orders.orders)
    } catch (error) {
      console.log(error)
    }
  }



  function filter_data(product, orders) {

    const fitOrder = orders.filter((e) => {
      return e.productId == product.id
    })
    const fitNotOrder = orders.filter((e) => {
      return e.productId != product.id
    })
    if (fitNotOrder.length!=0 && fitOrder.length!=0) {

      setdata([{name:'Current product',value:fitOrder.length},
        {name:'All Products',value:fitNotOrder.length}]
      )

    }
    console.log({ 
      orders_f: fitOrder.length,
      order_no_f: fitNotOrder.length

    })
  }

  console.log(data)

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
      return null;
    }


    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const ncx = Number(cx);
    const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const ncy = Number(cy);
    const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12px"
        fontWeight="bold"
      >
        {`${name}: ${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    );
  };

  const MyCustomPie = (props) => {
    const p = useActiveTooltipDataPoints();
    const isAnyPieActive = useIsTooltipActive();

    const isThisPieActive = isAnyPieActive && props.name === p?.[0]?.name;

    let fillOpacity;
    if (isAnyPieActive) {
      fillOpacity = isThisPieActive ? 1 : 0.3;
    } else {
      fillOpacity = 0.5;
    }

    return (
      <Sector
        {...props}
        fill={COLORS[props.index % COLORS.length]}
        stroke="#fff"
        strokeWidth={2}
        fillOpacity={fillOpacity}
        style={{ transition: 'fill-opacity 0.2s ease', cursor: 'pointer' }}
      />
    );
  };


  return (
    <div style={{ width: '100%', maxWidth: '500px', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            labelLine={false}
            label={renderCustomizedLabel}
            // isAnimationActive={isAnimationActive}
            shape={MyCustomPie}
            outerRadius="85%"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart_Product;