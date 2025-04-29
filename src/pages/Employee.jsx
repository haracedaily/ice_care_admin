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
    let [form] = Form.useForm();
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
                <Modal
                    title={"직원 등록"}
                    open={isInsert}
                    onCancel={()=>setIsInsert(false)}
                    okText={"등록"}
                    cancelText={"취소"}>
                    <Form form={form} layout={"vertical"}>
                        <Form.Item label={"아이디"} name={"id"} rules={[{required:true,message:'아이디를 입력해주세요.'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"비밀번호"} name={"pw"} rules={[{required:true,message:'비밀번호를 입력해주세요'},{pattern:/[\s\S]{8,}/,message:"8자 이상 입력해주세요."},{pattern:/[!@#$%^&*]{1,}/,message:"특수문자 1개 이상 입력해주세요."}]}>
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item label={"이름"} name={"nm"} rules={[{required:true,message:"이름을 입력해주세요."}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"연락처"} name={"tel"} rules={[{required:true,message:"연락처를 입력해주세요."}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"권한"} name={"auth"}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"계약형태"} name={"type"}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"주소"} name={"addr"}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"이메일"} name={"mail"}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"은행"} name={"bank"}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"계좌번호"} name={"account"}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"입사일"} name={"entr_date"}>
                            <Input/>
                        </Form.Item>

                    </Form>

                </Modal>
                <EmployeeTable employeeList={employeeList} />
            </div>
        </>
    );
}

export default Employee;