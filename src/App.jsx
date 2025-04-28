import {useEffect, useState} from 'react'
import './App.css'
import Side from "./layout/Side.jsx";
import Body from "./layout/Body.jsx";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {MenuUnfoldOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
function App() {
const[toggleAside,setToggleAside]=useState(true);
const [login,setLogin]=useState("");
let navigator = useNavigate();
useEffect(() => {
    window.scrollTo({top: 0, left: 0});
    if(localStorage.getItem("log"))setLogin(JSON.parse(localStorage.getItem("log")));
    else if(!login)navigator("/login");
},[location.pathname]);
const logout = () => {
    localStorage.clear();
    setLogin("");
    navigator("/login");
}
  return (
    <>
        {login?
            <>
            <Side toggleAside={toggleAside} setToggleAside={setToggleAside} login={login} />
            <main className="login">
                <nav>
                    <section>
                        <MenuUnfoldOutlined style={{ fontSize: '32px' }} onClick={()=>{setToggleAside(!toggleAside)}}/>
                        <AccountCircleIcon style={{fontSize:'50px'}} onClick={logout}/>
                    </section>
                </nav>
                <div>
                    <Body/>
                </div>
            </main></>:<div>
            <Body setLogin={setLogin} />
            </div>}

    </>
  )
}

export default App
