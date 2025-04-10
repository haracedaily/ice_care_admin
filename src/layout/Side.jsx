import React, {useState} from 'react';
import {NavLink} from "react-router-dom";

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
                    <h4>General</h4>
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
                        <div onClick={() => {setIsStatus(!isStatus)}}>
                            <h3>현황조회</h3>
                            <img className={isStatus?"":"rotate"} src="/src/images/polygon.png"  alt="" width={10} height={10}/>
                        </div>
                        <ul className={`${isStatus ? 'none' : ''}`}>
                            <li>기간별현황조회</li>
                            <li>기간별매출조회</li>
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