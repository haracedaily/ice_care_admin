import {useEffect, useState} from 'react'
import './App.css'
import Side from "./layout/Side.jsx";
import Body from "./layout/Body.jsx";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {MenuUnfoldOutlined} from "@ant-design/icons";
function App() {
const[toggleAside,setToggleAside]=useState(true);
useEffect(() => {
    window.scrollTo({top: 0, left: 0});
},[location.pathname]);
  return (
    <>
      <Side toggleAside={toggleAside} setToggleAside={setToggleAside} />
        <main className="login">
            <nav>
                <section>
                <MenuUnfoldOutlined style={{ fontSize: '32px' }} onClick={()=>{setToggleAside(!toggleAside)}}/>
                <AccountCircleIcon style={{fontSize:'50px'}} />
                </section>
            </nav>
            <div>
        <Body/>
            </div>
        </main>
    </>
  )
}

export default App
