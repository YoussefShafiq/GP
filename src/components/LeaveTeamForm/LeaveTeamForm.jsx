import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { TeamsContext } from '../../context/TeamsContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export default function LeaveTeamForm({ isOpen, onClose }) {
    const { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const [leavingTeam, setleavingTeam] = useState(false)
    const token = localStorage.getItem('userToken');
    const navigate = useNavigate();

    // Fetch projects
    function getProjects() {
        return axios.get('https://brainmate-new.fly.dev/api/v1/projects/assigned', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    let { refetch } = useQuery({
        queryKey: ['allprojects'],
        queryFn: getProjects,
        keepPreviousData: true,
    });

    // Leave a team
    async function leaveTeam(values, { resetForm }) {
        if (values.teamName !== selectedTeam.name) {
            toast.error('Team name does not match', {
                duration: 3000,
                position: 'bottom-right',
            });
            return;
        }
        setleavingTeam(true)

        try {
            const response = await axios.post(
                `https://brainmate-new.fly.dev/api/v1/projects/teams/${selectedTeam.id}/leave`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setleavingTeam(false)
            toast.success('Team left successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            resetForm();
            onClose();
            setselectedTeam(null);
            console.log(response);
            refetch()
            if (response.data.data.still_in_project) {
                navigate('/project');
            } else {
                navigate('/');
            }
        } catch (error) {
            setleavingTeam(false)
            toast.error(error.response?.data?.message || 'Error leaving team', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }

    // Form validation schema for leave team
    const leaveValidationSchema = object({
        teamName: string()
            .required('Team name is required')
            .oneOf([selectedTeam?.name], 'Team name does not match'),
    });

    // Formik form handling for leave team
    const leaveFormik = useFormik({
        initialValues: {
            teamName: '',
        },
        validationSchema: leaveValidationSchema,
        onSubmit: (values, formikHelpers) => {
            leaveTeam(values, formikHelpers);
        },
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-15 z-50"
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white dark:bg-dark1 rounded-lg shadow-lg border p-6 w-5/6 md:w-1/3 relative max-h-[95vh] overflow-y-auto"
                        initial={{ y: 0, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>

                        {/* Leave Team Form */}
                        <form onSubmit={leaveFormik.handleSubmit} className="w-full mt-5">
                            <div className="relative z-0 w-full group mb-4">
                                <input
                                    type="text"
                                    name="teamName"
                                    id="teamName"
                                    onBlur={leaveFormik.handleBlur}
                                    onChange={leaveFormik.handleChange}
                                    value={leaveFormik.values.teamName}
                                    className="block py-2 w-full text-sm text-black dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="teamName"
                                    className="absolute text-sm text-gray-700 dark:text-gray-500 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
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
                                disabled={leavingTeam}
                            >
                                Leave Team
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}