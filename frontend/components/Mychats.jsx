import React, { useEffect, useState } from 'react'
import { useChat } from '../context/Context'
import axios from '../src/utils/axios'
import { useNavigate } from 'react-router-dom'

function Mychats() {

  const { user, selectedChat, chats, setSelectedChat, setChats , setShowChatbox } = useChat()
  const [logedUser, setLoggedUser] = useState(null)

  const [showGroupModal, setShowGroupModal] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchUsers, setSearchUsers] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [openChatBox, setOpenChatBox] = useState(false)

  useEffect(() => {
    setLoggedUser(JSON.parse(sessionStorage.getItem("user")))

    const fetchChats = async () => {
      const token = sessionStorage.getItem("token")
     
      try {
        const res = await axios.get("/chat", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setChats(res.data)
        console.log(res.data)

      } catch (err) {
        console.log("err", err)
      }
    }

    fetchChats()
  }, [])

  const getSender = (users) => {
    if (!user?._id) return null;

    return users.find((u) => u?._id !== user._id) || null;
  };


  useEffect(() => {

    const fetchSearchResults = async () => {

      if (searchUsers.trim() === "") {
        setSearchResult([])
        return
      }
      setLoadingSearch(true)

      const token = sessionStorage.getItem("token")
      try {
        const re = await axios.get(`/user/all?search=${searchUsers}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(re)
        setSearchResult(re.data)
        setLoadingSearch(false)
        console.log(selectedUsers)
      } catch (err) {
        console.log(err)
        setLoadingSearch(false)
      }
    }

    setTimeout(() => {
      fetchSearchResults()
    }, 1000);

  }, [searchUsers])

  const createGroupChat = async () => {

    if (!groupName || selectedUsers.length === 0) {
      alert("Please fill all the fields")
      return
    }

    const token = sessionStorage.getItem("token")

    try {

      const res = await axios.post("/chat/group", {
        name: groupName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      setChats((prevChats) => [res.data, ...prevChats])
      setGroupName("")
      setSelectedUsers([])
      setSearchUsers("")
      setSearchResult([])
      setShowGroupModal(false)

    } catch (err) {
      console.log(err)
    }

  }

  const selectionHandler =(chat)=>{
    setSelectedChat(chat)
    setShowChatbox(true)
  }




  return (
    <div className="mychats h-full md:w-1/4 w-full border-r bg-white flex flex-col">

      {/* Header */}
      <div className="p-4 font-semibold text-lg border-b border-gray-300 flex items-center justify-between">
        <h1>My Chats</h1>
        <button onClick={() => setShowGroupModal(true)} className="p-3 text-blue-500 hover:text-blue-700 rounded-xl hover:bg-blue-50">GroupChat +</button>
      </div>

      {chats.length === 0 ?
        (
          <div className='flex-1 flex items-center justify-center'>
            <p className='text-gray-500 text-sm text-center mt-4'>No chats available. Start a new chat!</p>
          </div>
        )
        :
        (
          <div className='flex-1 overflow-y-auto pt-2'>
            {chats.map((chat) => {

              const otherUser = getSender(chat.users)
              return (
                <div key={chat._id} onClick={() => selectionHandler(chat)} className={`p-4 cursor-pointer flex items-center rounded-xl gap-3 ${selectedChat?._id === chat._id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                  <div className=" rounded-xl w-10 h-10 overflow-hidden" >
                    <img className='w-full h-full object-cover rounded-xl' src={otherUser?.pic} alt="" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{chat.isGroupChat ? chat.chatName : getSender(chat.users)?.name || "Unknown User"} </p>
                    <p className="text-sm text-gray-500">{chat.isGroupChat ? `${chat.users.length} members` : chat.latestMessage?.content || "No messages yet"} </p>


                  </div>

                </div>

              )
            })}
          </div>

        )

      }


      {showGroupModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


          <div className="bg-white w-1/2 min-h-[40vh] rounded-2xl shadow-xl p-6 space-y-4 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center ">
              <h2 className="text-lg font-semibold">Create Group Chat</h2>
              <button
                onClick={() => setShowGroupModal(false)}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>



            <div className="w-full h-full w- items-top justify-center">

              {/* Selected Users */}

              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <span key={user._id} className=" bg-blue-100 px-2 py-1 rounded-lg">
                      <span key={user._id} className="text-sm text-gray-600 mr-2">{user.name}</span>
                      <button onClick={() => setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id))} className="text-gray-500 text-sm hover:text-red-500">
                        ✕
                      </button>
                    </span>
                  ))}
                  <button onClick={() => setSelectedUsers([])} className="text-gray-500 hover:text-red-500">
                    Clear
                  </button>
                </div>

              )}

              <div className="flex flex-col gap-4 mt-4">
                {/* Group Name */}
                <div>
                  <label className="text-sm text-gray-600">Group Name</label>
                  <input
                    required
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="w-full mt-1 p-2 border border-gray-300 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Users */}
                <div>
                  <label className="text-sm text-gray-600">Add Users</label>
                  <input
                    required
                    type="text"
                    value={searchUsers}
                    onChange={(e) => setSearchUsers(e.target.value)}
                    placeholder="Enter user name or email"
                    className="w-full mt-1 p-2 border border-gray-300 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                {/* Create Button */}
                <button
                  onClick={createGroupChat}
                  className="w-full h-fit bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl transition-all duration-300"
                >
                  Create Group
                </button>

              </div>


            </div>

            <div>
              {loadingSearch ? (
                <p className="text-gray-500 text-sm">Searching...</p>
              ) : (
                searchResult.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img className='w-8 h-8 rounded-full' src={user.pic} alt="" />
                      <span>{user.name}</span>
                    </div>
                    <button onClick={() => setSelectedUsers((prev) => {
                      if (prev.some(u => u._id === user._id)) {
                        return prev.filter(u => u._id !== user._id);
                      } else {
                        return [...prev, user];
                      }
                    })} className="text-blue-500 hover:text-blue-700">
                      {selectedUsers.some(u => u._id === user._id) ? "Remove" : "Add"}
                    </button>
                  </div>
                ))
              )}

            </div>



          </div>
        </div>
      )}


    </div>
  )
}

export default Mychats