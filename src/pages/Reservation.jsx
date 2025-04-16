import React, { useState, useEffect } from 'react';
// import { Layout, Button, Modal, Tabs, Card, Flex } from 'antd';
// import ReservationTable from '../components/ReservationTable';
// import ReservationForm from '../components/ReservationForm';
// import MiniDashboard from '../components/ResDashboard.jsx';
// import SearchFilters from '../components/ResSearchFilters.jsx';
// import { supabase } from '../services/supabase';
// import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Breadcrumb } from 'antd';



function Reservation() {
    return (
        <div>
            <div>
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
            </div>
            <div>
            </div>
        </div>
    );
}

export default Reservation;