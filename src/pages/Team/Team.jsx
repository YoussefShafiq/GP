import React, { useContext, useEffect, useRef, useState } from 'react';
import { projectContext } from '../../context/ProjectsContext';
import { MousePointerClick, Plus, X, Trash, Edit, FolderMinus, Trash2, Copy, UserPlus, UserRoundPlus, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { TeamsContext } from '../../context/TeamsContext';

export default function Team() {
    let { selectedProject, setselectedProject } = useContext(projectContext);
    let { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const [deleteTeamForm, setDeleteTeamForm] = useState(false);
    const [leaveTeamForm, setLeaveTeamForm] = useState(false);
    const [updateTeamForm, setUpdateTeamForm] = useState(false);
    const [inviteMemberForm, setInviteMemberForm] = useState(false);
    const token = localStorage.getItem('userToken');
    const projectFormRef = useRef(null);
    const navigate = useNavigate();


    // Close the form when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (projectFormRef.current && !projectFormRef.current.contains(event.target)) {
                setDeleteTeamForm(false);
                setUpdateTeamForm(false);
                setInviteMemberForm(false);
                setLeaveTeamForm(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    // leave a team
    async function leaveTeam(values, { resetForm }) {
        if (values.teamName !== selectedTeam.name) {
            toast.error('Team name does not match', {
                duration: 3000,
                position: 'bottom-right',
            });
            return;
        }

        try {
            await axios.post(
                `https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}/leave`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Team leaved successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            resetForm();
            setLeaveTeamForm(false);
            setselectedTeam(null);
            navigate('/project');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error leaving team', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }

    // Form validation schema for delete team
    const leaveValidationSchema = object({
        teamName: string()
            .required('Team name is required')
            .oneOf([selectedTeam?.name], 'Team name does not match'),
    });

    // Formik form handling for delete team
    const leaveFormik = useFormik({
        initialValues: {
            teamName: '',
        },
        validationSchema: leaveValidationSchema,
        onSubmit: (values, formikHelpers) => {
            leaveTeam(values, formikHelpers);
        },
    });

    // Delete a team
    async function deleteTeam(values, { resetForm }) {
        if (values.teamName !== selectedTeam.name) {
            toast.error('Team name does not match', {
                duration: 3000,
                position: 'bottom-right',
            });
            return;
        }

        try {
            await axios.delete(
                `https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Team deleted successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            resetForm();
            setDeleteTeamForm(false);
            setselectedTeam(null);
            navigate('/project');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting team', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }

    // Form validation schema for delete team
    const deleteValidationSchema = object({
        teamName: string()
            .required('Team name is required')
            .oneOf([selectedTeam?.name], 'Team name does not match'),
    });

    // Formik form handling for delete team
    const deleteFormik = useFormik({
        initialValues: {
            teamName: '',
        },
        validationSchema: deleteValidationSchema,
        onSubmit: (values, formikHelpers) => {
            deleteTeam(values, formikHelpers);
        },
    });

    // Update a team
    async function updateTeam(values, { resetForm }) {
        try {
            const response = await axios.put(
                `https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Team updated successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            resetForm();
            setUpdateTeamForm(false);
            setselectedTeam(response.data.data.team);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating team', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }

    // Form validation schema for update team
    const updateValidationSchema = object({
        name: string().required('Team name is required'),
    });

    // Formik form handling for update team
    const updateFormik = useFormik({
        initialValues: {
            name: selectedTeam?.name || '',
        },
        validationSchema: updateValidationSchema,
        onSubmit: (values, formikHelpers) => {
            updateTeam(values, formikHelpers);
        },
    });

    // Invite a member to the team
    async function inviteMember(values, { resetForm }) {
        try {
            await axios.post(
                `https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}/invite`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Invitation sent successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            resetForm();
            setInviteMemberForm(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending invitation', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }

    // Form validation schema for invite member
    const inviteValidationSchema = object({
        email: string().email('Invalid email').required('Email is required'),
        role_id: string().required('Role is required'),
    });

    // Formik form handling for invite member
    const inviteFormik = useFormik({
        initialValues: {
            email: '',
            role_id: '',
        },
        validationSchema: inviteValidationSchema,
        onSubmit: (values, formikHelpers) => {
            inviteMember(values, formikHelpers);
        },
    });

    // Reset form values when the update form is opened
    useEffect(() => {
        if (updateTeamForm) {
            updateFormik.setValues({
                name: selectedTeam?.name || '',
            });
        }
    }, [updateTeamForm, selectedTeam]);

    if (!selectedTeam) {
        return (
            <div className="h-[calc(100vh-48px)] flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                    <MousePointerClick size={35} className='text-light' />
                    <h2 className='capitalize'>Please select team first</h2>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* leave team form */}
            <AnimatePresence>
                {leaveTeamForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-15 z-50"
                        onClick={() => setLeaveTeamForm(false)}
                    >
                        <motion.div
                            className="bg-white rounded-lg shadow-lg border p-6 w-5/6 md:w-1/3 relative max-h-[95vh] overflow-y-auto"
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            ref={projectFormRef}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setLeaveTeamForm(false)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>

                            {/* leave Team Form */}
                            <form
                                onSubmit={leaveFormik.handleSubmit}
                                className="w-full mt-5"
                            >
                                <div className="relative z-0 w-full group mb-4">
                                    <input
                                        type="text"
                                        name="teamName"
                                        id="teamName"
                                        onBlur={leaveFormik.handleBlur}
                                        onChange={leaveFormik.handleChange}
                                        value={leaveFormik.values.teamName}
                                        className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="teamName"
                                        className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                    >
                                        To confirm, type "{selectedTeam.name}"
                                    </label>
                                    {leaveFormik.errors.teamName && leaveFormik.touched.teamName && (
                                        <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                            {leaveFormik.errors.teamName}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white text-lg font-bold hover:shadow-md"
                                    style={{ transition: 'background-position 0.4s ease', backgroundSize: '150%' }}
                                    onMouseEnter={(e) => (e.target.style.backgroundPosition = 'right')}
                                    onMouseLeave={(e) => (e.target.style.backgroundPosition = 'left')}
                                >
                                    leave Team
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete team form */}
            <AnimatePresence>
                {deleteTeamForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-15 z-50"
                        onClick={() => setDeleteTeamForm(false)}
                    >
                        <motion.div
                            className="bg-white rounded-lg shadow-lg border p-6 w-5/6 md:w-1/3 relative max-h-[95vh] overflow-y-auto"
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            ref={projectFormRef}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setDeleteTeamForm(false)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>

                            {/* Delete Team Form */}
                            <form
                                onSubmit={deleteFormik.handleSubmit}
                                className="w-full mt-5"
                            >
                                <div className="relative z-0 w-full group mb-4">
                                    <input
                                        type="text"
                                        name="teamName"
                                        id="teamName"
                                        onBlur={deleteFormik.handleBlur}
                                        onChange={deleteFormik.handleChange}
                                        value={deleteFormik.values.teamName}
                                        className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="teamName"
                                        className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                    >
                                        To confirm, type "{selectedTeam.name}"
                                    </label>
                                    {deleteFormik.errors.teamName && deleteFormik.touched.teamName && (
                                        <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                            {deleteFormik.errors.teamName}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white text-lg font-bold hover:shadow-md"
                                    style={{ transition: 'background-position 0.4s ease', backgroundSize: '150%' }}
                                    onMouseEnter={(e) => (e.target.style.backgroundPosition = 'right')}
                                    onMouseLeave={(e) => (e.target.style.backgroundPosition = 'left')}
                                >
                                    Delete Team
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Update team form */}
            <AnimatePresence>
                {updateTeamForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-15 z-50"
                        onClick={() => setUpdateTeamForm(false)}
                    >
                        <motion.div
                            className="bg-white rounded-lg shadow-lg border p-6 w-5/6 md:w-1/3 relative max-h-[95vh] overflow-y-auto"
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            ref={projectFormRef}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setUpdateTeamForm(false)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>

                            {/* Update Team Form */}
                            <form
                                onSubmit={updateFormik.handleSubmit}
                                className="w-full mt-5"
                            >
                                {/* Team Name Input */}
                                <div className="relative z-0 w-full group mb-4">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        onBlur={updateFormik.handleBlur}
                                        onChange={updateFormik.handleChange}
                                        value={updateFormik.values.name}
                                        className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="name"
                                        className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                    >
                                        Team Name
                                    </label>
                                    {updateFormik.errors.name && updateFormik.touched.name && (
                                        <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                            {updateFormik.errors.name}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-darkblue via-blueblack to-blueblack text-white text-lg font-bold hover:shadow-md"
                                    style={{ transition: 'background-position 0.4s ease', backgroundSize: '150%' }}
                                    onMouseEnter={(e) => (e.target.style.backgroundPosition = 'right')}
                                    onMouseLeave={(e) => (e.target.style.backgroundPosition = 'left')}
                                >
                                    Update Team
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Invite member form */}
            <AnimatePresence>
                {inviteMemberForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-15 z-50"
                        onClick={() => setInviteMemberForm(false)}
                    >
                        <motion.div
                            className="bg-white rounded-lg shadow-lg border p-6 w-5/6 md:w-1/3 relative max-h-[95vh] overflow-y-auto"
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            ref={projectFormRef}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setInviteMemberForm(false)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>

                            {/* Invite Member Form */}
                            <form
                                onSubmit={inviteFormik.handleSubmit}
                                className="w-full mt-5"
                            >
                                {/* Email Input */}
                                <div className="relative z-0 w-full group mb-4">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        onBlur={inviteFormik.handleBlur}
                                        onChange={inviteFormik.handleChange}
                                        value={inviteFormik.values.email}
                                        className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                    >
                                        Email
                                    </label>
                                    {inviteFormik.errors.email && inviteFormik.touched.email && (
                                        <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                            {inviteFormik.errors.email}
                                        </div>
                                    )}
                                </div>

                                {/* Role Selection */}
                                <div className="relative z-0 w-full group mb-4">
                                    <select
                                        name="role_id"
                                        id="role_id"
                                        onBlur={inviteFormik.handleBlur}
                                        onChange={inviteFormik.handleChange}
                                        value={inviteFormik.values.role_id}
                                        className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                    >
                                        <option value="" disabled>Select Role</option>
                                        <option value="2">Leader</option>
                                        <option value="3">Member</option>
                                    </select>
                                    <label
                                        htmlFor="role_id"
                                        className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                    >
                                        Role
                                    </label>
                                    {inviteFormik.errors.role_id && inviteFormik.touched.role_id && (
                                        <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                            {inviteFormik.errors.role_id}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-darkblue via-blueblack to-blueblack text-white text-lg font-bold hover:shadow-md"
                                    style={{ transition: 'background-position 0.4s ease', backgroundSize: '150%' }}
                                    onMouseEnter={(e) => (e.target.style.backgroundPosition = 'right')}
                                    onMouseLeave={(e) => (e.target.style.backgroundPosition = 'left')}
                                >
                                    Invite Member
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Loading Skeleton */}
            {isTeamLoading ? (
                <div className="p-5">
                    <div className="flex justify-between items-center mb-5">
                        <div className='text-light font-semibold flex items-center'>
                            <div onClick={() => { navigate('/project'); setselectedTeam(null) }} className="pe-1 cursor-pointer">{selectedProject?.name}</div> / <div className="ps-1 cursor-pointer">{selectedTeam?.name}</div>
                        </div>
                        {/* Buttons Skeleton */}
                        <div className="flex gap-2">
                            <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse"></div>
                            <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-5">
                    <div className="flex justify-between items-center mb-5 h-9">
                        {/* Path */}
                        <div className='text-light font-semibold flex items-center'>
                            <div onClick={() => { navigate('/project'); setselectedTeam(null) }} className="pe-1 cursor-pointer">{selectedProject?.name}</div> / <div className="ps-1 cursor-pointer">{selectedTeam?.name}</div>
                        </div>
                        <div className="flex gap-2">
                            {teamData?.data.data.team.role !== 'member' && (<>
                                {/* Team Code with Copy Icon */}
                                <div
                                    className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                                    onClick={() => {
                                        navigator.clipboard.writeText(teamData?.data.data.team.team_code);
                                        toast.success('added to clipboard', {
                                            duration: 2000,
                                            position: 'bottom-right',
                                        });
                                    }}
                                >
                                    <span className="text-black">{teamData?.data.data.team.team_code}</span>
                                    <Copy size={18} className="text-gray-500" />
                                </div>
                                <button onClick={() => setUpdateTeamForm(true)} className="rounded-full bg-white text-yellow-400 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Edit size={25} /></button>
                                <button onClick={() => setDeleteTeamForm(true)} className="rounded-full bg-white text-red-600 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Trash2 size={25} /></button>
                                <button onClick={() => setInviteMemberForm(true)} className="rounded-full bg-white text-red-600 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><UserRoundPlus size={25} /></button>
                            </>)}
                            <button onClick={() => setLeaveTeamForm(true)} className="rounded-full bg-white text-red-600 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><LogOut size={25} /></button>
                        </div>
                    </div>
                </div >
            )
            }
        </>
    );
}