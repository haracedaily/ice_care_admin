import { useState } from 'react'
import './App.css'
import Header from "./layout/Header.jsx";
import Side from "./layout/Side.jsx";
import Body from "./layout/Body.jsx";
import Footer from "./layout/Footer.jsx";
import {BrowserRouter} from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function App() {

  return (
    <>
      <Side/>
        <main>
            <nav>
                <section>
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
