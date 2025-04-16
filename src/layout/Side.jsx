import React, {useState} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import sideMenu from '../js/sideMenu.js';
import { AutoComplete } from 'antd';
import {CloseCircleOutlined} from "@ant-design/icons";

function Side({toggleAside,setToggleAside}) {
    const [currentSide, setCurrentSide] = useState('dashboard');
    const sideNav = useNavigate();
    const autocompleteSelect = (value,option)=>{
        setCurrentSide(option.state);
        sideNav(option.link);
    }
    return (
        <>
            <aside className={`login ${toggleAside ? "toggle" : ""}`}>
                <div>
                    <NavLink to="/">
                        <img src="/src/images/side_logo.png" width={150} alt="Logo"/>
                    </NavLink>
                    <div className={`${toggleAside?"toggle":""}`}>
                    <CloseCircleOutlined  onClick={()=>{setToggleAside(!toggleAside)}} />
                    </div>
                </div>
                <div>
                    <h1>관리자 센터</h1>
                </div>

                <nav>
                    <h4>Dashboard</h4>
                    <div>
                        <div className={`${currentSide==="dashboard"?"select":""}`} onClick={() => {setCurrentSide("dashboard");sideNav("/")}}>
                            <h3>대시보드</h3>
                        </div>
                    </div>
                    <h4>General</h4>
                    <AutoComplete
                        style={{ width: 150 }}
                        options={sideMenu}
                        onSelect={autocompleteSelect}
                        placeholder="메뉴검색"
                        filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                    />
                    {/*<div>
                        <div className={isFavorite?"":"select"} onClick={() => setIsFavorite(!isFavorite)}>
                            <h3>즐겨찾기</h3>
                            <img className={isFavorite?"":"rotate"} src="/src/images/polygon.png" alt="" width={10} height={10}/>
                        </div>
                        <ul className={isFavorite ? "none" : ""}>

                        </ul>
                    </div>*/}
                    <div>
                        <div className={`${currentSide==="reservation"? "select" : ""}`} onClick={() => {setCurrentSide("reservation");sideNav("/reservation")}}>
                            <h3>예약관리</h3>
                            <img className={`${currentSide==="reservation"?"rotate":""}`} src="/src/images/polygon.png" alt="" width={10} height={10}/>
                        </div>
                        <ul className={`${currentSide==="reservation"? '' : 'none'}`}>
                            <li>예약 등록</li>
                            <li>예약 수정</li>
                            <li>예약 조회</li>
                        </ul>
                    </div>
                    <div>
                        <div className={`${currentSide==="contact"? "select" : ""}`} onClick={() => {setCurrentSide("contact");sideNav("/contact")}}>
                            <h3>게시판</h3>
                            <img className={`${currentSide==="contact"? "rotate" : ""}`} src="/src/images/polygon.png" alt="" width={10} height={10}/>
                        </div>
                        <ul className={`${currentSide==="contact" ? '' : 'none'}`}>
                            <li>게시글 등록</li>
                            <li>게시글 수정</li>
                            <li>게시글 조회</li>
                        </ul>
                    </div>

                    <div>
                        <div className={`${currentSide==="employee" ? "select" : ""}`} onClick={() => {setCurrentSide("employee")}}>
                            <h3>환경설정</h3>
                            <img  className={`${currentSide==="employee"? "rotate" : ""}`} src="/src/images/polygon.png" alt="" width={10} height={10}/>
                        </div>
                        <ul className={`${currentSide==="employee" ? '' : 'none'}`}>
                            <li>메뉴관리</li>
                            <li>사원관리</li>
                        </ul>
                    </div>
                </nav>
                <div>
                    <h4>ID : </h4>
                    <span id={"id"}></span>
                    <h4>AUTH : </h4>
                    <span id={"pw"}></span>
                </div>
            </aside>
        </>
    );
}

export default Side;