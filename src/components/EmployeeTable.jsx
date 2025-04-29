import React from 'react';
import {useMediaQuery} from "react-responsive";
import {Button, Card, Popconfirm, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

function EmployeeTable(props) {

    const isMobile = useMediaQuery({maxWidth: 767});
    const setModifyData = props.setModifyData;
    const setIsModify = props.setIsModify;
    const setIsInsert = props.setIsInsert;
    const employeeColumns=[
        {
            title: '프로필',
            dataIndex: 'file_url',
            key: 'file_url',
            width: 90,
            sorter: (a, b) => a - b,
            render: (text) => {
                if(text)
                return (
                    <div style={{textAlign: 'center'}}>
                        <Image src={text} width={50} height={50}></Image>
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
                    value:1
                },
                {
                    text:'기사',
                    value:2
                },
                {
                    text:'최고관리자',
                    value:9
                }
            ],
            onFilter: (value, record) => record.auth===value,
            render: (text) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        {text===1?'관리자':text===9?'최고관리자':'기사'}
                    </div>
                );
            },
        },
        {
            title: '계약형태',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            filters: [
                {
                    text:'계약직',
                    value:2
                },
                {
                    text:'정규직',
                    value:1
                }
            ],
            onFilter: (value, record) => record.type===value,
            render: (text) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        {text==2?"계약직":"정규직"}
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
            width: 150,
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
            width: 400,
            sorter: (a, b) => a - b,
            render: (text) => {
                return (
                    <div style={{textAlign: 'left'}}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '이메일',
            dataIndex: 'mail',
            key: 'mail',
            width: 200,
            render: (text) => {
                return (
                    <div style={{textAlign: 'left'}}>
                        {text}
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
            width: 250,
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
            dataIndex: 'entr_date',
            key: 'entr_date',
            width: 110,
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
            width: 110,
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
    return isMobile ? (
        <>
            {props.employeeList.map(el=>(
                <Card key={el.idx}
                      style={{ marginBottom: 16, borderRadius: 8 }}
                      title={`직원정보 : ${el.nm}`}
                      extra={
                          <div>
                              <Button
                                  icon={<EditOutlined />}
                                  onClick={() => {setModifyData(el);setIsModify(true);setIsInsert(true);}}
                                  style={{ marginRight: 8 }}
                                  size="small"
                              />
                              <Popconfirm
                                  title="정말 삭제하시겠습니까?"
                                  onConfirm={() => onDelete(record.res_no)}
                              >
                                  <Button icon={<DeleteOutlined />} danger size="small" />
                              </Popconfirm>
                          </div>
                      }>

                </Card>
            ))}
        </>
    ):(
      <>
          <Table rowKey={"idx"} columns={employeeColumns} dataSource={props.employeeList} size={"small"}scroll={{ x: 'max-content' }}

                 tableLayout="fixed">

          </Table>
      </>
    );
}

export default EmployeeTable;