import React, { useEffect } from 'react'
import { useChat } from '../../context/Context'
import Mychats from '../../components/Mychats'
import Chatbox from '../../components/Chatbox'

function ChatPage() {



  const { user , setUser} = useChat()

  useEffect(() => {
      console.log(user)
    }, [setUser])


  return (
    <div className='chatpage w-full h-[calc(97vh-60px)] bg-white flex justify-between gap-2 shrink-0'>
        {!user && <div>Loading...</div>}
        {user && <Mychats/>}
        {user && <Chatbox/>}
    </div>
  )
}

export default ChatPage