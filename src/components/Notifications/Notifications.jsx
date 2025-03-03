import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';
import { Bell, Eye, Trash2 } from 'lucide-react';
import { Tooltip } from '@heroui/tooltip';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const token = localStorage.getItem('userToken'); // Get the token from localStorage
    const dropdownRef = useRef(null); // Ref for the dropdown

    // Axios instance with base URL and headers
    const api = axios.create({
        baseURL: 'https://brainmate.fly.dev/api/v1',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Fetch notifications from the API
    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            if (response.data.success) {
                setNotifications(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Mark a notification as read
    const markAsRead = async (notificationId) => {
        try {
            const response = await api.post(`/notifications/${notificationId}/read`);
            if (response.data.success) {
                setNotifications(notifications.map(notification =>
                    notification.id === notificationId ? { ...notification, read: 1 } : notification
                ));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Delete a notification
    const deleteNotification = async (notificationId) => {
        try {
            const response = await api.delete(`/notifications/${notificationId}`);
            if (response.data.success) {
                setNotifications(notifications.filter(notification => notification.id !== notificationId));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    // // Initialize Pusher for real-time updates
    // useEffect(() => {
    //     const pusher = new Pusher('d42fd688ba933368ee26', {
    //         cluster: 'mt1',
    //         encrypted: true,
    //     });

    //     const channel = pusher.subscribe('private-user.YOUR_USER_ID'); // Replace with dynamic user ID
    //     channel.bind('notification.sent', (newNotification) => {
    //         setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    //     });

    //     return () => {
    //         pusher.unsubscribe('private-user.YOUR_USER_ID');
    //     };
    // }, []);

    // Fetch notifications on component mount
    useEffect(() => {
        fetchNotifications();
    }, []);

    // Handle click outside to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Attach the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-full hover:bg-blueblack focus:outline-none relative transition-all"
            >
                <span className="text-xl text-yellow-300"><Bell /></span>
                {notifications.filter(notification => !notification.read).length > 0 && (
                    <span className="absolute flex justify-center items-center top-0 right-0 bg-red-500 aspect-square text-white text-sm rounded-full min-h-5">
                        {notifications.filter(notification => !notification.read).length}
                    </span>
                )}
                {isOpen && <div class="absolute top-9 right-2 -translate-y-1 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-white"></div>}
            </button>

            {/* Notification Dropdown */}
            <div className={`absolute top-12 right-0 bg-white border-gray-200 rounded-lg shadow-lg w-60 md:w-80 ${isOpen ? 'h-96 border' : 'h-0'} overflow-y-auto border-t-0 transition-all`}>
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-200 ${notification.read === 0 ? 'bg-blue-100 hover:bg-blue-100' : 'bg-white hover:bg-gray-50'}  flex flex-col justify-between text-start`}
                    >
                        <div>
                            <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                        </div>
                        <div className="flex justify-between items-center space-x-2">
                            <small className="text-xs text-gray-500">
                                {new Date(notification.created_at).toLocaleString()}
                            </small>
                            <div className="flex justify-end gap-2">
                                {notification.read === 0 && (
                                    <Tooltip delay={300} content='mark as read' closeDelay={0}>
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="text-xs text-blue-500 hover:text-blue-700 "
                                        >
                                            <Eye size={20} />
                                        </button>
                                    </Tooltip>
                                )}
                                <Tooltip delay={300} content='delete notification' closeDelay={0}>
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="text-xs text-red-500 hover:text-red-700 "
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;