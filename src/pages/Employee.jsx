import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import locale from "antd/es/date-picker/locale/ko_KR";
import {Breadcrumb, Select, Input, Button} from "antd";
import {useNavigate} from "react-router-dom";
import styles from "../css/employee.module.css"
import {PlusOutlined, RedoOutlined, SearchOutlined} from "@ant-design/icons";
import EmployeeTable from "../components/EmployeeTable.jsx";

dayjs.extend(customParseFormat);

function Employee(props) {
    const [employeeList,setEmployeeList] = useState([]);
    const emplNavi = useNavigate();
    useEffect(() => {
      search_empl();
    },[]);
    async function search_empl(){
        await console.log("조회쿼리");
    };
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
                        <Button icon={<PlusOutlined/>}>
                            직원등록
                        </Button>
                    </div>


                </div>
                <EmployeeTable employeeList={employeeList} />
            </div>
        </>
    );
}

export default Employee;