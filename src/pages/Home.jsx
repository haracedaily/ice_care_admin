import React, {PureComponent, useEffect, useState} from 'react';
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Scatter,
    BarChart,
    ResponsiveContainer,
} from 'recharts';
import {Breadcrumb, DatePicker, Button, Flex, Select, Card, Col, Row} from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {useNavigate} from "react-router-dom";
import styles from '../css/home.module.css'
import {SearchOutlined} from '@ant-design/icons';
import locale from "antd/es/date-picker/locale/ko_KR";

dayjs.extend(customParseFormat);

function Home(props) {
    let [data, setData] = useState([
        {
            name: '04/10',
            '완료': 590,
            '신규예약': 800,
            '누적예약': 800,
            '예약취소': 490,
        },
        {
            name: '04/11',
            '완료': 868,
            '신규예약': 967,
            '누적예약': 1767,
            '예약취소': 590,
        },
        {
            name: '04/12',
            '완료': 1397,
            '신규예약': 1098,
            '누적예약': 2865,
            '예약취소': 350,
        },
        {
            name: '04/13',
            '완료': 1480,
            '신규예약': 1200,
            '누적예약': 4065,
            '예약취소': 480,
        },
        {
            name: '04/14',
            '완료': 1520,
            '신규예약': 1108,
            '누적예약': 5165,
            '예약취소': 460,
        },
        {
            name: '04/15',
            '완료': 1400,
            '신규예약': 680,
            '누적예약': 6845,
            '예약취소': 380,
        },
    ]);
    useEffect(() => {

    }, []);
    let [daily, setDaily] = useState(1);
    let homeNavi = useNavigate();

    let changeWeek = (e) => {
        setDaily(e);
    }
    const weekFormat = 'MM/DD';
    const monthFormat = 'YYYY/MM';
    const customWeekStartEndFormat = value =>
        `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
            .endOf('week')
            .format(weekFormat)}`;

    class NewReservChart extends PureComponent {
        render() {
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid stroke="#f5f5f5"/>
                        <XAxis dataKey="name" fontSize={8} angle={-45} textAnchor="end"/>
                        <YAxis
                            label={{
                                position: 'right',
                                offset: -10
                            }}
                            yAxisId="right"
                            orientation="right"
                        />
                        <Tooltip/>
                        <Bar dataKey="신규예약" fill="#93B2FF" yAxisId={"right"}/>
                    </BarChart>
                </ResponsiveContainer>
            );
        }
    }
    class CancleReservChart extends PureComponent {
        render() {
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid stroke="#f5f5f5"/>
                        <XAxis dataKey="name" fontSize={8} angle={-45} textAnchor="end"/>
                        <YAxis
                            label={{
                                position: 'right',
                                offset: -10
                            }}
                            yAxisId="right"
                            orientation="right"
                        />
                        <Tooltip/>
                        <Bar dataKey="예약취소" fill="#FFA69F" yAxisId={"right"}/>
                    </BarChart>
                </ResponsiveContainer>
            );
        }
    }
    class CompleteReservChart extends PureComponent {
        render() {
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid stroke="#f5f5f5"/>
                        <XAxis dataKey="name" fontSize={8} angle={-45} textAnchor="end"/>
                        <YAxis
                            label={{
                                position: 'right',
                                offset: -10
                            }}
                            yAxisId="right"
                            orientation="right"
                        />
                        <Tooltip/>
                        <Bar dataKey="완료" fill="#D6FF9F" yAxisId={"right"}/>
                    </BarChart>
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
                                onClick: (e) => {
                                    e.preventDefault();
                                    homeNavi("/");
                                },
                            },

                        ]}
                    />
                </div>
            </div>

            <div>
                <div className={styles.homeSearch}>
                    <Select
                        defaultValue={daily}
                        style={{minWidth: 80, maxWidth: 100}}
                        onChange={(e) => changeWeek(e)}
                        options={[
                            {value: 1, label: '일간'},
                            {value: 2, label: '주간'},
                        ]}
                    />

                    {
                        daily == 1 ? (
                            <DatePicker locale={locale} defaultValue={dayjs()} format={customWeekStartEndFormat}
                                        picker="week"/>) : (
                            <DatePicker locale={locale} defaultValue={dayjs('2015/01', monthFormat)}
                                        format={monthFormat}
                                        picker="month"/>)
                    }


                    <Button className={styles.Btn} icon={<SearchOutlined/>}></Button>
                </div>
                <Row gutter={[16, 8]}>
                    <Col xl={8} md={8} xs={24}>
                        <Card style={{backgroundColor: '#F1F5FF'}}>
                            <Row justify="center" align="top">
                                <Col md={16} xs={24}>
                                    <Row>
                                        <Col md={24} xs={24}>
                                            <h2>신규예약</h2>
                                        </Col>
                                        <Col md={24} xs={24}>
                                            <p>테스트</p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className={styles.palete} md={8} xs={24}>
                                    <Row>
                                        <Col md={24} xs={24}>
                                            <h3>누계</h3>
                                        </Col>
                                        <Col md={24} xs={24}>
                                            <p>테스트</p>
                                        </Col>
                                    </Row>
                                </Col>

                            </Row>
                        </Card>
                         <NewReservChart />
                    </Col>
                    <Col xl={8} md={8} xs={24}>
                        <Card style={{backgroundColor: '#FEF1F0'}}>
                            <Row justify="center" align="top">

                                <Col md={16} xs={24}>
                                    <Row>
                                        <Col md={24} xs={24}>
                                            <h2>예약취소</h2>
                                        </Col>
                                        <Col md={24} xs={24}>
                                            <p>테스트</p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className={styles.palete} md={8} xs={24}>
                                    <Row>
                                        <Col md={24} xs={24}>
                                            <h3>누계</h3>
                                        </Col>
                                        <Col md={24} xs={24}>
                                            <p>테스트</p>
                                        </Col>
                                    </Row>
                                </Col>

                            </Row>
                        </Card>
                        <CancleReservChart />
                    </Col>
                    <Col xl={8} md={8} xs={24}>
                        <Card style={{backgroundColor: '#F7FFEC'}}>
                            <Row justify="center" align="top">

                                <Col md={16} xs={16}>
                                    <Row>
                                        <Col md={24} xs={24}>
                                            <h2>완료</h2>
                                        </Col>
                                        <Col md={24} xs={24}>
                                            <p>테스트</p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className={styles.palete} md={8} xs={8}>
                                    <Row>
                                        <Col md={24} xs={24}>
                                            <h3>누계</h3>
                                        </Col>
                                        <Col md={24} xs={24}>
                                            <p>테스트</p>
                                        </Col>
                                    </Row>
                                </Col>

                            </Row>
                        </Card>
                        <CompleteReservChart />
                    </Col>
                </Row>
                {/*<div className={styles.dashBoard}>
                    <Example/>
                </div>*/}
                <div className={styles.dashBoard}>
                    {data.length > 0 ? (<table>
                        <colgroup>
                            <col style={{width: '20%'}}/>
                            <col style={{width: '20%'}}/>
                            <col style={{width: '20%'}}/>
                            <col style={{width: '20%'}}/>
                            <col style={{width: '20%'}}/>
                        </colgroup>
                        <tbody>
                        <tr>
                            <th>일자</th>
                            <th>신규예약</th>
                            <th>예약취소</th>
                            <th>완료</th>
                            <th>누적예약</th>
                        </tr>
                        {data.map(item =>
                            (<tr key={item.name}>
                                <td>
                                    {item.name}
                                </td>
                                <td>{item.신규예약}</td>
                                <td>{item.예약취소}</td>
                                <td>{item.완료}</td>
                                <td>{item.누적예약}</td>
                            </tr>)
                        )}
                        </tbody>
                    </table>) : ""}
                </div>
            </div>
        </>
    )
        ;
}

export default Home;