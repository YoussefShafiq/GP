import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { TeamsContext } from '../../context/TeamsContext';

export default function UpdateTeamForm({ isOpen, onClose }) {
    const { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const [updating, setupdating] = useState(false)
    const token = localStorage.getItem('userToken');

    // Update a team
    async function updateTeam(values, { resetForm }) {
        setupdating(true)
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
            setupdating(false)
            resetForm();
            onClose();
            setselectedTeam(response.data.data.team);
        } catch (error) {
            setupdating(false)
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

    // Reset form values when the update form is opened
    useEffect(() => {
        if (isOpen) {
            updateFormik.setValues({
                name: selectedTeam?.name || '',
            });
        }
    }, [isOpen, selectedTeam]);

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
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>

                        {/* Update Team Form */}
                        <form onSubmit={updateFormik.handleSubmit} className="w-full mt-5">
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
                                disabled={updating}
                            >
                                Update Team
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}