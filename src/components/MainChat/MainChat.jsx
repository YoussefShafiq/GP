import { MessageSquareMore, MousePointerClick, Paperclip, Send, Smile, User, Users } from 'lucide-react'
import React, { useContext, useEffect } from 'react'
import { ChatContext } from '../../context/ChatContext'

export default function MainChat() {
    const { selectedChat } = useContext(ChatContext)
    useEffect(() => {
        console.log(selectedChat);
    }, [selectedChat])

    if (!selectedChat) {
        return (
            <div className="h-full flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                    <MessageSquareMore size={35} className='text-light' />
                    <h2 className='capitalize'>Please select chat</h2>
                </div>
            </div>
        );
    }


    return <>
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center bg-white rounded-t-lg">
            <div className="rounded-full p-1 bg-gray-100 text-light text-center">
                <Users size={30} fill="#00adb5" />
            </div>
            <div className="ml-3">
                <div className="font-semibold">{selectedChat.name}</div>
                <div className="text-sm text-gray-500">Online</div>
            </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-scroll">
            {/* Incoming Message */}
            <div className="flex items-start mb-4">
                <div className="rounded-full p-1 bg-gray-100 text-light text-center">
                    <User size={24} fill="#00adb5" />
                </div>
                <div className="ml-3 bg-white p-3 rounded-lg shadow-sm max-w-[70%]">
                    <div className="text-sm font-semibold">Youssef Shafek</div>
                    <div className="text-sm">Hey, are you available for a call?</div>
                    <div className="text-xs text-gray-500 mt-1">02:23pm</div>
                </div>
            </div>

            {/* Outgoing Message */}
            <div className="flex items-start mb-4 justify-end">
                <div className="bg-light text-white p-3 rounded-lg shadow-sm max-w-[70%]">
                    <div className="text-sm">Yes, I'm available. Let's schedule it.</div>
                    <div className="text-xs text-gray-200 mt-1">02:24pm</div>
                </div>
            </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-light focus:border-light duration-300 "
                />
                <button className="p-2 text-gray-500 hover:text-light transition-all">
                    <Smile size={20} />
                </button>
                <button className="p-2 text-gray-500 hover:text-light transition-all">
                    <Paperclip size={20} />
                </button>
                <button className="p-2 bg-light text-white rounded-lg hover:bg-darkblue transition-all">
                    <Send size={20} />
                </button>
            </div>
        </div>
    </>
}
