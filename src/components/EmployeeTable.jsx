import React from 'react';
import {useMediaQuery} from "react-responsive";
import {Table} from "antd";

function EmployeeTable(props) {

    const isMobile = useMediaQuery({maxWidth: 767});
    const employeeColumns=[
        {
            title: '프로필',
            dataIndex: 'file_url',
            key: 'file_url',
            width: 90,
            sorter: (a, b) => a - b,
            render: (text) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        <Image src={text} width={50} height={50}></Image>
                    </div>
                );
            },
        },
        {
            title: '아이디',
            dataIndex: 'id',
            key: 'id',
            width: 90,
            sorter: (a, b) => a.charCodeAt() - b.charCodeAt(),
            render: (text) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '이름',
            dataIndex: 'nm',
            key: 'nm',
            width: 90,
            sorter: (a, b) => a.charCodeAt() - b.charCodeAt(),
            render: (text) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '연락처',
            dataIndex: 'tel',
            key: 'tel',
            width: 90,
            sorter: (a, b) => a - b,
            render: (text) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '주소',
            dataIndex: 'addr',
            key: 'addr',
            width: 90,
            sorter: (a, b) => a - b,
            render: (text) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '이메일',
            dataIndex: 'mail',
            key: 'mail',
            width: 90,
            render: (text) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '계약형태',
            dataIndex: 'type',
            key: 'type',
            width: 90,
            filters: [
                {
                    text:'계약직',
                    value:1
                },
                {
                    text:'정규직',
                    value:2
                }
            ],
            onFilter: (value, record) => record.type===value,
            render: (text) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        {text==1?"계약직":"정규직"}
                    </div>
                );
            },
        },
        {
            title: '권한',
            dataIndex: 'auth',
            key: 'auth',
            width: 90,
            filters:[
                {
                    text:'관리자',
                    value:'admin'
                },
                {
                    text:'기사',
                    value:'1'
                }
            ],
            onFilter: (value, record) => record.auth===value,
            render: (text) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        {text==='admin'?'관리자':'기사'}
                    </div>
                );
            },
        },
        {
            title: '은행',
            dataIndex: 'bank',
            key: 'bank',
            width: 90,

            render: (text) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '계좌번호',
            dataIndex: 'account_num',
            key: 'account_num',
            width: 90,
            render: (text) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '입사일',
            dataIndex: 'entr_dt',
            key: 'entr_dt',
            width: 90,
            sorter: (a, b) => new Date(a) - new Date(b),
            render: (text) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '퇴사일',
            dataIndex: 'rsg_dt',
            key: 'rsg_dt',
            width: 90,
            sorter: (a, b) => a - b,
            render: (text) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        {text}
                    </div>
                );
            },
        },

    ];
    console.log(props);
    return isMobile ? (
        <>

        </>
    ):(
      <>
          <Table columns={employeeColumns} dataSource={props.employeeList} size={"small"}>

          </Table>
      </>
    );
}

export default EmployeeTable;