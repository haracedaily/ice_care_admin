import React from 'react';
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';

function HomeIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
}



function Reservation() {
    return (
        <div>
            <h1>예약관리</h1>
            <HomeIcon/>
            <div>

            </div>
        </div>
    );
}

export default Reservation;