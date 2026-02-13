import axios from "../src/utils/axios"
import { useChat } from "../context/Context"


function SearchList({ searchResult, setClick }) {

    const { user, setSelectedChat, setChats, chats } = useChat()

    const accessChat = async (userId) => {
        const token = sessionStorage.getItem("token");

        try {
            const res = await axios.post(
                "/chat",
                { userId },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setChats((prevChats) => {
                const exists = prevChats.find((c) => c._id === res.data._id);
                if (exists) return prevChats;
                return [res.data, ...prevChats];
            });

            setSelectedChat(res.data);

        } catch (err) {
            console.log(err);
        }
    };


    return (
        <div className='flex flex-col items-center justify-center gap-2 '>
            {searchResult.length === 0 ? (
                <p className='text-gray-500 text-sm'>No search results</p>
            ) : (
                searchResult.map((user) =>
                (
                    <button onClick={() => { accessChat(user._id); setClick(false) }} key={user._id} className="p-2 w-full block border-b border-gray-200 hover:bg-blue-200 cursor-pointer rounded-lg transition-colors duration-300 bg-gray-100">
                        <div className="flex items-center gap-2">
                            <img className='w-8 h-8 rounded-full inline-block mr-2' src={user.pic} alt="" />
                            <span>{user.name}</span>
                        </div>
                    </button>)
                )
            )}
        </div>
    )
}

export default SearchList