import React, { use, useEffect, useState } from 'react'
import { useChat } from '../context/Context'
import { Link } from 'react-router-dom'
import axios from '../src/utils/axios'
import Loading from './Loading'
import SearchList from './SearchList'

function NavBar() {

  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [click, setClick] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)
  const [showNotification, setShowNotification] = useState(false)


  const { user, notifications, setNotifications, setSelectedChat } = useChat()

  useEffect(() => {

    const fetchSearchResults = async () => {

      if (search.trim() === "") {
        setSearchResult([])
        return
      }
      setLoading(true)

      const token = sessionStorage.getItem("token")

      try {
        const re = await axios.get(`/user/all?search=${search}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(re)
        if (re.data.length > 0) {
          setSearchResult(re.data)
        } else {
          setSearchResult([])
        }
        console.log(search)
        setLoading(false)
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    }

    setTimeout(() => {
      fetchSearchResults()

    }, 1000);

  }, [search])


  const logoutHandler = () => {
    setLoadingLogout(true)
    setTimeout(() => {
      sessionStorage.removeItem("user")
      sessionStorage.removeItem("token")
      setLoadingLogout(false)
      window.location.reload()
    }, 1000);
  }

  const handleNotifyChat = (notify) => {
    setSelectedChat(notify.chat)
    setNotifications(notifications.filter(n => n._id !== notify._id))
    setShowNotification(false)
  }


  return (
    <div className='navbar w-full h-[60px] flex justify-between  items-center p-4'>
      <div className={`
      absolute w-1/4  h-[calc(98vh-60px)] top-[60px] transition-all duration-1000 ease-in-out ${click ? 'left-0' : 'left-[-100%]'}
      rounded-xl shadow-xl z-50 p-4 border border-gray-300 bg-white
      `}>
        <input
          type="text"
          placeholder='Search by name or email'
          className='w-full p-2 border-[1px] border-gray-300 outline-none text-blue-500 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 transition-colors duration-300'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <SearchList searchResult={searchResult} setClick={setClick} />

      </div>

      <button onClick={() => setClick(!click)} className="search flex  items-center gap-2 cursor-pointer hover:bg-blue-400 p-2 rounded-lg transition-colors duration-300">
        <i className="ri-search-line text-xl font-bold"></i>
        <span>Search</span>
      </button>

      <h1 className='hidden md:block'>Chatapp</h1>

      <div className='relative flex  h-full items-center gap-2 '>
        <div
          onClick={() => setShowNotification(true)}
          className="relative notification w-fit cursor-pointer p-2 rounded-lg transition-colors duration-300"
        >
          <i className="ri-notification-2-line hover:scale-110 block text-2xl"></i>

          {notifications.length > 0 && (
            <span className="absolute bottom-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </div>


        {showNotification && (
          <div onClick={() => setShowNotification(false)} className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white w-[300px] p-4 rounded-xl shadow-xl relative animate-scaleIn">
              <button
                onClick={() => setShowNotification(false)}
                className="absolute top-2 right-3 text-gray-500 text-xl"
              >
                <i className="ri-close-large-fill text-blue-500 hover:text-red-500 cursor-pointer"></i>
              </button>
              <h2 className="text-lg font-semibold mb-4">Notifications</h2>
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">No new notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div key={notif._id} onClick={() => handleNotifyChat(notif)} className="p-2  cursor-pointer hover:bg-gray-100  rounded-lg">
                    {notif.chat.isGroupChat
                      ? `New message in ${notif.chat.chatName}`
                      : `New message from ${notif.sender.name}`}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className='w-[1px] h-1/2 rounded-xl bg-gray-300'></div>

        <div onClick={() => setOpenProfile(!openProfile)} className="profile flex items-center gap-2 cursor-pointer hover:bg-blue-400 p-2 rounded-lg transition-colors duration-300">
          <img className='w-8 md:w-10 rounded-full' src={user.pic} alt="" />
          <span className='text-sm'>{user.name}</span>
        </div>

        {
          openProfile && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

              {/* Modal Box */}
              <div className="bg-white  md:w-[350px] p-6 rounded-xl shadow-xl relative animate-scaleIn">

                {/* Close Button */}
                <button
                  onClick={() => setOpenProfile(false)}
                  className="absolute top-2 right-3 text-gray-500 text-xl"
                >
                  <i className="ri-close-large-fill text-blue-500 hover:text-red-500 cursor-pointer"></i>
                </button>

                <div className="flex flex-col items-center gap-3">
                  <img
                    src={user.pic}
                    className="w-20 h-20 rounded-full object-cover"
                    alt=""
                  />
                  <h2 className="text-lg font-semibold">{user.name}</h2>
                  <p className="text-sm text-gray-500">Profile Settings</p>

                  <button onClick={logoutHandler} className="w-full bg-blue-500 text-white py-2 rounded-lg mt-3">
                    Logout
                  </button>
                  {loadingLogout && (
                    <Loading />
                  )}
                </div>

              </div>

            </div>
          )
        }

      </div>
    </div>
  )
}

export default NavBar