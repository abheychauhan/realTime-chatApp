import React, { useState } from "react";
import { useChat } from "../context/Context";
import ChatDetailsModal from "./ChatDetailsModal";
import SingleChat from "./SingleChat";
import axios from "../src/utils/axios";
import { useEffect } from "react";
import { io } from "socket.io-client";

const ENDPOINT = "https://realtime-chatapp-799u.onrender.com"
var socket, selectedChatCompare;

function ChatBox() {
  const { selectedChat ,setSelectedChat, user, notifications, setNotifications , showChatbox ,setShowChatbox } = useChat();
  const [hover, setHover] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [newMessage, setNewMessage] = useState("")


  useEffect(() => {

    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    console.log("notifications", notifications)

  }, [notifications])


  useEffect(() => {
    const messageHandler = (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
         
        // Give notification
        if (!notifications.includes(newMessageRecieved)) {
          setNotifications((prev) => [...prev, newMessageRecieved]);
        }


      } else {
        setMessages(prev => [...prev, newMessageRecieved]);
      }
    };

    socket.on("message recieved", messageHandler);

    return () => {
      socket.off("message recieved", messageHandler);
    };
  }, []);


  useEffect(() => {

    const fetchMessages = async () => {

      if (!selectedChat) return

      try {
        setLoading(true)

        const res = await axios.get(`/message/${selectedChat._id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
        })

        setMessages(res.data)
        setLoading(false)
        socket.emit("join chat", selectedChat._id)

      } catch (err) {
        console.log("err", err)
        setLoading(false)
      }
    }

    fetchMessages()

    selectedChatCompare = selectedChat

  }, [selectedChat])



const sendMessage = async () => {
  if (!newMessage.trim()) return;

  socket.emit("stop typing", selectedChat._id);

  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.post(
      "/message",
      {
        content: newMessage,
        chatId: selectedChat._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    socket.emit("new message", res.data);
    setMessages((prev) => [...prev, res.data]);
    setNewMessage("");
  } catch (err) {
    console.log("Error sending message:", err);
  }
};

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
};



  if (!selectedChat) {
    return (
      <div className="chatbox h-full w-full hidden md:block text-gray-500 ">
         <h1 className="absolute top-1/2 left-1/2 "> Click on a chat to start messaging</h1>
         
      </div>
    );
  }

  const getSender = (users) => {
    return users.find((u) => u._id !== user?._id);
  };

  const otherUser = getSender(selectedChat.users);

  const typingHandler = (e) => {

    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handle=()=>{
    setSelectedChat(null)
    setShowChatbox(false)
  }

  return (
    <div className={`chatbox overflow-hidden w-full h-[100%] absolute  md:left-0 md:relative  flex-1 flex flex-col ${showChatbox ? "left-0" :"left-[-100%]"}`}>

      {/* Chat Header */}
      <div className="p-4 border-b border-gray-300 flex items-center  justify-between bg-white">
        <div className="flex items-center gap-3">
          <h1 onClick={handle}><i className="ri-arrow-left-line text-xl"></i></h1>
          <img
            src={selectedChat.isGroupChat ? selectedChat.groupPic : otherUser?.pic}
            className="w-10 h-10 rounded-full"
            alt=""
          />
          <h2 className="font-semibold text-lg">
            {selectedChat.isGroupChat ? selectedChat.chatName : otherUser?.name}
          </h2>
        </div>

        <div className="">
          <i
            onClick={() => setShowDetails(!showDetails)}
            className={`${hover ? "ri-eye-line" : "ri-eye-close-line"} block text-gray-500 text-xl transition-transform duration-200 cursor-pointer`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          ></i>
        </div>
      </div>

      {/* Messages Area */}
      <SingleChat loading={loading} messages={messages} setMessages={setMessages} isTyping={isTyping} />

      {/* Input Area */}
      <div className="p-4 border-t border-gray-300 bg-white flex gap-2">

        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={typingHandler}
          onKeyDown={
                        window.innerWidth >= 850 ? handleKeyDown : undefined
                    }

          className="flex-1 border rounded-lg p-2 outline-none border-gray-300 focus:border-blue-500"
        />
        <button onClick={sendMessage} className="bg-blue-500 active:bg-blue-600 text-white px-4 rounded-lg">
          Send
        </button>
      </div>



      {showDetails && (
        <ChatDetailsModal
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          selectedChat={selectedChat}
          otherUser={otherUser}
        />
      )}

    </div>
  );
}

export default ChatBox;
