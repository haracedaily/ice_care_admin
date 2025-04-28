import React, {useEffect, useRef, useState} from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import locale from "antd/es/date-picker/locale/ko_KR";
import {Breadcrumb, Select, Input, Button, Modal, Form} from "antd";
import {useNavigate} from "react-router-dom";
import styles from "../css/employee.module.css"
import {PlusOutlined, RedoOutlined, SearchOutlined} from "@ant-design/icons";
import EmployeeTable from "../components/EmployeeTable.jsx";
import {getEmpl} from "../js/supabaseEmpl.js";

dayjs.extend(customParseFormat);

function Employee(props) {
    const [employeeList,setEmployeeList] = useState([]);
    const [searchType, setSearchType] = useState("");
    const [searchNm,setSearchNm] = useState("");
    const emplNavi = useNavigate();
    const [isInsert,setIsInsert] = useState(false);
    useEffect(() => {
      search_empl(searchType,searchNm);
    },[]);
    async function search_empl(type,nm){
        console.log(type);
        console.log(nm);
        setEmployeeList(await getEmpl(type,nm));
    };
    const {Option} = Select;
    const division = [{id:"",name:"전체"},{id:2,name:"계약직"},{id:1,name:"정규직"}];
    const changeType = (value)=>{
        setSearchType(value);
    }
    const searchClear = ()=>{
        setSearchNm("");
        setSearchType("");
    }
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
                        defaultValue=""
                        value={searchType}
                        onChange={(e)=>changeType(e)}
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
                        style={{width: '180px'}}
                        value={searchNm}
                        onChange={(e)=>setSearchNm(e.target.value)}
                            />
                        <Button
                            icon={<SearchOutlined/>}
                            onClick={() => {search_empl(searchType,searchNm);}}
                        >
                            조회
                        </Button>
                        <Button
                            onClick={searchClear}
                            icon={<RedoOutlined/>}
                        >
                            초기화
                        </Button>
                        <Button icon={<PlusOutlined/>} type={"primary"} onClick={()=> {
                            setIsInsert(!isInsert)
                        }} >
                            직원등록
                        </Button>
                    </div>


                </div>
                <Modal open={isInsert} onCancel={()=>setIsInsert(false)}>
                    <Form>
                        <Form.Item label={"아이디"} name={"id"} rules={[{required:true,message:'아이디를 입력해주세요.'}]}>
                            <Input key={"id"}/>
                        </Form.Item>
                        <Form.Item label={"비밀번호"} name={"pw"} rules={[{required:true,message:'비밀번호를 입력해주세요'},{pattern:/[\s\S]{8,}/,message:"8자 이상 입력해주세요."},{pattern:/[!@#$%^&*]{1,}/,message:"특수문자 1개 이상 입력해주세요."}]}>
                            <Input.Password key={"pw"}/>
                        </Form.Item>
                        <Form.Item label={"이름"} name={"nm"} rules={[{required:true,message:"이름을 입력해주세요."}]}>
                            <Input key={"nm"}/>
                        </Form.Item>
                    </Form>

                </Modal>
                <EmployeeTable employeeList={employeeList} />
            </div>
        </>
    );
}

export default Employee;