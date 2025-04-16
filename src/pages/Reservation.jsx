import React, { useState, useEffect } from 'react';
import 'dayjs/locale/ko';
import {Breadcrumb, Layout} from 'antd';
import ResDashboard from "../components/ResDashboard.jsx";
import {supabase} from "../js/supabase.js";



const {Content} = Layout;


const Reservation = () =>{
    // const [reservations, setReservations] = useState([]);
    // const [filteredReservations, setFilteredReservations] = useState([]);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [editingReservation, setEditingReservation] = useState(null);
    const [filterType, setFilterType] = useState('all');
    // const [filters, setFilters] = useState({
    //     name: '',
    //     tel: '',
    //     email: '',
    //     addr: '',
    //     state: null,
    // });
    // const [dateRange, setDateRange] = useState([
    //     dayjs().subtract(1, 'month').startOf('day'), // 한 달 전
    //     dayjs().endOf('day'), // 오늘
    // ]);

    const fetchReservations = async () => {
        let query = supabase.from('ice_res').select('*');

        if(filterType === 'cleaning') {
            query = query.eq('service', '청소');
        }else if(filterType === 'repair') {
            query = query.eq('service', '수리');
        }
    }




    return(
        <Layout>
            <Breadcrumb
                separator=">"
                items={[
                    {
                        title: 'Home',
                    },
                    {
                        title: '예약관리',
                        // onClick:(e)=>{e.preventDefault();reservationNavi("/reservation");},
                        href: '',
                    },
                ]}
            />
            <Content>

            </Content>

        </Layout>
    );
};

export default Reservation;