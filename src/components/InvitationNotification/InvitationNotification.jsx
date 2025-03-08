import React, { useState } from 'react';
import { Check, X, Trash2, Eye } from 'lucide-react';
import { Tooltip } from '@heroui/tooltip';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

const InvitationNotification = ({ notification, markAsRead, deleteNotification }) => {
    const token = localStorage.getItem('userToken'); // User token from localStorage
    const invitationToken = notification.metadata.token; // Token from the notification metadata
    const [sending, setsending] = useState(false)

    // Fetch projects
    function getProjects() {
        return axios.get('https://brainmate.fly.dev/api/v1/projects/assigned', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    let { refetch: refetchProjects } = useQuery({
        queryKey: ['allprojects'],
        queryFn: getProjects,
        keepPreviousData: true,
    });

    // Handle accepting the invitation
    const handleAccept = async () => {
        setsending(true)
        try {
            const response = await axios.post(
                'https://brainmate.fly.dev/api/v1/projects/teams/accept',
                { token: invitationToken },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success('Invitation accepted successfully!', {
                    duration: 3000,
                    position: 'bottom-right',
                });
                markAsRead(notification.id); // Mark the notification as read
                notification.type = 'info'
                notification.read = 1
                refetchProjects()
            }
            setsending(false)

        } catch (error) {
            setsending(false)
            toast.error(error?.response?.data?.message || 'Failed to accept invitation', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    };

    // Handle rejecting the invitation
    const handleReject = async () => {
        setsending(true)
        try {
            const response = await axios.post(
                'https://brainmate.fly.dev/api/v1/projects/teams/reject',
                { token: invitationToken },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success('Invitation rejected successfully!', {
                    duration: 3000,
                    position: 'bottom-right',
                });
                markAsRead(notification.id); // Mark the notification as read
                notification.type = 'info'
                notification.read = 1
            }
            setsending(false)
        } catch (error) {
            setsending(false)
            toast.error(error?.response?.data?.message || 'Failed to reject invitation', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    };

    return (
        <div
            className={`p-4 cursor-pointer border-b border-gray-200 ${notification.read === 0
                ? 'bg-blue-100 hover:bg-blue-100 dark:hover:bg-white dark:hover:bg-opacity-5 dark:bg-dark1'
                : 'bg-white dark:hover:bg-white dark:hover:bg-opacity-10 dark:bg-dark2 hover:bg-gray-50'
                } flex flex-col justify-between text-start`}
        >
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {notification.read === 0 && (
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
                    {/* Accept Button */}
                    <Tooltip delay={300} content="Accept Invitation" closeDelay={0}>
                        <button
                            disabled={sending}
                            onClick={(e) => {
                                handleAccept();
                                e.stopPropagation();
                            }}
                            className="text-xs text-green-500 hover:text-green-700"
                        >
                            <Check size={20} />
                        </button>
                    </Tooltip>

                    {/* Reject Button */}
                    <Tooltip delay={300} content="Reject Invitation" closeDelay={0}>
                        <button
                            disabled={sending}
                            onClick={(e) => {
                                handleReject();
                                e.stopPropagation();
                            }}
                            className="text-xs text-red-500 hover:text-red-700"
                        >
                            <X size={20} />
                        </button>
                    </Tooltip>

                    {/* Delete Button */}
                    {notification.type === 'info' && <Tooltip delay={300} content="Delete Notification" closeDelay={0}>
                        <button
                            onClick={(e) => {
                                deleteNotification(notification.id);
                                e.stopPropagation();
                            }}
                            className="text-xs text-red-500 hover:text-red-700"
                        >
                            <Trash2 size={20} />
                        </button>
                    </Tooltip>}
                </div>
            </div>
        </div>
    );
};

export default InvitationNotification;