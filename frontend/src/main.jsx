import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ChatProvider from '../context/Context.jsx'
import 'remixicon/fonts/remixicon.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ChatProvider>
    <App />
  </ChatProvider>
  </BrowserRouter>
)
