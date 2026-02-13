import { useEffect } from 'react'
import { useChat } from '../context/Context'
import Loading from './Loading'
import { useRef } from 'react'

function SingleChat({ messages, loading, isTyping }) {

    const { user, selectedChat } = useChat()
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [messages]);



    return (
        <div className='flex flex-col h-full overflow-y-auto bg-gray-100 p-2'>


            <div className='message-area flex-1 bg-white overflow-y-auto rounded-lg p-5 space-y-3'>

                {loading ? (
                    <Loading />
                ) : messages.length === 0 ? (
                    <p className='text-gray-500 text-sm text-center'>
                        No messages yet. Start the conversation!
                    </p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className='flex flex-col items-end'>
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg 
                                             ${msg.sender._id === user._id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-800'}`}
                                >
                                    {msg.content}

                                </div>

                                {selectedChat.isGroupChat && (
                                    <span className='text-xs text-gray-500  mt-1'>
                                        {msg.sender.name}
                                    </span>
                                )}

                            </div>


                        </div>

                    ))
                )}
                {isTyping && (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse">
                            <img src={messages[messages.length - 1]?.sender.pic} alt={messages[messages.length - 1]?.sender.name} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <span className="text-sm text-gray-500">Typing...</span>
                    </div>
                )}
                <div ref={messagesEndRef}></div>
            </div>


        </div>
    )
}

export default SingleChat
