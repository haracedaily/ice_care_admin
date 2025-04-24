import React from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import locale from "antd/es/date-picker/locale/ko_KR";
import {Breadcrumb, Select, Input, Button} from "antd";
import {useNavigate} from "react-router-dom";
import styles from "../css/employee.module.css"
import {RedoOutlined, SearchOutlined} from "@ant-design/icons";
import EmployeeTable from "../components/EmployeeTable.jsx";

dayjs.extend(customParseFormat);

function Employee(props) {
    const emplNavi = useNavigate();
    const {Option} = Select;
    const division = [{id:"all",name:"전체"},{id:1,name:"계약직"},{id:2,name:"정규직"},{id:3,name:"관리자"}];
    return (
        <>
            <div className={styles.content}>
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
                <div>
                    <div className={styles.searchCondition}>
                    <Select
                        placeholder="카테고리 선택"
                        defaultValue="all"
                        style={{width: '150px'}}
                        allowClear={false}>
                        {division.map((el) => (
                            <Option key={el.id} value={el.id}>
                                {el.name}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        placeholder="이름 검색"
                        style={{width: '200px'}}
                        
                            />
                        <Button
                            icon={<SearchOutlined/>}
                        >
                            조회
                        </Button>
                        <Button
                            icon={<RedoOutlined/>}
                        >
                            초기화
                        </Button>
                    </div>


                </div>
                <EmployeeTable />
            </div>
        </>
    );
}

export default Employee;