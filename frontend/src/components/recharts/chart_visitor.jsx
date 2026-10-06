
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';



const data = [
    { label: 'Group A', y: 400 },
    { label: 'Group B', y: 300 },
    { label: 'Group C', y: 100 },
    { label: 'Group D', y: 200 },
];

// #endregion
const AreaChartVisitor = ({ isAnimationActive = true }) => (
    <div
        style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}>

        <ResponsiveContainer>
            <AreaChart
                data={data}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >


                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid />
                <XAxis dataKey="label" />
                <YAxis width="auto" />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="x"
                    stroke="#8884d8"
                    activeDot={{ stroke: '#8884d8' }}
                    fillOpacity={1}
                    fill="url(#colorUv)"
                    isAnimationActive={isAnimationActive}
                    animationBegin={200}
                    animationDuration={1300}
                />
                <Area
                    type="monotone"
                    dataKey="y"
                    stroke="#82ca9d"
                    activeDot={{ stroke: '#82ca9d' }}
                    fillOpacity={1}
                    fill="url(#colorPv)"
                    isAnimationActive={isAnimationActive}
                />
            </AreaChart>
        </ResponsiveContainer>

    </div>
);

export default AreaChartVisitor;