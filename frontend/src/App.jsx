import { Route, Routes ,  } from 'react-router-dom'
import AuthTabs from './pages/AuthTabs'
import HomePages from './pages/HomePages'
import ChatPage from './pages/ChatPage'
import { useChat } from '../context/Context'

const App = () => {
  const {user} = useChat()
  return (
    <div className=' w-full max-h-screen p-2 overflow-hidden'>
      <Routes>
        <Route path="/" element={<AuthTabs/>} />
        <Route path="/home" element={user && <HomePages/>} />
        <Route path="/Chat" element={<ChatPage/>} />
      </Routes>
      
    </div>
  )
}

export default App
