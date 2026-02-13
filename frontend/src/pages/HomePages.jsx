import React from 'react'
import NavBar from '../../components/NavBar'
import ChatPage from './ChatPage'
import { Outlet } from 'react-router-dom'

function HomePages() {
  return (
    <div className='w-full h-[100%] gap-2 flex flex-col'>
         <NavBar/>
         <Outlet/>
         <ChatPage/>        
    </div>
  )
}

export default HomePages