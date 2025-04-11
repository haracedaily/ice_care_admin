import React, {useState} from 'react';
import {NavLink} from "react-router-dom";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import sideMenu from '../js/sideMenu.js';

function Side(props) {
    const [isReserved, setIsReserved] = useState(true);
    const [isNotice, setIsNotice] = useState(true);
    const [isStatus, setIsStatus] = useState(true);
    const [isEdit, setIsEdit] = useState(true);
    const [isFavorite, setIsFavorite] = useState(true);
    return (
        <>
            <aside className={'login'}>
                <div>
                    <NavLink to="/">
                        <img src="/src/images/side_logo.png" width={150} alt="Logo"/>
                    </NavLink>
                </div>
                <div>
                    <h1>관리자 센터</h1>
                </div>
                <div>
                    <h4>ID : </h4>
                    <span id={"id"}></span>
                    <h4>AUTH : </h4>
                    <span id={"pw"}></span>
                </div>
                <nav>
                    <h4>Dashboard</h4>
                    <div>
                        <div className={isStatus?"":"select"} onClick={() => {setIsStatus(!isStatus)}}>
                            <h3>대시보드</h3>
                        </div>
                    </div>
                    <h4>General</h4>
                    <Autocomplete
                        disablePortal
                        options={sideMenu}
                        sx={(theme) => ({
                            display: 'inline-block',
                            '& label':{
                              color:'white',
                            },
                            '& input': {
                                width: 300,
                                color: 'white',
                                fontSize:'8pt',
                            },

                        })}
                        renderInput={(params) => <TextField {...params}  label="메뉴찾기" />}
                    />
                    <div>
                        <div onClick={() => setIsFavorite(!isFavorite)}>
                            <h3>즐겨찾기</h3>
                            <img className={isFavorite?"":"rotate"} src="/src/images/polygon.png" alt="" width={10} height={10}/>
                        </div>
                        <ul className={isFavorite ? "none" : ""}>

                        </ul>
                    </div>
                    <div>
                        <div onClick={() => {setIsReserved(!isReserved)}}>
                            <h3>예약관리</h3>
                            <img className={isReserved?"":"rotate"} src="/src/images/polygon.png" alt="" width={10} height={10}/>
                        </div>
                        <ul className={`${isReserved ? 'none' : ''}`}>
                            <li>예약 등록</li>
                            <li>예약 수정</li>
                            <li>예약 조회</li>
                        </ul>
                    </div>
                    <div>
                        <div onClick={() => {setIsNotice(!isNotice)}}>
                            <h3>게시판</h3>
                            <img className={isNotice?"":"rotate"} src="/src/images/polygon.png" alt="" width={10} height={10}/>
                        </div>
                        <ul className={`${isNotice ? 'none' : ''}`}>
                            <li>게시글 등록</li>
                            <li>게시글 수정</li>
                            <li>게시글 조회</li>
                        </ul>
                    </div>

                    <div>
                        <div onClick={() => {setIsEdit(!isEdit)}}>
                            <h3>환경설정</h3>
                            <img  className={isEdit?"":"rotate"} src="/src/images/polygon.png" alt="" width={10} height={10}/>
                        </div>
                        <ul className={`${isEdit ? 'none' : ''}`}>
                            <li>메뉴관리</li>
                            <li>사원관리</li>
                        </ul>
                    </div>
                </nav>
            </aside>
        </>
    );
}

export default Side;