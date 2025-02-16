import { Search, Users } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import MainChat from '../../components/MainChat/MainChat';
import { ChatContext } from '../../context/ChatContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Pusher from 'pusher-js';

export default function Chat() {
    const { selectedChat, setselectedChat } = useContext(ChatContext);
    const [filteredChats, setfilteredChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
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

    // Fetch chat teams
    const { data, isLoading } = useQuery({
        queryKey: ['chatTeams'],
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/chat/teams`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        onSuccess: (data) => {
            const sortedChats = sortChatsByLastMessage(data.data.data.teams);
            setfilteredChats(sortedChats);
        },
    });

    // Filter chats based on search query
    useEffect(() => {
        if (data?.data?.data.teams) {
            const filtered = data.data.data.teams.filter((team) =>
                team.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const sortedChats = sortChatsByLastMessage(filtered);
            setfilteredChats(sortedChats);
        }
    }, [searchQuery, data]);

    // Initialize Pusher for real-time updates
    useEffect(() => {
        const pusher = new Pusher('d42fd688ba933368ee26', { cluster: 'mt1', forceTLS: true });
        console.log("Pusher initialized"); // Debugging

        const channel = pusher.subscribe('last-message-updates');
        console.log("Subscribed to last-message-updates channel"); // Debugging

        // Listen for last message updates
        channel.bind('last-message-updated', (newMessage) => {
            console.log('Last message updated:', newMessage); // Debugging

            setfilteredChats((prevChats) => {
                const updatedChats = prevChats.map((team) =>
                    team.id === newMessage.team_id
                        ? { ...team, last_message: newMessage.last_message }
                        : team
                );
                return sortChatsByLastMessage(updatedChats);
            });
        });

        // Cleanup
        return () => {
            pusher.unsubscribe('last-message-updates');
            console.log("Pusher unsubscribed"); // Debugging
        };
    }, []);

    // Utility function to sort chats by last message timestamp
    const isValidDate = (dateString) => {
        return !isNaN(new Date(dateString).getTime());
    };

    const sortChatsByLastMessage = (chats) => {
        return chats.sort((a, b) => {
            const timestampA = a.last_message && isValidDate(a.last_message.timestamp)
                ? new Date(a.last_message.timestamp).getTime()
                : 0;
            const timestampB = b.last_message && isValidDate(b.last_message.timestamp)
                ? new Date(b.last_message.timestamp).getTime()
                : 0;
            console.log("Sorting:", timestampA, timestampB); // Debugging
            return timestampB - timestampA; // Sort in descending order (newest first)
        });
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    console.log("Filtered Chats:", filteredChats); // Debugging
    console.log("Selected Chat:", selectedChat); // Debugging

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
                            id="chatSearch"
                            onChange={handleSearchChange}
                            type="text"
                            placeholder="Search..."
                            className="p-2 ps-10 border border-gray-300 rounded-lg w-full focus:ring-light duration-300 focus-within:border-light"
                        />
                    </div>

                    {/* Chat List */}
                    <div className="flex flex-col mt-2">
                        {!isLoading && <>
                            {filteredChats.map((team) => (
                                <div
                                    key={team.id}
                                    onClick={() => setselectedChat(team)}
                                    className={`flex items-center p-4 border-b border-light bg-darkblue bg-opacity-5 hover:bg-gray-100 cursor-pointer transition-all duration-200 ${selectedChat?.id === team?.id ? 'bg-gray-100 bg-opacity-95' : ''} `}
                                >
                                    <div className="rounded-full p-1 bg-gray-100 text-light text-center">
                                        <Users size={30} fill="#00adb5" />
                                    </div>
                                    <div className="flex flex-col ml-3 flex-grow">
                                        <div className="flex justify-between items-center">
                                            <div className="font-semibold">{team?.name} <span className='text-xs font-light text-gray-500' >({team?.project.name})</span> </div>
                                            <div className="text-sm text-gray-500">
                                                {team?.last_message?.timestamp
                                                    ? new Date(team.last_message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                    : ''
                                                }
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {team?.last_message?.message
                                                ? `${team.last_message.sender?.name?.split(' ')[0]}: ${team.last_message.message.substring(0, 25)}${team.last_message.message.length > 25 ? '...' : ''}`
                                                : 'Enter to start chat'
                                            }
                                        </div>
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