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
      <Header/>
      <Side/>
        <main>
        <Body/>
        </main>
        <Footer/>
    </>
  )
}

export default App
