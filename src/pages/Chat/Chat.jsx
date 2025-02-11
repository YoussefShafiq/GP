import { Search, Users } from 'lucide-react';
import React, { useContext, useEffect } from 'react';
import MainChat from '../../components/MainChat/MainChat';
import { ChatContext } from '../../context/ChatContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Chat() {
    const { selectedChat, setselectedChat } = useContext(ChatContext);
    const token = localStorage.getItem('userToken');

    // Handle ESC key press
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setselectedChat(null);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [setselectedChat]);


    const { data, isLoading } = useQuery({
        queryKey: 'chat teams',
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/chat/teams`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
    })

    console.log(data?.data.data.teams);


    return (
        <>
            <div className="p-2 bg-blueblack h-[calc(100vh-3rem)] flex gap-1">
                {/* Sidebar for Chat List */}
                <div className="bg-base w-[30%] flex flex-col overflow-y-scroll shadow-inner h-full justify-start rounded-l-lg">
                    {/* Header */}
                    <div className="p-5 pb-2 text-xl capitalize font-semibold text-blueblack">Chats</div>

                    {/* Search Bar */}
                    <div className="flex relative items-center gap-2 p-2 px-5">
                        <Search className="text-light absolute left-7 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="p-2 ps-10 border border-gray-300 rounded-lg w-full focus:ring-light duration-300 focus-within:border-light"
                        />
                    </div>

                    {/* Chat List */}
                    <div className="flex flex-col mt-2">

                        {!isLoading && <>
                            {data?.data.data.teams.map((team) => (
                                <div onClick={() => setselectedChat(team)}
                                    className={`flex items-center p-4 border-b border-light bg-darkblue bg-opacity-5 hover:bg-gray-100 cursor-pointer transition-all duration-200 ${selectedChat?.id === team?.id ? 'bg-white bg-opacity-100' : ''} `}>
                                    <div className="rounded-full p-1 bg-gray-100 text-light text-center">
                                        <Users size={30} fill="#00adb5" />
                                    </div>
                                    <div className="flex flex-col ml-3 flex-grow">
                                        <div className="flex justify-between items-center">
                                            <div className="font-semibold">{team?.name} <span className='text-xs font-light text-gray-500' >({team?.project.name})</span> </div>
                                            <div className="text-sm text-gray-500">02:23pm</div>
                                        </div>
                                        <div className="text-sm text-gray-500">Hey, are you available for a call?</div>
                                    </div>
                                </div>
                            ))}
                        </>}

                    </div>
                </div>

                {/* Main Chat Window */}
                <div className="bg-gray-50 w-[70%] rounded-r-lg flex flex-col shadow-inner">
                    <MainChat />
                </div>
            </div>
        </>
    );
}
