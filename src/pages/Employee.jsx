import React from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import locale from "antd/es/date-picker/locale/ko_KR";
import {Breadcrumb} from "antd";
import {useNavigate} from "react-router-dom";


dayjs.extend(customParseFormat);

function Employee(props) {
    const emplNavi = useNavigate();

    return (
        <>
            <div className="content">
                <div>
                    <div>
                        <Breadcrumb
                            separator=">"
                            items={[
                                {
                                    title: 'Home',
                                },
                                {
                                    title: '직원관리',
                                    href: '',
                                    onClick: (e) => {
                                        e.preventDefault();
                                        emplNavi("/employee");
                                    },
                                },

                            ]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Employee;