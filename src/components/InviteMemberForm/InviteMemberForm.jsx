import React from 'react';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InviteMemberForm = ({ isOpen, onClose, selectedTeam }) => {
    const token = localStorage.getItem('userToken');

    const inviteValidationSchema = object({
        email: string().email('Invalid email').required('Email is required'),
        role_id: string().required('Role is required'),
    });

    const inviteFormik = useFormik({
        initialValues: {
            email: '',
            role_id: '',
        },
        validationSchema: inviteValidationSchema,
        onSubmit: async (values, formikHelpers) => {
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
                formikHelpers.resetForm();
                onClose();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error sending invitation', {
                    duration: 3000,
                    position: 'bottom-right',
                });
            }
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
                        className="bg-white rounded-lg shadow-lg border p-6 w-5/6 md:w-1/3 relative max-h-[95vh] overflow-y-auto"
                        initial={{ y: 0, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>

                        <form onSubmit={inviteFormik.handleSubmit} className="w-full mt-5">
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
    );
};

export default InviteMemberForm;