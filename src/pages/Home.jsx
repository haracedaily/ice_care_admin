import React, { PureComponent } from 'react';
import {ComposedChart,Line,Area,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,Scatter,ResponsiveContainer,} from 'recharts';
import { Breadcrumb } from 'antd';

const data = [
    {
        name: '2025-04-10',
        uv: 590,
        pv: 800,
        amt: 1400,
        cnt: 490,
    },
    {
        name: '2025-04-11',
        uv: 868,
        pv: 967,
        amt: 1506,
        cnt: 590,
    },
    {
        name: '2025-04-12',
        uv: 1397,
        pv: 1098,
        amt: 989,
        cnt: 350,
    },
    {
        name: '2025-04-13',
        uv: 1480,
        pv: 1200,
        amt: 1228,
        cnt: 480,
    },
    {
        name: '2025-04-14',
        uv: 1520,
        pv: 1108,
        amt: 1100,
        cnt: 460,
    },
    {
        name: '2025-04-15',
        uv: 1400,
        pv: 680,
        amt: 1700,
        cnt: 380,
    },
];

class Example extends PureComponent {
    render() {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="name" fontSize={10} scale="band" />
                    <YAxis
                        label={{
                            value: '누적예약 건',
                            angle: -90,
                            position: 'left',
                            offset: -10
                        }}
                        yAxisId="left"
                        domain={[0, 300]}
                    />
                    <YAxis
                        label={{
                        value: '예약 건',
                        angle:90,
                        position: 'right',
                        offset: -10
                    }}
                           yAxisId="right"
                           orientation="right"
                    />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" yAxisId={"left"} />
                    <Bar dataKey="pv" barSize={20} fill="#413ea0" yAxisId={"right"} />
                    <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={"left"} />
                    <Scatter dataKey="cnt" fill="red" yAxisId={"left"} />
                </ComposedChart>
            </ResponsiveContainer>
        );
    }
}


function Home(props) {
    return (
        <>
            <div>
                <div>
                    <Breadcrumb
                        separator=">"
                        items={[
                            {
                                title: 'Home',
                            },
                            {
                                title: '대시보드',
                                href: '',
                            },

                        ]}
                    />
                </div>
            </div>
            <div style={{width:'50%',height:'50%'}}>
                <Example />
            </div>
        </>
    );
}

export default Home;