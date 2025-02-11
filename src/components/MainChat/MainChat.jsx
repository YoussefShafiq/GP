import { MessageSquareMore, Paperclip, Send, Smile, User, Users } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChatContext } from '../../context/ChatContext';
import Pusher from 'pusher-js';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export default function MainChat() {
    const { selectedChat } = useContext(ChatContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = localStorage.getItem('userToken');

    const chatContainerRef = useRef(null); // Reference for chat container

    // Fetch profile data
    function getProfileData() {
        return axios.get('https://brainmate.fly.dev/api/v1/profile', {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    let { data: profileData } = useQuery({
        queryKey: ['ProfileData'],
        queryFn: getProfileData,
    });

    // Scroll to bottom function
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    // Fetch messages when selectedChat changes
    useEffect(() => {
        if (selectedChat) {
            setMessages([]); // Clear messages when chat changes
            setCurrentPage(1);
            fetchMessages(1, true); // Fetch new chat messages and scroll to bottom
            initializePusher();
        }
    }, [selectedChat]);

    // Fetch messages from API
    const fetchMessages = async (page, shouldScrollToBottom = false) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://brainmate.fly.dev/api/v1/chat/messages/${selectedChat.id}?page=${page}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            let fetchedMessages = response.data.data.data.reverse(); // Reverse the order of messages

            if (page === 1) {
                setMessages(fetchedMessages);
            } else {
                setMessages((prevMessages) => [...fetchedMessages, ...prevMessages]);
            }

            setTotalPages(response.data.data.last_page);

            if (shouldScrollToBottom) {
                setTimeout(scrollToBottom, 100);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initialize Pusher for real-time updates
    const initializePusher = () => {
        const pusher = new Pusher('d42fd688ba933368ee26', { cluster: 'mt1', forceTLS: true });
        const channel = pusher.subscribe(`team.${selectedChat.id}`);

        channel.bind('new-chat-message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setTimeout(scrollToBottom, 100); // Scroll to bottom when new message arrives
        });

        return () => {
            pusher.unsubscribe(`team.${selectedChat.id}`);
        };
    };

    // Handle sending a new message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(
                'https://brainmate.fly.dev/api/v1/chat/send',
                {
                    message: newMessage,
                    team_id: selectedChat.id,
                    type: 'text',
                    media: null,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setNewMessage(''); // Clear input
                setTimeout(scrollToBottom, 100); // Ensure scrolling after sending message
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Handle infinite scroll to load older messages
    const handleScroll = (e) => {
        if (e.target.scrollTop === 0 && currentPage < totalPages && !loading) {
            const previousScrollHeight = e.target.scrollHeight; // Store scroll height before loading

            setCurrentPage((prevPage) => {
                fetchMessages(prevPage + 1);
                return prevPage + 1;
            });

            setTimeout(() => {
                e.target.scrollTop = e.target.scrollHeight - previousScrollHeight;
            }, 100); // Maintain scroll position
        }
    };

    if (!selectedChat) {
        return (
            <div className="h-full flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                    <MessageSquareMore size={35} className="text-light" />
                    <h2 className="capitalize">Please select chat</h2>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center bg-white rounded-t-lg">
                <div className="rounded-full p-1 bg-gray-100 text-light text-center">
                    <Users size={30} fill="#00adb5" />
                </div>
                <div className="ml-3">
                    <div className="font-semibold">{selectedChat?.name}</div>
                    <div className="text-sm text-gray-500">Online</div>
                </div>
            </div>

            {/* Chat Messages */}
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-scroll" onScroll={handleScroll}>
                {messages.map((message) => (
                    <div
                        key={message?.id}
                        className={`flex items-start mb-4 ${message?.sender_id === profileData?.data?.data.user.id ? 'justify-end' : ''
                            }`}
                    >
                        {message?.sender_id !== profileData?.data?.data.user.id && (
                            <div className="rounded-full p-1 bg-gray-100 text-light text-center">
                                <User size={24} fill="#00adb5" />
                            </div>
                        )}
                        <div
                            className={`ml-3 p-3 rounded-lg shadow-sm max-w-[70%] ${message?.sender_id === profileData?.data?.data.user.id ? 'bg-light text-white' : 'bg-white'
                                }`}
                        >
                            <div className="text-sm font-semibold">{message.sender?.name}</div>
                            <div className="text-sm">{message?.message}</div>
                            <div
                                className={`text-xs mt-1 ${message?.sender_id === profileData?.data?.data.user.id ? 'text-gray-200' : 'text-gray-500'
                                    }`}
                            >
                                {new Date(message?.created_at).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-light focus:border-light duration-300"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button className="p-2 text-gray-500 hover:text-light transition-all">
                        <Smile size={20} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-light transition-all">
                        <Paperclip size={20} />
                    </button>
                    <button className="p-2 bg-light text-white rounded-lg hover:bg-darkblue transition-all" onClick={handleSendMessage}>
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </>
    );
}
