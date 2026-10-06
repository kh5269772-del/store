
import { useState, useEffect } from 'react';
import { Pie, PieChart, Sector, ResponsiveContainer, Tooltip, Cell } from 'recharts';

function CustomActiveShapePieChart({ isAnimationActive = true }) {

  const [browser, setbrowser] = useState('')

  useEffect(() => {
    import_type()
  }, [])

  async function import_type() {
    try {
      const api_agent = await fetch("http://localhost:3000/users/agent")
      const data_agent = await api_agent.json()
      console.log(data_agent.agent)
      setbrowser(data_agent.agent)

    } catch (error) {
      console.log(error)
    }
  }

  // const data = [
  //   { name: 'Group A', value: 400 },
  //   { name: 'Group B', value: 300 },
  //   { name: 'Group C', value: 100 },
  //   { name: 'Group D', value: 200 },
  // ];


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#bd4fe9', '#f14a4a'];

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;

    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

    const sin = Math.sin(-RADIAN * (midAngle ?? 1));
    const cos = Math.cos(-RADIAN * (midAngle ?? 1));
    const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
    const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
    const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
    const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    // console.log(barnd)
    return (
      <>
        {/* {browser.map((item, index) => {
          console.log(item.brand)
          return ( */}
            <g>
              <text x={cx} y={cy} dy={8} textAnchor="middle" fill={"#fff"} fontSize={16} fontWeight="bold">
                {payload.brand}
              </text>
              <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
              <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={(outerRadius ?? 0) + 6} outerRadius={(outerRadius ?? 0) + 10} fill={fill} />
              <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
              <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />


              <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#ffffff">{`PV ${payload.brand}`}</text>
              <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey +15} dy={18} textAnchor={textAnchor} fill="#f0e5e5">
                {`(Rate ${((percent ?? 1) * 100).toFixed(2)}%)`}
              </text>

            </g>
          {/* )
        })
        } */}
      </>
    );
  };


  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  if (browser.length == 0) {

    <div>no browser</div>
    return
  }

  return (
    <div style={{ width: '100%', maxWidth: '480px', height: '270px', margin: '0 auto' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 30, right: 50, bottom: 30, left: 50 }}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={browser}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            dataKey="person"
            isAnimationActive={isAnimationActive}
            onMouseEnter={onPieEnter}
          >

            {browser.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}

          </Pie>
          <Tooltip content={() => null} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomActiveShapePieChart;