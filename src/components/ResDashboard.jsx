import React from 'react';
import {Card, Statistic, DatePicker, Row, Col} from 'antd';
import 'dayjs/locale/ko';
import locale from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import {CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, FileDoneOutlined} from "@ant-design/icons";
dayjs.locale('ko');

const {RangePicker} = DatePicker;


function ResDashboard({reservations, dateRange, setDateRange}) {
    const stats = {
        total: reservations.length,
        pending: reservations.filter((r) => r.state === 1).length,
        confirmed: reservations.filter((r) => r.state === 2).length,
        completed: reservations.filter((r) => r.state === 3 ).length,
    };

    const handleDateChange = (dates) => {
        if (dates && dates.length === 2 && dayjs.isDayjs(dates[0]) && dayjs.isDayjs(dates[1])) {
            setDateRange([dates[0].startOf('day'), dates[1].endOf('day')]);
        } else {
            setDateRange([dayjs().subtract(1, 'month').startOf('day'), dayjs().endOf('day')]);
        }
    };


    return (
        <Card style={{
            marginBottom: 16,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: 8,
        }}>
            <RangePicker
                locale={locale}
                value={dateRange}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                style={{ marginBottom: 16 }}
                allowClear={false}
                disabledDate={(current) => {
                    return current && (current > dayjs().endOf('day') || current.year() > 2025);
                }}
            ></RangePicker>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{backgroundColor:'e6f7ff', borderRadius:8}}>
                        <Statistic>
                            title="전체 예약"
                            value={stats.total}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
                        </Statistic>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic>
                            title="예약 대기"
                            value={stats.pending}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#ff4d4f', fontSize: '24px', fontWeight: 'bold' }}
                        </Statistic>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic>
                            title="배정 대기"
                            value={stats.confirmed}
                            prefix={<FileDoneOutlined />}
                            valueStyle={{ color: '#096dd9', fontSize: '24px', fontWeight: 'bold' }}
                        </Statistic>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic>
                            title="배정 완료"
                            value={stats.completed}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
                        </Statistic>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
}

export default ResDashboard;