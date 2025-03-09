import React, { useContext, useState } from 'react';
import { TeamsContext } from '../../context/TeamsContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash2, Loader2Icon, ChevronRight, MousePointerClick } from 'lucide-react';
import { projectContext } from '../../context/ProjectsContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ManageTeamMembers = () => {
    const { selectedProject, setselectedProject } = useContext(projectContext);
    const { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const token = localStorage.getItem('userToken');
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [updatingRole, setUpdatingRole] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false); // State for showing the confirmation popup
    const [memberToDelete, setMemberToDelete] = useState(null); // State to store the member ID to delete
    const [showManagerConfirmation, setShowManagerConfirmation] = useState(false); // State for showing the manager confirmation popup
    const [newManagerEmail, setNewManagerEmail] = useState(''); // State to store the new manager's email
    const [selectedUserId, setSelectedUserId] = useState(null); // State to store the selected user ID for role change
    const [newManagerName, setNewManagerName] = useState(''); // State to store the new manager's name
    const [selectedMemberEmail, setSelectedMemberEmail] = useState(''); // State to store the selected member's email

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

    // Get team details function
    function getTeamDetails() {
        return axios.get(`https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // Get team details query
    let { data: teamData, isLoading: isTeamLoading, error: teamError } = useQuery({
        queryKey: ['teamDetails', selectedTeam?.id],
        queryFn: getTeamDetails,
        enabled: !!selectedTeam,
    });

    // Fetch current user's email
    const getProfileData = () => {
        return axios.get('https://brainmate.fly.dev/api/v1/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };

    const { data: profileData } = useQuery({
        queryKey: ['ProfileData'],
        queryFn: getProfileData,
    });

    const currentUserEmail = profileData?.data?.data?.user?.email; // Current user's email

    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role, email }) => {
            setUpdatingRole(userId);
            const response = await axios.put(
                `https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}/change-role`,
                { user_id: userId, role_id: `${role}`, email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response;
        },
        onSuccess: (response) => {
            if (response.data.message === 'User role updated to manager successfully.') {
                navigate('/')
            }
            toast.success(response.data.message, {
                duration: 2000,
                position: 'bottom-right',
            });
            console.log("Update Response:", response.data);
            queryClient.invalidateQueries(['teamMembers', selectedTeam?.id]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to change user role', {
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
                    data: { user_id: userId },
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
            console.log("Remove Response:", response.data);
            queryClient.invalidateQueries(['teamMembers', selectedTeam?.id]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to remove user', {
                duration: 3000,
                position: 'bottom-right',
            });
        },
    });

    const handleRoleChange = (userId, newRole) => {
        if (newRole === '1') { // '1' is the value for Manager
            const selectedMember = teamMembers?.data?.data.users.find((member) => member.id === userId);
            if (selectedMember) {
                setSelectedUserId(userId);
                setSelectedMemberEmail(selectedMember.email); // Set the selected member's email
                setShowManagerConfirmation(true);
            }
        } else {
            updateRoleMutation.mutate({ userId, role: newRole });
        }
    };

    const confirmManagerChange = () => {
        if (newManagerEmail.trim() === '') {
            toast.error('Please enter a valid email address.', {
                duration: 3000,
                position: 'bottom-right',
            });
            return;
        }

        // Check if the entered email matches the selected member's email
        if (newManagerEmail !== selectedMemberEmail) {
            toast.error('The entered email does not match the selected member\'s email.', {
                duration: 3000,
                position: 'bottom-right',
            });
            return;
        }

        // Check if the entered email matches the current user's email
        if (newManagerEmail === currentUserEmail) {
            toast.error('You cannot assign yourself as the manager.', {
                duration: 3000,
                position: 'bottom-right',
            });
            return;
        }

        // Find the new manager's name from the team members list
        const newManager = teamMembers?.data?.data.users.find((member) => member.email === newManagerEmail);
        if (!newManager) {
            toast.error('The entered email does not belong to any team member.', {
                duration: 3000,
                position: 'bottom-right',
            });
            return;
        }

        // Set the new manager's name
        setNewManagerName(newManager.name);

        // Confirm the role change
        updateRoleMutation.mutate({ userId: selectedUserId, role: '1', email: newManagerEmail });
        setShowManagerConfirmation(false);
        setNewManagerEmail('');
        setSelectedUserId(null);
        setSelectedMemberEmail('');
    };

    const handleRemoveMember = (userId) => {
        setMemberToDelete(userId);
        setShowConfirmation(true);
    };

    const confirmDelete = () => {
        if (memberToDelete) {
            removeMemberMutation.mutate(memberToDelete);
        }
        setShowConfirmation(false);
        setMemberToDelete(null);
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
        setMemberToDelete(null);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2Icon className="animate-spin" /></div>;
    }

    if (isError) {
        return <div className="p-5">
            {/* Breadcrumb Navigation */}
            <div className='text-gray-400 flex items-center h-6 px-5 mb-5 border-b p-5'>
                <div onClick={() => { navigate('/project'); setselectedTeam(null); }} className="pe-1 cursor-pointer">{selectedProject?.name}</div>
                <ChevronRight strokeWidth={0.7} />
                <div onClick={() => { navigate('/project/team'); }} className="px-1 cursor-pointer">{selectedTeam?.name}</div>
                <ChevronRight strokeWidth={0.7} />
                <div className="px-1 cursor-pointer text-black">Manage Team Members</div>
            </div>

            <div className="text-black mt-5 text-center">Failed to load team members.</div>
        </div>
    }

    if (!selectedTeam) {
        return (
            <div className="h-[calc(100vh-48px)] flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                    <MousePointerClick size={35} className='text-light' />
                    <h2 className='capitalize'>please select team first</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="p-5">
            {/* Confirmation Popup for Deleting Member */}
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
                            className="bg-white dark:bg-dark1 dark:border-gray-300 dark:border p-6 rounded-lg shadow-lg"
                        >
                            <h2 className="text-lg font-semibold mb-4">Are you sure you want to remove this member?</h2>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 dark:bg-dark2 bg-gray-300 rounded-lg hover:bg-gray-400"
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

            {/* Confirmation Popup for Manager Role Change */}
            <AnimatePresence>
                {showManagerConfirmation && (
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
                            className="bg-white dark:bg-dark1 dark:border-gray-300 dark:border p-6 rounded-lg shadow-lg"
                        >
                            <h2 className="text-lg font-semibold mb-4">Confirm Manager Change</h2>
                            <p className="mb-4">Please enter the email of the new manager:</p>
                            <input
                                type="email"
                                value={newManagerEmail}
                                onChange={(e) => setNewManagerEmail(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:bg-dark2 dark:text-white dark:focus:ring-0 dark:focus:border-light transition-all rounded-lg mb-4"
                                placeholder="Enter new manager's email"
                            />
                            {newManagerName && (
                                <p className="mb-4">
                                    The new manager will be: <strong>{newManagerName}</strong> ({newManagerEmail}).
                                </p>
                            )}
                            <div className="flex justify-end gap-3 ">
                                <button
                                    onClick={() => {
                                        setShowManagerConfirmation(false);
                                        setNewManagerEmail('');
                                        setSelectedUserId(null);
                                        setSelectedMemberEmail('');
                                        setNewManagerName('');
                                    }}
                                    className="px-4 py-2 bg-gray-200 dark:bg-dark2 rounded-lg hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmManagerChange}
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-darkblue via-blueblack to-blueblack text-white hover:shadow-md transition-all"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Breadcrumb Navigation */}
            <div className='text-gray-400 flex items-center px-5 mb-5 border-b p-5 flex-wrap'>
                <div onClick={() => { navigate('/project'); setselectedTeam(null); }} className="pe-1 cursor-pointer">{selectedProject?.name}</div>
                <ChevronRight strokeWidth={0.7} />
                <div onClick={() => { navigate(`/project/team`); }} className="px-1 cursor-pointer">{selectedTeam?.name}</div>
                <ChevronRight strokeWidth={0.7} />
                <div onClick={() => { navigate('/project/team/manage-members'); }} className="px-1 cursor-pointer text-black dark:text-white">Manage Team Members</div>
            </div>

            <div className="overflow-x-auto scrollbar-hide">
                {/* Team Members Table */}
                <table className="w-full border-collapse  ">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-dark1 dark:bg-opacity-50 dark:text-gray-400">
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembers?.data?.data.users.map((member) => (
                            <tr key={member.id} className="border-b dark:bg-dark1 dark:hover:bg-opacity-80">
                                <td className="p-3">{member.id}</td>
                                <td className="p-3">{member.name}</td>
                                <td className="p-3">{member.email}</td>
                                <td className="p-3">
                                    <select
                                        value={member.role === 'member' ? '3' : member.role === 'leader' ? '2' : '1'}
                                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                        className="p-2 border dark:bg-dark1 text-gray-900 dark:text-white border-gray-300 rounded-lg"
                                        disabled={updatingRole === member.id || teamData?.data?.data.team.role !== 'manager'}
                                    >
                                        <option value="1">Manager</option>
                                        <option value="2">Leader</option>
                                        <option value="3">Member</option>
                                    </select>
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="text-red-600 hover:text-red-800 disabled:opacity-30"
                                        disabled={teamData?.data?.data.team.role !== 'manager'}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageTeamMembers;