import React, { useState } from "react";
import { useChat } from "../context/Context";
import axios from "../src/utils/axios";


const ChatDetailsModal = ({ showDetails, setShowDetails, selectedChat, otherUser }) => {
  if (!showDetails) return null;

  const { user , setChats } = useChat();
  console.log("user in modal:", user);
  const [profileFullView, setProfileFullView] = useState(false);
  const [imgsrc, setImgSrc] = useState("");
  const [loadingImg, setLoadingImg] = useState(false);
  const [showfullImg, setShowFullImg] = useState(false);

  const picFullView = () => {
    setProfileFullView(true);
    setLoadingImg(true);
    const img = new Image();
    img.src = otherUser?.pic;
    img.onload = () => {
      setImgSrc(otherUser?.pic);
      setLoadingImg(false); 
    };

  };

  const showFullImg = () => {
    setShowFullImg(true);
      const img = new Image();
      img.src = otherUser?.pic;
      img.onload = () => {
        window.open(otherUser?.pic, "_blank");
        setShowFullImg(false); 
      };
  }


 const handleLeaveGroup = async () => {
  try {
    if (selectedChat.groupAdmin._id === user._id) {
      // DELETE group
      const res = await axios.delete(`/chat/delete`, {
        data: { chatId: selectedChat._id },
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });

      if (res.status === 200) {
        alert("Group chat deleted successfully.");
        // Remove chat from frontend state
        setChats(prevChats => prevChats.filter(c => c._id !== selectedChat._id));
        setShowDetails(false);
      } else {
        throw new Error("Failed to delete group chat");
      }

    } else if (selectedChat.isGroupChat) {
      // Leave group
      const res = await axios.put(`/chat/remove`, {
        chatId: selectedChat._id,
        userId: user._id,
      }, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });

      if (res.status === 200) {
        alert("You have left the group chat.");
        // Remove chat from frontend state
        setChats(prevChats => prevChats.filter(c => c._id !== selectedChat._id));
        setShowDetails(false);
      } else {
        throw new Error("Failed to leave group chat");
      }
    }
  } catch (error) {
    console.error("Error deleting/leaving chat:", error);
    alert("Operation failed.");
  }
};

  return (
    <>
      {/* Overlay */}
      <div
        className="absolute inset-0  w-full h-full z-20 transition-opacity duration-300"
        onClick={() => setShowDetails(false)}
      ></div>

      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-80 max-w-sm bg-white border border-gray-300 rounded-lg shadow-xl p-6
                      transition-transform duration-300 ease-out scale-95 animate-modalShow">
        
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
          onClick={() => setShowDetails(false)}
        >
            <i className="ri-close-large-line text-xl"></i>
        </button>

        {/* Title */}
        <h3 className="text-lg text-gray-800 font-semibold mb-4">Chat Details</h3>

        {/* Content */}
        {selectedChat.isGroupChat ? (
          <div className="space-y-2 w-full text-gray-700">
            <p><span className="font-medium text-gray-700">Group Name:</span> {selectedChat.chatName} <br /> <span className="text-sm  text-blue-400">({selectedChat.users.length} members)</span></p>

            <p>
                <span className="font-medium text-gray-700">Admin: {selectedChat.groupAdmin?.name || "Unknown Admin"}</span>
                
            </p>
            <p>
              <span className="font-medium text-gray-700">Members:</span>{" "}
              {selectedChat.users.map(u => u.name).join(", ")}
            </p>

            <button
              onClick={() => {
                handleLeaveGroup();
              }}
            
            className="mt-2 bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
              {user._id === selectedChat.groupAdmin?._id ? "Delete Group" : "Leave Group"}
            </button>
          </div>
        ) : (
          <div className="space-y-2 text-gray-700">
            <img onClick={picFullView} src={otherUser?.pic} alt="User Avatar" className="w-12 h-12 my-2 rounded-full object-cover m-auto" />
            <p><span className="font-medium text-gray-700">Name:</span> {otherUser?.name}</p>
            <p><span className="font-medium text-gray-700">Email:</span> {otherUser?.email}</p>

            {loadingImg && <p className="text-sm text-gray-500">Loading full image...</p>}
            {profileFullView && imgsrc && (
              <div onClick={() => setProfileFullView(false) } className="fixed w-[100vw] h-[100vh] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50">
                <img onClick={showFullImg} src={imgsrc} alt="Full Size Avatar" className="max-w-full max-h-full rounded-lg shadow-lg" />
              </div>
            )}          
          </div>
        )}
      </div>
    </>
  );
};

export default ChatDetailsModal;
