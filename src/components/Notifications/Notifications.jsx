import React, { useState, useEffect, useRef, useContext } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';
import { Bell, Eye, Trash2 } from 'lucide-react';
import { Tooltip } from '@heroui/tooltip';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import notificationsound from '../../assets/Sounds/notification.mp3';
import { useNavigate } from 'react-router-dom';
import { TaskContext } from '../../context/TaskContext';
import InvitationNotification from '../InvitationNotification/InvitationNotification';
import { projectContext } from '../../context/ProjectsContext';
import { TeamsContext } from '../../context/TeamsContext';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [markingAllRead, setmarkingAllRead] = useState(false);
    let { selectedTask, setselectedTask } = useContext(TaskContext);
    let { selectedProject, setselectedProject } = useContext(projectContext);
    let { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const [isOpen, setIsOpen] = useState(false);
    const token = localStorage.getItem('userToken'); // Get the token from localStorage
    const dropdownRef = useRef(null); // Ref for the dropdown
    const navigate = useNavigate();

    // Fetch profile data
    const { data: profileData } = useQuery({
        queryKey: ['ProfileData'],
        queryFn: () =>
            axios.get('https://brainmate-new.fly.dev/api/v1/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
    });

    // Axios instance with base URL and headers
    const api = axios.create({
        baseURL: 'https://brainmate-new.fly.dev/api/v1',
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
                setNotifications((prevNotifications) =>
                    prevNotifications.map((notification) =>
                        notification.id === notificationId ? { ...notification, read: 1 } : notification
                    )
                );
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        setmarkingAllRead(true);
        try {
            const response = await api.post('/notifications/mark-all-as-read');
            if (response.data.success) {
                setNotifications((prevNotifications) =>
                    prevNotifications.map((notification) => ({
                        ...notification,
                        read: 1,
                    }))
                );
                toast.success('All notifications marked as read', {
                    duration: 3000,
                    position: 'bottom-right',
                });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message, {
                duration: 3000,
                position: 'bottom-right',
            });
        }
        setmarkingAllRead(false);
    };

    // Delete a notification
    const deleteNotification = async (notificationId) => {
        try {
            const response = await api.delete(`/notifications/${notificationId}`);
            if (response.data.success) {
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification.id !== notificationId)
                );
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    // Initialize Pusher for real-time updates
    useEffect(() => {
        if (profileData?.data.data.user.id) {
            const pusher = new Pusher('d42fd688ba933368ee26', {
                cluster: 'mt1',
                forceTLS: true,
            });

            const channel = pusher.subscribe(`user.${profileData?.data?.data?.user?.id}`);
            channel.bind('new-notification', (newNotification) => {
                const audio = new Audio(notificationsound);
                audio.play()
                    .then(() => console.log('Notification sound played successfully'))
                    .catch((error) => console.error('Error playing notification sound:', error));

                toast.success(newNotification.message.replace('_', ' '), {
                    duration: 3000,
                    position: 'bottom-right',
                    icon: <Bell color="#faca15" fill="#faca15" />,
                });

                setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
            });

            return () => {
                pusher.unsubscribe(`user.${profileData?.data?.data?.user?.id}`);
            };
        }
    }, [profileData?.data.data.user.id]);

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
        checkAtRiskTasks()
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    async function checkAtRiskTasks() {
        try {
            await axios.post('https://brainmate-new.fly.dev/api/v1/tasks/check-deadlines', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        } catch (error) {

        }
    }


    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-full hover:bg-blueblack focus:outline-none relative transition-all"
            >
                <span className="text-xl text-yellow-300"><Bell /></span>
                {notifications.filter((notification) => !notification.read).length > 0 && (
                    <span className="absolute flex justify-center items-center top-0 right-0 bg-red-500 aspect-square text-white text-sm rounded-full min-h-5">
                        {notifications.filter((notification) => !notification.read).length}
                    </span>
                )}
                {isOpen && (
                    <div className="absolute top-9 right-2 -translate-y-1 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-white"></div>
                )}
            </button>

            {/* Notification Dropdown */}
            <div
                className={`absolute top-12 right-0 bg-white dark:bg-dark2 border-gray-200 rounded-lg shadow-lg w-60 md:w-80 ${isOpen ? 'h-96 border' : 'h-0'
                    } flex flex-col-reverse overflow-hidden border-t-0 transition-all`}
            >
                {/* Mark All as Read Button */}
                {notifications.length > 0 && (
                    <div className="p-2 border-b border-gray-200">
                        <button
                            onClick={markAllAsRead}
                            className="w-full text-sm text-light hover:text-teal-700 text-center disabled:opacity-50"
                            disabled={markingAllRead}
                        >
                            Mark All as Read
                        </button>
                    </div>
                )}

                <div className="overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex justify-center items-center h-full capitalize text-black dark:text-white">
                            No notifications found
                        </div>
                    ) : (
                        notifications.map((notification) =>
                            notification.type === 'invitation' ? (
                                <InvitationNotification
                                    key={notification.id}
                                    notification={notification}
                                    markAsRead={markAsRead}
                                    deleteNotification={deleteNotification}
                                />
                            ) : (
                                <div
                                    key={notification.id}
                                    onClick={() => {
                                        if (notification?.metadata.project_id) {
                                            setselectedProject({ 'id': notification.metadata.projeect_id, 'name': notification.metadata.project_name })
                                            setselectedTeam({ 'id': notification.metadata.team_id, 'name': notification.metadata.team_name })
                                            navigate(`/project/team`);
                                            setIsOpen(!isOpen);
                                        } else if (notification?.metadata?.task_id) {
                                            navigate(`/task-details/${notification.metadata.task_id}`);
                                            setselectedTask({
                                                id: notification.metadata.task_id,
                                                team_id: notification.metadata.team_id,
                                            });
                                            setIsOpen(!isOpen);
                                        }
                                        markAsRead(notification.id);
                                    }}
                                    className={`p-4 cursor-pointer border-b border-gray-200 ${notification.read === 0
                                        ? 'bg-blue-100 hover:bg-blue-100 dark:hover:bg-white dark:hover:bg-opacity-5 dark:bg-dark1'
                                        : 'bg-white dark:hover:bg-white dark:hover:bg-opacity-10 dark:bg-dark2 hover:bg-gray-50'
                                        } flex flex-col justify-between text-start`}
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {notification.read == 0 && (
                                                <div className="h-2 w-2 bg-red-500 inline-block me-2 rounded-full"></div>
                                            )}
                                            {notification.message}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center space-x-2">
                                        <small className="text-xs text-gray-500">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </small>
                                        <div className="flex justify-end gap-2">
                                            {notification.read == 0 && (
                                                <Tooltip delay={300} content="mark as read" closeDelay={0}>
                                                    <button
                                                        onClick={(e) => {
                                                            markAsRead(notification.id);
                                                            e.stopPropagation();
                                                        }}
                                                        className="text-xs text-blue-500 hover:text-blue-700"
                                                    >
                                                        <Eye size={20} />
                                                    </button>
                                                </Tooltip>
                                            )}
                                            <Tooltip delay={300} content="delete notification" closeDelay={0}>
                                                <button
                                                    onClick={(e) => {
                                                        deleteNotification(notification.id);
                                                        e.stopPropagation();
                                                    }}
                                                    className="text-xs text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            )
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;