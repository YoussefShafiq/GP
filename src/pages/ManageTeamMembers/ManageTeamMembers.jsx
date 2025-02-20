import React, { useContext, useState } from 'react';
import { TeamsContext } from '../../context/TeamsContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash2, Loader2Icon, ChevronRight } from 'lucide-react';
import { projectContext } from '../../context/ProjectsContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

const ManageTeamMembers = () => {
    let { selectedProject, setselectedProject } = useContext(projectContext);
    let { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const token = localStorage.getItem('userToken');
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [updatingRole, setUpdatingRole] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false); // State for showing the confirmation popup
    const [memberToDelete, setMemberToDelete] = useState(null); // State to store the member ID to delete

    // Fetch team members
    const { data: teamMembers, isLoading, isError, isRefetching } = useQuery({
        queryKey: ['teamMembers', selectedTeam?.id],
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        enabled: !!selectedTeam,
    });

    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role }) => {
            setUpdatingRole(userId);
            const response = await axios.put(
                `https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}/change-role`,
                { user_id: userId, role_id: `${role}` },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response; // Storing response
        },
        onSuccess: (response) => {
            toast.success(response.data.message, {
                duration: 2000,
                position: 'bottom-right',
            });
            console.log("Update Response:", response.data); // Logging response
            queryClient.invalidateQueries(['teamMembers', selectedTeam?.id]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'failed to change user role', {
                duration: 3000,
                position: 'bottom-right',
            });
        },
        onSettled: () => {
            setUpdatingRole(null);
        },
    });

    const removeMemberMutation = useMutation({
        mutationFn: async (userId) => {
            const response = await axios.delete(
                `https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}/remove-user`,
                {
                    data: { user_id: userId }, // Moved user_id to `data`
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response;
        },
        onSuccess: (response) => {
            toast.success(response.data.message, {
                duration: 2000,
                position: 'bottom-right',
            });
            console.log("Remove Response:", response.data); // Logging response
            queryClient.invalidateQueries(['teamMembers', selectedTeam?.id]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'failed to remove user', {
                duration: 3000,
                position: 'bottom-right',
            });
        },
    });

    const handleRoleChange = (userId, newRole) => {
        updateRoleMutation.mutate({ userId, role: newRole });
    };

    const handleRemoveMember = (userId) => {
        setMemberToDelete(userId); // Set the member ID to delete
        setShowConfirmation(true); // Show the confirmation popup
    };

    const confirmDelete = () => {
        if (memberToDelete) {
            removeMemberMutation.mutate(memberToDelete); // Delete the member
        }
        setShowConfirmation(false); // Hide the confirmation popup
        setMemberToDelete(null); // Reset the member ID
    };

    const cancelDelete = () => {
        setShowConfirmation(false); // Hide the confirmation popup
        setMemberToDelete(null); // Reset the member ID
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2Icon className="animate-spin" /></div>;
    }

    if (isError) {
        return <div className="text-red-500 text-center">Failed to load team members.</div>;
    }

    return (
        <div className="p-5">
            {/* Confirmation Popup with Framer Motion */}
            <AnimatePresence>
                {showConfirmation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white p-6 rounded-lg shadow-lg"
                        >
                            <h2 className="text-lg font-semibold mb-4">Are you sure you want to remove this member?</h2>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className='text-gray-400 flex items-center h-6 px-5 mb-5 border-b p-5'>
                <div onClick={() => { navigate('/project'); setselectedTeam(null) }} className="pe-1 cursor-pointer">{selectedProject?.name}</div>
                <ChevronRight strokeWidth={0.7} /><div onClick={() => { navigate('/project/team'); }} className="px-1 cursor-pointer">{selectedTeam?.name}</div>
                <ChevronRight strokeWidth={0.7} /><div onClick={() => { navigate('/project/team/manage-members'); }} className="px-1 cursor-pointer text-black">Manage Team Members</div>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teamMembers?.data?.data.users.map((member) => (
                        <tr key={member.id} className="border-b">
                            <td className="p-3">{member.name}</td>
                            <td className="p-3">{member.email}</td>
                            <td className="p-3">
                                <select
                                    value={member.role === 'member' ? '3' : member.role === 'leader' ? '2' : '3'}
                                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg"
                                    disabled={updatingRole === member.id} // Disable when updating
                                >
                                    <option value="2">Leader</option>
                                    <option value="3">Member</option>
                                </select>
                            </td>
                            <td className="p-3">
                                <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageTeamMembers;