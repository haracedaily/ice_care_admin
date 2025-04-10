import { useState } from 'react'
import './App.css'
import Header from "./layout/Header.jsx";
import Side from "./layout/Side.jsx";
import Body from "./layout/Body.jsx";
import Footer from "./layout/Footer.jsx";
import {BrowserRouter} from "react-router-dom";

function App() {

  return (
    <>
      <Side/>
        <main>
            <nav>
                <section>
                <img src="" alt=""/>
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
