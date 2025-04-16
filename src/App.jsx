import { useState } from 'react'
import './App.css'
import Side from "./layout/Side.jsx";
import Body from "./layout/Body.jsx";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {MenuUnfoldOutlined} from "@ant-design/icons";
function App() {
const[toggleAside,setToggleAside]=useState(true);
  return (
    <>
      <Side toggleAside={toggleAside} setToggleAside={setToggleAside} />
        <main className="login">
            <nav>
                <section>
                <MenuUnfoldOutlined onClick={()=>{setToggleAside(!toggleAside)}}/>
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
