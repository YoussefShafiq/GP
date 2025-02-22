import { Clock3, Loader2Icon, MessageSquareMore, Paperclip, Send, Smile, User, Users, X, MoreVertical, Copy, Trash } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChatContext } from '../../context/ChatContext';
import Pusher from 'pusher-js';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import EmojiPicker from 'emoji-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainChat() {
    const { selectedChat } = useContext(ChatContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sendingMessages, setSendingMessages] = useState({});
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [files, setFiles] = useState([]); // State for multiple file attachments
    const [activeMessageId, setActiveMessageId] = useState(null); // Track which message's menu is open
    const token = localStorage.getItem('userToken');

    // Ref for detecting clicks outside the menu
    const menuRef = useRef(null);

    // Handle click outside the menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMessageId(null); // Close the menu
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Get team details function
    function getChatDetails() {
        return axios.get(`https://brainmate.fly.dev/api/v1/projects/teams/${selectedChat.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // Get team details query
    let { data: chatData, isLoading: isChatDataLoading, error: ChatDataError } = useQuery({
        queryKey: ['chatDetails', selectedChat?.id],
        queryFn: getChatDetails,
        enabled: !!selectedChat,
    });

    const chatContainerRef = useRef(null);
    const emojiPickerRef = useRef(null);

    // Create a ref to store the latest selectedChat value
    const selectedChatRef = useRef(selectedChat);

    // Update the ref whenever selectedChat changes
    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

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
        console.log('selected chat use effect', selectedChat);

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

        // Listen for new messages
        channel.bind('new-chat-message', (newMessage) => {
            console.log('New message received:', newMessage);

            // Check if the message belongs to the currently selected chat
            if (newMessage.team_id === selectedChatRef.current.id && newMessage.sender_id !== profileData?.data?.data.user.id) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setTimeout(scrollToBottom, 100); // Scroll to bottom when new message arrives
            }
        });

        // Listen for deleted messages
        channel.bind('message-deleted', (deletedMessage) => {
            console.log('Message deleted:', deletedMessage);

            // Remove the deleted message from the UI
            setMessages((prevMessages) =>
                prevMessages.filter((msg) => msg.id !== deletedMessage.id)
            );
        });

        return () => {
            pusher.unsubscribe(`team.${selectedChat.id}`);
        };
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    // Handle file removal
    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    // Handle sending a new message
    const handleSendMessage = async () => {
        if (!newMessage.trim() && files.length === 0) return;

        setTimeout(scrollToBottom, 100); // Scroll to bottom when new message arrives

        const tempMessageId = Date.now(); // Temporary ID for the message
        const tempMessage = {
            id: tempMessageId,
            message: newMessage,
            sender_id: profileData?.data?.data.user.id,
            created_at: new Date().toISOString(),
            sender: profileData?.data?.data.user,
            media: files.map((file) => file.name),
        };

        // Add the message to the sending state
        setSendingMessages((prev) => ({ ...prev, [tempMessageId]: true }));

        // Add the message to the messages list
        setMessages((prevMessages) => [...prevMessages, tempMessage]);

        // Clear the input and files
        setNewMessage('');
        setFiles([]);

        try {
            const formData = new FormData();
            formData.append('message', newMessage);
            formData.append('team_id', selectedChat.id);
            formData.append('type', files.length > 0 ? 'file' : 'text');
            files.forEach((file) => {
                formData.append('media[]', file); // Append each file
            });

            const response = await axios.post(
                'https://brainmate.fly.dev/api/v1/chat/send',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                // Remove the temporary message and add the real one
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === tempMessageId ? response.data.data : msg
                    )
                );
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Optionally, you can mark the message as failed
        } finally {
            // Remove the message from the sending state
            setSendingMessages((prev) => {
                const updated = { ...prev };
                delete updated[tempMessageId];
                return updated;
            });
        }
    };

    // Handle infinite scroll to load older messages
    const handleScroll = (e) => {
        if (e.target.scrollTop === 0 && currentPage < totalPages && !loading) {
            const targetDistance = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight;

            setCurrentPage((prevPage) => {
                fetchMessages(prevPage + 1);
                return prevPage + 1;
            });

            setTimeout(() => {
                e.target.scrollTop = e.target.scrollHeight - targetDistance - 558;
            }, 1000); // Maintain scroll position
        }
    };

    // Handle emoji selection
    const handleEmojiClick = (emojiObject) => {
        setNewMessage((prevMessage) => prevMessage + emojiObject.emoji); // Append the selected emoji to the message
    };

    // Handle copy message
    const handleCopyMessage = (message) => {
        navigator.clipboard.writeText(message);
        toast.success('Copied to clipboard', {
            duration: 2000,
            position: 'bottom-right',
        });
        setActiveMessageId(null); // Close the menu
    };

    // Handle delete message
    const handleDeleteMessage = async (messageId) => {
        // Optimistically remove the message from the UI
        setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== messageId)
        );

        // Close the menu after deletion
        setActiveMessageId(null);

        try {
            // Send the delete request to the server
            const response = await axios.delete(
                `https://brainmate.fly.dev/api/v1/chat/messages/${messageId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                toast.success('Message deleted', {
                    duration: 2000,
                    position: 'bottom-right',
                    icon: <Trash color='#f05252' />
                });
            } else {
                // If the server request fails, revert the optimistic update
                setMessages((prevMessages) => [...prevMessages, messages.find((msg) => msg.id === messageId)]);
                toast.error('Failed to delete message', {
                    duration: 2000,
                    position: 'bottom-right',
                });
            }
        } catch (error) {
            console.error('Error deleting message:', error);

            // Revert the optimistic update if the request fails
            setMessages((prevMessages) => [...prevMessages, messages.find((msg) => msg.id === messageId)]);
            toast.error('Failed to delete message', {
                duration: 2000,
                position: 'bottom-right',
            });
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

    const isMessageDeletable = (messageTimestamp) => {
        const messageTime = new Date(messageTimestamp).getTime(); // Convert message timestamp to milliseconds
        const currentTime = new Date().getTime(); // Get current time in milliseconds
        const timeDifferenceInMinutes = (currentTime - messageTime) / (1000 * 60); // Convert difference to minutes

        return timeDifferenceInMinutes <= 10; // Return true if the difference is <= 10 minutes
    };

    return (
        <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center bg-white rounded-t-lg">
                <div className="rounded-full p-1 bg-gray-100 text-light text-center">
                    <FontAwesomeIcon icon={faPeopleGroup} className='text-xl' />
                </div>
                <div className="ml-3 w-full">
                    <div className="font-semibold gap-3 flex justify-between items-center">
                        {isChatDataLoading ? (
                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        ) : (
                            <div>{selectedChat?.name} <span className='text-xs font-light text-gray-500' >({selectedChat?.project.name})</span></div>
                        )}
                        {loading && <div className="md:flex w-fit hidden text-blue-500"><Loader2Icon className='animate-spin' /></div>}
                    </div>
                    <div className="text-sm text-gray-500">
                        {isChatDataLoading ? (
                            <div className="h-3 bg-gray-200 rounded w-48 mt-1 animate-pulse"></div>
                        ) : (
                            (() => {
                                // Combine all member names into a single string
                                const allNames = chatData?.data?.data?.team?.all_members
                                    ?.map((member) => member.name)
                                    .join(', ');

                                return allNames?.length > 80
                                    ? allNames.slice(0, 80) + '...'
                                    : allNames;
                            })()
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-scroll bg-chat-light bg-opacity-10" onScroll={handleScroll}>
                {messages.map((message) => (
                    <div
                        key={message?.id}
                        className={`flex items-start mb-4 ${message?.sender_id === profileData?.data?.data.user.id ? 'justify-end' : ''
                            }`}
                    >
                        {message?.sender_id !== profileData?.data?.data.user.id && (
                            <div
                                className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                style={{ backgroundColor: message?.sender?.color }}
                            >
                                {message?.sender?.name[0]}
                            </div>
                        )}
                        <div
                            className={`ml-3 p-3 rounded-lg shadow-md max-w-[70%] relative ${message?.sender_id === profileData?.data?.data.user.id ? 'bg-light text-white' : 'bg-white'
                                }`}
                        >


                            {/* Menu with Copy and Delete buttons */}
                            <AnimatePresence>
                                {activeMessageId === message.id && (
                                    <motion.div
                                        ref={menuRef}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute bottom-10 right-0 bg-white rounded-lg shadow-md p-2 z-10"
                                    >
                                        <button
                                            className="flex items-center gap-2 p-2 hover:bg-gray-100 text-dark w-full rounded-lg"
                                            onClick={() => handleCopyMessage(message.message)}
                                        >
                                            <Copy size={16} />
                                            <span>Copy</span>
                                        </button>
                                        {message.sender_id === profileData?.data?.data.user.id && isMessageDeletable(message.created_at) && (
                                            <button
                                                className="flex items-center gap-2 p-2 hover:bg-gray-100 w-full rounded-lg text-red-500"
                                                onClick={() => handleDeleteMessage(message.id)}
                                            >
                                                <Trash size={16} />
                                                <span>Delete</span>
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="text-sm font-semibold">{message?.sender_id !== profileData?.data?.data.user.id ? message?.sender?.name : ''}</div>
                            <div className="text-sm">
                                {message?.message?.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </div>
                            {message?.media && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {message.media.map((media, index) => (
                                        <a
                                            key={index}
                                            href={media.url} // Assuming the API returns a URL for the media
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            {media.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <div
                                    className={`text-xs mt-1 ${message?.sender_id === profileData?.data?.data.user.id ? 'text-gray-200' : 'text-gray-500'}`}
                                >
                                    {new Date(message?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                {sendingMessages[message.id] && (
                                    <div className="ml-2">
                                        <Clock3 size={14} />
                                    </div>
                                )}
                                {/* Three dots button */}
                                <button
                                    className={`p-2 pe-0  ${message?.sender_id === profileData?.data?.data.user.id ? 'text-white' : 'text-dark'} rounded-full`}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent event bubbling
                                        setActiveMessageId(message.id === activeMessageId ? null : message.id); // Toggle menu
                                    }}
                                >
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                {/* File Previews */}
                {files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {files.map((file, index) => (
                            <div key={index} className="relative">
                                {file.type.startsWith('image/') ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
                                        <Paperclip size={20} />
                                    </div>
                                )}
                                <button
                                    onClick={() => handleRemoveFile(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <textarea
                        placeholder="Type a message..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-light focus:border-light duration-300 resize-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault(); // Prevent default behavior (new line)
                                handleSendMessage(); // Send the message
                            }
                            // Shift + Enter will create a new line (default behavior)
                        }}
                        rows={1} // Start with one row
                        style={{ minHeight: '40px', maxHeight: '120px', overflowY: 'auto' }} // Adjust height dynamically
                    />
                    <button
                        className="p-2 text-gray-500 hover:text-light transition-all"
                        onClick={() => setShowEmojiPicker((prev) => !prev)} // Toggle emoji picker visibility
                    >
                        <Smile size={20} />
                    </button>
                    <label className="p-2 text-gray-500 hover:text-light transition-all cursor-pointer">
                        <Paperclip size={20} />
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            multiple // Allow multiple file selection
                        />
                    </label>
                    <button className="p-2 bg-light text-white rounded-lg hover:bg-darkblue transition-all" onClick={handleSendMessage}>
                        <Send size={20} />
                    </button>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-16 right-4">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                )}
            </div>
        </>
    );
}