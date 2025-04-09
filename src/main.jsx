import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";

// const log = localStorage.getItem('yourDataKey');
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <App />
    </BrowserRouter>,
)
