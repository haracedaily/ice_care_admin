import React, {PureComponent, useEffect, useState} from 'react';
import {ComposedChart,Line,Area,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,Scatter,ResponsiveContainer,} from 'recharts';
import { Breadcrumb } from 'antd';




function Home(props) {
    let [data,setData] = useState([
        {
            name: '2025-04-10',
            '완료': 590,
            '신규예약': 800,
            '누적예약': 800,
            '예약취소': 490,
        },
        {
            name: '2025-04-11',
            '완료': 868,
            '신규예약': 967,
            '누적예약': 1767,
            '예약취소': 590,
        },
        {
            name: '2025-04-12',
            '완료': 1397,
            '신규예약': 1098,
            '누적예약': 2865,
            '예약취소': 350,
        },
        {
            name: '2025-04-13',
            '완료': 1480,
            '신규예약': 1200,
            '누적예약': 4065,
            '예약취소': 480,
        },
        {
            name: '2025-04-14',
            '완료': 1520,
            '신규예약': 1108,
            '누적예약': 5165,
            '예약취소': 460,
        },
        {
            name: '2025-04-15',
            '완료': 1400,
            '신규예약': 680,
            '누적예약': 6845,
            '예약취소': 380,
        },
    ]);
    useEffect(() => {

    }, []);


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
                        <XAxis dataKey="name" fontSize={8} angle={-25} textAnchor="end" />
                        <YAxis
                            label={{
                                value: '누적예약 건',
                                angle: -90,
                                position: 'left',
                                offset: -10
                            }}
                            yAxisId="left"
                            domain={[0, 800]}
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
                        <Area type="monotone" dataKey="완료" fill="#8884d8" stroke="#8884d8" yAxisId={"right"} />
                        <Bar dataKey="신규예약" barSize={20} fill="#413ea0" yAxisId={"right"} />
                        <Line type="monotone" dataKey="누적예약" stroke="#ff7300" yAxisId={"left"} />
                        <Scatter dataKey="예약취소" fill="red" yAxisId={"right"} />
                    </ComposedChart>
                </ResponsiveContainer>
            );
        }
    }

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
            <div style={{width:'100%',height:'50%'}}>
                <Example />
            </div>
        </>
    );
}

export default Home;