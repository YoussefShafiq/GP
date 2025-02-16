import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, XIcon, ChevronDown } from 'lucide-react';
import { useFormik } from 'formik';
import { object, string, date, array } from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddTaskForm = ({ isOpen, onClose, selectedTeam, token, teamMembers }) => {
    const [assignTobtn, setAssignTobtn] = useState(false);
    const [teamMembersState, setTeamMembersState] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([])

    // Form validation schema for add task
    const addTaskValidationSchema = object({
        name: string().required('Task name is required'),
        description: string().required('Description is required'),
        tags: string().required('tags is required'),
        priority: string().required('Priority is required'),
        deadline: date().required('Deadline is required'),
        members: array().min(1, 'At least one member is required'),
    });

    // Formik form handling for add task
    const addTaskFormik = useFormik({
        initialValues: {
            name: '',
            team_id: selectedTeam?.id,
            description: '',
            tags: '',
            priority: '',
            deadline: '',
            members: selectedMembers.map(member => member.id),
        },
        validationSchema: addTaskValidationSchema,
        onSubmit: async (values, formikHelpers) => {
            try {
                // Add selected members to the form values
                values.members = selectedMembers.map((member) => member.id);

                // Make the API call
                const response = await axios.post(
                    `https://brainmate.fly.dev/api/v1/tasks`,
                    values,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Handle success
                toast.success('Task added successfully', {
                    duration: 1000,
                    position: 'bottom-right',
                });
                formikHelpers.resetForm();
                onClose();
                setSelectedMembers([]); // Clear selected members
            } catch (error) {
                // Handle error
                toast.error(error.response?.data?.message || 'Error adding task', {
                    duration: 3000,
                    position: 'bottom-right',
                });
            }
        },
    });

    useEffect(() => {
        if (teamMembers?.data?.data.users) {
            // Filter out members that are already in selectedMembers
            const filteredMembers = teamMembers.data.data.users.filter(
                (user) => !selectedMembers.some((member) => member.id === user.id)
            );
            setTeamMembersState(filteredMembers);
        }
    }, [teamMembers, selectedMembers]);

    useEffect(() => {
        // Update the form's `members` field whenever `selectedMembers` changes
        addTaskFormik.setFieldValue('members', selectedMembers.map(member => member.id));
    }, [selectedMembers]);

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
                        className="bg-white rounded-lg shadow-lg border p-6 w-5/6 md:w-2/3 relative max-h-[95vh] overflow-y-auto"
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
                        <div className="m-auto w-fit bg-light text-white px-3 py-2 rounded-xl text-xl">{selectedTeam.name}</div>

                        {/* Add Task Form */}
                        <form
                            onSubmit={addTaskFormik.handleSubmit}
                            className="w-full mt-5 flex flex-wrap gap-x-[10px] gap-y-5"
                        >
                            {/* Task Name */}
                            <div className="relative z-0 w-full md:w-1/2 group">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    onChange={addTaskFormik.handleChange}
                                    onBlur={addTaskFormik.handleBlur}
                                    value={addTaskFormik.values.name}
                                    className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="name"
                                    className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                >
                                    Task Name
                                </label>
                                {addTaskFormik.errors.name && addTaskFormik.touched.name && (
                                    <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                        {addTaskFormik.errors.name}
                                    </div>
                                )}
                            </div>


                            {/* Task Priority */}
                            <div className="relative z-0 w-full md:w-[calc(25%-10px)] group">
                                <select
                                    name="priority"
                                    id="priority"
                                    onChange={addTaskFormik.handleChange}
                                    onBlur={addTaskFormik.handleBlur}
                                    value={addTaskFormik.values.priority}
                                    className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                >
                                    <option value="" disabled>Select Priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <label
                                    htmlFor="priority"
                                    className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                >
                                    Priority
                                </label>
                                {addTaskFormik.errors.priority && addTaskFormik.touched.priority && (
                                    <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                        {addTaskFormik.errors.priority}
                                    </div>
                                )}
                            </div>

                            {/* Task Deadline */}
                            <div className="relative z-0 w-full md:w-[calc(25%-10px)] group">
                                <input
                                    type="date"
                                    name="deadline"
                                    id="deadline"
                                    onChange={addTaskFormik.handleChange}
                                    onBlur={addTaskFormik.handleBlur}
                                    value={addTaskFormik.values.deadline}
                                    className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="deadline"
                                    className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                >
                                    Deadline
                                </label>
                                {addTaskFormik.errors.deadline && addTaskFormik.touched.deadline && (
                                    <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                        {addTaskFormik.errors.deadline}
                                    </div>
                                )}
                            </div>

                            {/* Task Description */}
                            <div className="relative z-0 w-full group">
                                <textarea
                                    name="description"
                                    id="description"
                                    onChange={addTaskFormik.handleChange}
                                    onBlur={addTaskFormik.handleBlur}
                                    value={addTaskFormik.values.description}
                                    className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="description"
                                    className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                >
                                    Description
                                </label>
                                {addTaskFormik.errors.description && addTaskFormik.touched.description && (
                                    <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                        {addTaskFormik.errors.description}
                                    </div>
                                )}
                            </div>

                            {/* Task Tags */}
                            <div className="relative z-0 w-full group">
                                <textarea
                                    name="tags"
                                    id="tags"
                                    onChange={addTaskFormik.handleChange}
                                    onBlur={addTaskFormik.handleBlur}
                                    value={addTaskFormik.values.tags}
                                    className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="tags"
                                    className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                >
                                    tags
                                </label>
                                {addTaskFormik.errors.tags && addTaskFormik.touched.tags && (
                                    <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                        {addTaskFormik.errors.tags}
                                    </div>
                                )}
                            </div>


                            {/* Assign to Members */}
                            <div className="relative z-0 w-full group">
                                <div className="my-3 flex flex-wrap gap-2">
                                    {selectedMembers?.map((member) => (
                                        <div key={member.id} className="flex gap-1 items-center bg-gray-300 w-fit p-2 rounded-full">
                                            {member.name}
                                            <XIcon
                                                size={15}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedMembers((prevSelectedMembers) =>
                                                        prevSelectedMembers.filter((m) => m.id !== member.id)
                                                    );
                                                    setTeamMembersState((prevTeamMembers) => [...prevTeamMembers, member]);
                                                }}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {addTaskFormik.errors.members && addTaskFormik.touched.members && (
                                    <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                        {addTaskFormik.errors.members}
                                    </div>
                                )}
                                <div
                                    onClick={() => setAssignTobtn(!assignTobtn)}
                                    className="flex justify-between items-center cursor-pointer"
                                >
                                    <span>members</span>
                                    <ChevronDown
                                        className={`${assignTobtn ? 'rotate-180 text-light' : ''} duration-300`}
                                    />
                                </div>

                                <label
                                    htmlFor="role_id"
                                    className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                >
                                    assigned to
                                </label>

                                <AnimatePresence>
                                    {assignTobtn && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative bg-white rounded w-full max-h-40 overflow-y-scroll"
                                        >
                                            {teamMembersState?.map((user, index) => (
                                                <motion.div
                                                    key={user.id}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    onClick={() => {
                                                        setSelectedMembers((prevSelectedMembers) => [...prevSelectedMembers, user]);
                                                        setTeamMembersState((prevTeamMembers) =>
                                                            prevTeamMembers.filter((member) => member.id !== user.id)
                                                        );
                                                    }}
                                                    className={`${index % 2 === 0 ? 'bg-stone-50' : 'bg-stone-100'
                                                        } flex flex-col px-1 py-2 hover:bg-white cursor-pointer`}
                                                >
                                                    <div className="flex items-center gap-1"><span>{user.name}</span><span className='text-xs opacity-80'>({user.role})</span></div>
                                                    <div className="text-[11px] opacity-90">{user.email}</div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-darkblue via-blueblack to-blueblack text-white text-lg font-bold hover:shadow-md"
                                style={{ transition: 'background-position 0.4s ease', backgroundSize: '150%' }}
                                onMouseEnter={(e) => (e.target.style.backgroundPosition = 'right')}
                                onMouseLeave={(e) => (e.target.style.backgroundPosition = 'left')}
                            >
                                Add Task
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddTaskForm;