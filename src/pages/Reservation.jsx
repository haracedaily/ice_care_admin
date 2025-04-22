import React, { useState, useEffect } from 'react';
import { Layout, Button, Modal, Tabs, Card, Flex } from 'antd';
import ReservationTable from '../components/ReservationTable';
import ReservationForm from '../components/ReservationForm';
import ResDashboard from '../components/ResDashboard';
import ResSearchFilters from "../components/ResSearchFilters.jsx";

import {supabase} from "../js/supabase.js";

import dayjs from 'dayjs';
import 'dayjs/locale/ko';

const { Content } = Layout;

const Reservation = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [filters, setFilters] = useState({
        name: '',
        tel: '',
        email: '',
        addr: '',
    });
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(1, 'month').startOf('day'),
        dayjs().endOf('day'),
    ]);

    // 데이터 가져오기
    const fetchReservations = async () => {
        let query = supabase.from('ice_res').select('*');

        if (filterType === 'cleaning') {
            query = query.eq('service', '청소');
        } else if (filterType === 'repair') {
            query = query.eq('service', '수리');
        }

        if (dateRange.length === 2 && dayjs.isDayjs(dateRange[0]) && dayjs.isDayjs(dateRange[1])) {
            query = query
                .gte('date', dateRange[0].toISOString())
                .lte('date', dateRange[1].toISOString());
        } else {
            setDateRange([dayjs().subtract(1, 'month').startOf('day'), dayjs().endOf('day')]);
            query = query
                .gte('date', dayjs().subtract(1, 'month').startOf('day').toISOString())
                .lte('date', dayjs().endOf('day').toISOString());
        }

        const { data, error } = await query;
        if (error) {
            console.error('Error fetching reservations:', error);
            return;
        }

        // 필터 적용
        let filtered = [...data];
        if (filters.name) {
            filtered = filtered.filter((r) =>
                r.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }
        if (filters.tel) {
            filtered = filtered.filter((r) => r.tel.includes(filters.tel));
        }
        if (filters.email) {
            filtered = filtered.filter((r) =>
                r.email.toLowerCase().includes(filters.email.toLowerCase())
            );
        }
        if (filters.addr) {
            filtered = filtered.filter((r) =>
                r.addr.toLowerCase().includes(filters.addr.toLowerCase())
            );
        }

        setReservations(data);
        setFilteredReservations(filtered);
    };

    // 초기 데이터 로드
    useEffect(() => {
        fetchReservations();
    }, [filterType, dateRange]);

    // 모달 핸들러
    const showModal = (reservation = null) => {
        setEditingReservation(reservation);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setEditingReservation(null);
        fetchReservations();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingReservation(null);
    };

    // 조회 버튼 핸들러
    const handleSearch = () => {
        fetchReservations();
    };

    return (
        <Layout style={{ minHeight: '100vh', padding: '20px' }}>
            <Content>
                <Card>
                    <Tabs
                        defaultActiveKey="all"
                        onChange={setFilterType}
                        items={[
                            { key: 'all', label: '전체' },
                            { key: 'cleaning', label: '청소' },
                            { key: 'repair', label: '수리' },
                        ]}
                    />

                    <ResDashboard
                        reservations={reservations}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                    />

                    <ResSearchFilters
                        filters={filters}
                        setFilters={setFilters}
                        onSearch={handleSearch}
                    />

                    <Flex justify="end" style={{ marginBottom: 16 }}>
                        <Button
                            type="primary"
                            onClick={() => showModal()}
                        >
                            예약등록
                        </Button>
                    </Flex>

                    <ReservationTable
                        reservations={filteredReservations}
                        onEdit={showModal}
                        onDelete={async (res_no) => {
                            await supabase.from('ice_res').delete().eq('res_no', res_no);
                            fetchReservations();
                        }}
                        onUpdate={fetchReservations} // onUpdate prop 추가
                    />

                    <Modal
                        title={editingReservation ? '예약 수정' : '새 예약 등록'}
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={null}
                        width={800}
                    >
                        <ReservationForm
                            reservation={editingReservation}
                            onSuccess={handleOk}
                        />
                    </Modal>
                </Card>
            </Content>
        </Layout>
    );
};

export default Reservation;