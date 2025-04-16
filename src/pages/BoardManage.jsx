import React from 'react';
import {Breadcrumb} from "antd";

function BoardManage(props) {
    return (
        <div className="content">
            <div className="header">
                <h1>게시판 관리</h1>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: 'Home',
                        },
                        {
                            title: '게시판관리',
                            onClick:(e)=>{e.preventDefault(); reservationNavi("/contact");},
                            href: '',
                        },

                    ]}
                />
            </div>
        </div>
    );
}

export default BoardManage;