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
    ResponsiveContainer, PieChart, Pie, Cell,Sector
} from 'recharts';
import {Breadcrumb, DatePicker, Button, Flex, Select, Card, Col, Row} from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {useNavigate} from "react-router-dom";
import styles from '../css/home.module.css'
import {SearchOutlined} from '@ant-design/icons';
import locale from "antd/es/date-picker/locale/ko_KR";
import {getStatesByPeriod} from "../js/supabase.js";

dayjs.extend(customParseFormat);

function Home(props) {
    let [data, setData] = useState([]);
    let [timeData, setTimeData] = useState([]);
    let [loading, setLoading] = useState(false);
    let [daily, setDaily] = useState(1);
    let [state, setState] = useState(1);
    useEffect(() => {
         chooseDate(dayjs());
    }, []);
    let homeNavi = useNavigate();

    /*변수 선언*/
    const weekFormat = 'MM-DD';
    const monthFormat = 'YYYY-MM';
    const dateFormat = 'YYYY-MM-DD';
    const yearFormat = 'YYYY';
    const timeRole = ["오전 10시 ~ 오후 1시","오후 2시 ~ 오후 5시","오후 4시 ~ 오후 7시","오후 6시 ~ 오후 9시"];
    const stateRole = {
        5: "처리완료",
        9: "취소",
        10: "누적예약"
    };
    /*기능 함수*/
    let changeWeek = (e) => {
        setDaily(e);
    }
    
    let changeState = (e) => {
        setState(e);
    }
    
    let chooseDate = async (e) => {
        if(e == null) return;
        let prop = dayjs(e).startOf('week').format('YYYY,MM,DD');
        setLoading(true);
        prop = prop.split(',').map(el=>parseInt(el));
        await getStatesByPeriod(prop[0], prop[1], prop[2], daily).then((res) => {
            let outerData = [];
            let innerDate = "";
            let outerTime = [];
            let innerTime = "";
            let innerBarSum = 0;
            let innerPieSum = 0;
            /*바차트 데이터 가공*/
            for(let i=0; i<7; i++){
                let innerData = {};
                innerData["일자"] = dayjs(`${prop[0]}-${prop[1]}-${prop[2]+i}`).startOf("date").format("MM/DD");
                innerData["신규예약"] = 0;
                innerData["취소"] = 0;
                innerData["완료"] = 0;
                innerData["누적예약"] = 0;
                outerData.push(innerData);
            }
            res.data.stat_by_date.map(el => {
                let innerData = {};
                innerBarSum+= el.cnt;
                if(innerDate != el.date.slice(5).replace("-", "/")){
                    innerDate = el.date.slice(5).replace("-", "/");
                    let originInner = outerData.find(el=>el["일자"]==innerDate);
                    if(stateRole[el.state]?.length>0){
                        originInner[stateRole[el.state]] = el.cnt;
                    }
                    if(el.state==9)innerBarSum-= el.cnt;
                    originInner["신규예약"] += el.cnt;
                    originInner["누적예약"] = innerBarSum;
                }else{
                    let originInner = outerData.find(el=>el["일자"]==innerDate);
                    if(stateRole[el.state]?.length>0){
                        originInner[stateRole[el.state]] = el.cnt;
                    }
                    if(el.state==9)innerBarSum -= el.cnt;
                    originInner["신규예약"] += el.cnt;
                    originInner["누적예약"] = innerBarSum;
                }
            });
            setData(outerData);
            
            /*파이차트 데이터*/
            timeRole.forEach(el => {
                let innerTimeData = {};
                innerTimeData["시간"] = el;
                innerTimeData["신규예약"] = 0;
                innerTimeData["취소"] = 0;
                innerTimeData["완료"] = 0;
                innerTimeData["누적예약"] = 0;
                outerTime.push(innerTimeData);
            })
            res.data.stat_total_by_state.map(el=>{
                let innerTimeData = {};
                innerPieSum+=el.cnt;
                if(innerTime != el.time){
                    innerTime = el.time;
                    let originInner = outerTime.find(el=>el["시간"]==innerTime);
                    if(stateRole[el.state]?.length>0){
                        originInner[stateRole[el.state]] = el.cnt;
                    }
                    if(el.state==9)innerPieSum -= el.cnt;
                    originInner["신규예약"] += el.cnt;
                    originInner["누적예약"] = innerPieSum;
                    }else{
                    let originInner = outerTime.find(el=>el["시간"]==innerTime);
                    if(stateRole[el.state]?.length>0){
                        originInner[stateRole[el.state]] = el.cnt;
                    }
                    if(el.state==9)innerPieSum -= el.cnt;
                    originInner["신규예약"] += el.cnt;
                    originInner["누적예약"] = innerPieSum;
                }
            })
            setTimeData(outerTime);
            setLoading(false);
        });
        // let res2 = await supabase.rpc("getStatesByPeriod",{year: prop[0],month:prop[1],start_date:prop[2],key:daily});
    }
    let chooseYear = (e) => {
        console.log(dayjs(e).startOf('year').format(yearFormat));
        console.log(daily);
    }
    /*달력, 날짜 커스텀*/
    const customWeekStartEndFormat = value =>
        `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
            .endOf('week')
            .format(weekFormat)}`;

    /*바 차트 커스텀*/
    class NewReservChart extends PureComponent {
        render() {
            return (
                <ResponsiveContainer width="90%" height={500}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 10,
                            bottom: 20,
                            left: 10,
                        }}
                    >
                        <CartesianGrid stroke="#f5f5f5"/>
                        <XAxis dataKey="일자" fontSize={8} angle={-45} textAnchor="end"/>
                        <YAxis
                            label={{
                                position: 'right',
                                offset: -10
                            }}
                            yAxisId="left"
                            orientation="left"
                        />
                        <Tooltip color="#FFFFFF"/>
                        <Bar dataKey="신규예약" fill="#93B2FF" yAxisId={"left"}/>
                        <Bar dataKey="취소" fill="#FFA69F" yAxisId={"left"}/>
                        <Bar dataKey="완료" fill="#D6FF9F" yAxisId={"left"}/>
                    </BarChart>
                </ResponsiveContainer>
            );
        }
    }

    /*파이,원형 차트 커스텀*/
    const COLORS = ['#eafdb2', '#d5ffa0', '#9bffa0','#acffc9'];


    const renderCustomizedLabel = (props) => {
        let { cx, cy, midAngle, innerRadius, outerRadius, percent, index,value } = props;
        if(value==0) return;
        const RADIAN = Math.PI / 180;

        const radius = innerRadius + (outerRadius - innerRadius) * 0.05;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        const mx = x + (radius-75) * Math.cos(-midAngle * RADIAN);
        const my = y + (radius-20) * Math.sin(-midAngle * RADIAN);
        return (
            <text x={mx} y={my} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${state==1?"신규예약":state==9?"취소":"완료"} : ${state==1?props.신규예약:state==9?props.취소:props.완료}건`}
            </text>
        );
    };


    class TimeRound extends PureComponent {

        state = {
            activeIndex: 0,
        };

        onPieEnter = (_, index) => {
            this.setState({
                activeIndex: index,
            });
        };
        render() {
            return (
                <ResponsiveContainer width="90%" height={500}>
                <PieChart>
                    <Pie
                        animationDuration={500}
                        labelLine={false}
                        label={renderCustomizedLabel}
                        data={timeData}
                        cx="50%"
                        cy="50%"
                        innerRadius="30%"
                        outerRadius="90%"
                        fill="#8884d8"
                        dataKey={state==1?"신규예약":state==9?"취소":"완료"}
                        onMouseEnter={this.onPieEnter}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>

                </PieChart>
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
                            {value: 2, label: '월간'},
                        ]}
                    />

                    {
                        daily == 1 ? (
                            <DatePicker locale={locale} defaultValue={dayjs()} format={customWeekStartEndFormat} onChange={(e)=>chooseDate(e)}
                                        picker="week"/>) : (
                            <DatePicker locale={locale} defaultValue={dayjs('2015/01', yearFormat)} onChange={(e)=>chooseYear(e)}
                                        format={yearFormat}
                                        picker="year"/>)
                    }


                    <Button loading={loading} className={styles.Btn} icon={<SearchOutlined/>}></Button>
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
                    </Col>
                    <Col xl={8} md={8} xs={0}>
                        <Card style={{backgroundColor: '#FEF1F0'}}>
                            <Row justify="center" align="top">

                                <Col md={16} xs={24}>
                                    <Row>
                                        <Col md={24} xs={24}>
                                            <h2>취소</h2>
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
                    </Col>
                    <Col xl={8} md={8} xs={0}>
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
                    </Col>
                </Row>
                {/*<div className={styles.dashBoard}>
                    <Example/>
                </div>*/}
                <Row style={{marginTop: 8,height:"80%",placeItems:'center',padding:'10px'}} gutter={[16, 16]}>
                    <Col md={12} xs={24}>
                        <NewReservChart/>
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
                                    <th>취소</th>
                                    <th>완료</th>
                                    <th>누적예약</th>
                                </tr>
                                {data.map(item =>
                                    (<tr key={item.일자}>
                                        <td>
                                            {item.일자}
                                        </td>
                                        <td>{item.신규예약}</td>
                                        <td>{item.취소}</td>
                                        <td>{item.완료}</td>
                                        <td>{item.누적예약}</td>
                                    </tr>)
                                )}
                                </tbody>
                            </table>) : ""}
                        </div>
                    </Col>
                    <Col md={12} xs={24}>
                        <Select
                            defaultValue={state}
                            style={{minWidth: 80, maxWidth: 100}}
                            onChange={(e) => changeState(e)}
                            options={[
                                {value: 1, label: '신규예약'},
                                {value: 9, label: '취소'},
                                {value: 5, label: '완료'},
                            ]}
                        />
                    <TimeRound/>
                        <div className={styles.dashBoard}>
                            {timeData.length > 0 ? (<table>
                                <colgroup>
                                    <col style={{width: '40%'}}/>
                                    <col style={{width: '15%'}}/>
                                    <col style={{width: '15%'}}/>
                                    <col style={{width: '15%'}}/>
                                    <col style={{width: '15%'}}/>
                                </colgroup>
                                <tbody>
                                <tr>
                                    <th>시간</th>
                                    <th>신규예약</th>
                                    <th>취소</th>
                                    <th>완료</th>
                                    <th>누적예약</th>
                                </tr>
                                {timeData.map(item =>
                                    (<tr key={item.시간}>
                                        <td>
                                            {item.시간}
                                        </td>
                                        <td>{item.신규예약}</td>
                                        <td>{item.취소}</td>
                                        <td>{item.완료}</td>
                                        <td>{item.누적예약}</td>
                                    </tr>)
                                )}
                                </tbody>
                            </table>) : ""}
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Home;
