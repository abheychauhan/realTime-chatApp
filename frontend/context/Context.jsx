import { createContext, use, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const ChatContext = createContext()


const ChatProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [selectedChat, setSelectedChat] = useState(null)
    const [chats, setChats] = useState([])
    const [notifications, setNotifications] = useState([])
    const [showChatbox , setShowChatbox] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user")
        console.log(storedUser)
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        else {
            navigate("/")
        }


      
    }, [navigate])

    return (
        <ChatContext.Provider value={{ user, setUser ,selectedChat, setSelectedChat, chats, setChats , notifications, setNotifications ,showChatbox , setShowChatbox }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

export default ChatProvider