import React from 'react';
import {NavLink} from "react-router-dom";

function Header(props) {
    return (
        <>
            <header>
                <nav>
                    <NavLink to="/">
                    <img src="/src/images/header_logo.png" alt="Logo"/>
                    </NavLink>

                    <button>로그인</button>
                </nav>

            </header>
        </>
    );
}

export default Header;