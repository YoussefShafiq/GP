import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, XIcon, ChevronDown } from 'lucide-react';
import { useFormik } from 'formik';
import { object, string, array } from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ThreeDots } from 'react-loader-spinner';
import { TaskContext } from '../../context/TaskContext';

const TaskFormWithDuration = ({ isOpen, onClose, selectedTeam, token, teamMembers, mode, taskData }) => {
    const [assignTobtn, setAssignTobtn] = useState(false);
    const [teamMembersState, setTeamMembersState] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [sendingTask, setsendingTask] = useState(false);
    const [attachments, setAttachments] = useState([]); // State for attachments
    const memberIds = (selectedMembers || []).map((member) => member.id);
    let { selectedTask, setselectedTask } = useContext(TaskContext)


    // Form validation schema for task
    const taskValidationSchema = object({
        name: string().required('Task name is required'),
        description: string().required('Description is required'),
        tags: string().required('Tags are required'),
        priority: string().required('Priority is required'),
        duration: string().required('Duration is required'), // Changed from deadline to duration
        members: array().min(1, 'At least one member is required'),
        attachments: array(), // Optional: Add validation rules if needed
    });

    useEffect(() => {
        if (mode === 'update' && taskData) {
            addTaskFormik.setValues({
                name: taskData.name,
                description: taskData.description,
                tags: taskData.tags,
                priority: taskData.priority,
                duration: taskData.duration, // Changed from deadline to duration
                members: taskData.members.map((member) => member.id) || [], // Ensure this is an array
                attachments: taskData.attachments || [], // Ensure this is an array
            });
            setSelectedMembers(taskData.members || []); // Ensure this is an array
            setAttachments(taskData.attachments || []); // Ensure this is an array
        }
    }, [mode, taskData]);

    // Formik form handling for task
    const addTaskFormik = useFormik({
        initialValues: {
            name: '',
            team_id: selectedTeam?.id,
            description: '',
            tags: '',
            priority: '',
            duration: '', // Changed from deadline to duration
            members: [], // Ensure this is an empty array
            attachments: [], // Ensure this is an empty array
        },
        validationSchema: taskValidationSchema,
        onSubmit: async (values, formikHelpers) => {
            try {
                // Ensure `members` is an array
                values.members = selectedMembers.map((member) => member.id);

                // Create FormData object for multipart/form-data
                const formData = new FormData();

                // Append non-array fields
                Object.keys(values).forEach((key) => {
                    if (key !== 'members' && key !== 'attachments') {
                        formData.append(key, values[key]);
                    }
                });

                // Append `members` as an array
                values.members.forEach((memberId) => {
                    formData.append('members[]', memberId); // Use 'members[]' for array format
                });

                // Append attachments as an array
                values.attachments.forEach((file) => {
                    formData.append('attachments[]', file); // Use 'attachments[]' for array format
                });

                let response;
                if (mode === 'add') {
                    setsendingTask(true);
                    // Add task API call
                    response = await axios.post(
                        `https://brainmate.fly.dev/api/v1/tasks`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );
                    setsendingTask(false);
                    toast.success('Task added successfully', {
                        duration: 1000,
                        position: 'bottom-right',
                    });
                } else if (mode === 'update') {
                    setsendingTask(true);
                    // Update task API call
                    response = await axios.put(
                        `https://brainmate.fly.dev/api/v1/tasks/${taskData.id}`,
                        values,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setsendingTask(false);
                    toast.success('Task updated successfully', {
                        duration: 1000,
                        position: 'bottom-right',
                    });
                }

                // Reset form and close modal
                formikHelpers.resetForm();
                onClose();
                setSelectedMembers([]); // Clear selected members
                setAttachments([]); // Clear attachments
            } catch (error) {
                setsendingTask(false);
                // Handle error
                toast.error(error.response?.data?.message || 'Error processing task', {
                    duration: 3000,
                    position: 'bottom-right',
                });
            }
        },
    });

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setAttachments((prev) => [...prev, ...files]);
        addTaskFormik.setFieldValue('attachments', [...addTaskFormik.values.attachments, ...files]);
    };

    const handleFileDelete = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
        const updatedAttachments = addTaskFormik.values.attachments.filter((_, i) => i !== index);
        addTaskFormik.setFieldValue('attachments', updatedAttachments);
    };

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
        // Ensure `selectedMembers` is an array and map it to an array of IDs
        const memberIds = (selectedMembers || []).map((member) => member.id);
        addTaskFormik.setFieldValue('members', memberIds); // This will always be an array
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
                    onClick={() => { onClose(); setselectedTask(null); }}
                >
                    <motion.div
                        className="bg-white dark:bg-dark1 rounded-lg shadow-lg border p-6 w-5/6 md:w-2/3 relative max-h-[95vh] overflow-y-auto"
                        initial={{ y: 0, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => { onClose(); setselectedTask(null); }}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-500"
                        >
                            <X size={24} />
                        </button>
                        <div className="m-auto w-fit bg-light text-white px-3 py-2 rounded-xl text-xl">{mode === 'update' ? taskData?.name : selectedTeam?.name}</div>

                        {/* Task Form */}
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
                                    className="block py-2 w-full text-sm text-black dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="name"
                                    className="absolute text-sm text-gray-700 dark:text-gray-500 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
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
                                    className="block py-2 w-full text-sm text-black dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                >
                                    <option className='dark:bg-dark2' value="" disabled>Select Priority</option>
                                    <option className='dark:bg-dark2' value="low">Low</option>
                                    <option className='dark:bg-dark2' value="medium">Medium</option>
                                    <option className='dark:bg-dark2' value="high">High</option>
                                </select>
                                <label
                                    htmlFor="priority"
                                    className="absolute text-sm text-gray-700 dark:text-gray-500 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                >
                                    Priority
                                </label>
                                {addTaskFormik.errors.priority && addTaskFormik.touched.priority && (
                                    <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                        {addTaskFormik.errors.priority}
                                    </div>
                                )}
                            </div>

                            {/* Task Duration */}
                            <div className="relative z-0 w-full md:w-[calc(25%-10px)] group">
                                <input
                                    type="number"
                                    name="duration"
                                    id="duration"
                                    onChange={addTaskFormik.handleChange}
                                    onBlur={addTaskFormik.handleBlur}
                                    value={addTaskFormik.values.duration}
                                    className="block py-2 w-full text-sm text-black dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="duration"
                                    className="absolute text-sm text-gray-700 dark:text-gray-500 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                >
                                    Duration
                                </label>
                                {addTaskFormik.errors.duration && addTaskFormik.touched.duration && (
                                    <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                        {addTaskFormik.errors.duration}
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
                                    className="block py-2 w-full text-sm text-black dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="description"
                                    className="absolute text-sm text-gray-700 dark:text-gray-500 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
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
                                    className="block py-2 w-full text-sm text-black dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="tags"
                                    className="absolute text-sm text-gray-700 dark:text-gray-500 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                >
                                    Tags
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
                                        <div key={member.id} className="flex gap-1 items-center bg-gray-300 dark:bg-dark2 w-fit p-2 rounded-full">
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
                                    <span>Members</span>
                                    <ChevronDown
                                        className={`${assignTobtn ? 'rotate-180 text-light' : ''} duration-300`}
                                    />
                                </div>

                                <label
                                    htmlFor="role_id"
                                    className="absolute text-sm text-gray-700 dark:text-gray-500 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                >
                                    Assigned To
                                </label>

                                <AnimatePresence>
                                    {assignTobtn && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative bg-transparent rounded w-full max-h-40 overflow-y-scroll"
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
                                                    className={`${index % 2 === 0 ? 'bg-stone-50 dark:bg-dark2' : 'bg-stone-100 dark:bg-dark1'
                                                        } flex flex-col px-1 py-2 hover:bg-white dark:hover:bg-white dark:hover:bg-opacity-10 cursor-pointer`}
                                                >
                                                    <div className="flex items-center gap-1"><span>{user.name}</span><span className='text-xs opacity-80'>({user.role})</span></div>
                                                    <div className="text-[11px] opacity-90">{user.email}</div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Attachments Section */}
                            {mode === 'add' && <div className="relative z-0 w-full group">
                                <label
                                    htmlFor="attachments"
                                    className="block text-sm text-gray-700 dark:text-gray-500 mb-2"
                                >
                                    Attachments
                                </label>
                                <input
                                    type="file"
                                    id="attachments"
                                    name="attachments"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="block w-full text-sm text-black dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                />
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {addTaskFormik.values.attachments.map((file, index) => (
                                        <div key={index} className="flex gap-1 items-center bg-gray-300 w-fit p-2 rounded-full">
                                            {file.name}
                                            <XIcon
                                                size={15}
                                                onClick={() => handleFileDelete(index)}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-darkblue via-blueblack to-blueblack text-white text-lg font-bold hover:shadow-md"
                                style={{ transition: 'background-position 0.4s ease', backgroundSize: '150%' }}
                                onMouseEnter={(e) => (e.target.style.backgroundPosition = 'right')}
                                onMouseLeave={(e) => (e.target.style.backgroundPosition = 'left')}
                                disabled={sendingTask}
                            >
                                {sendingTask ? <>

                                    <ThreeDots
                                        visible={true}
                                        height="20"
                                        width="43"
                                        color={'white'}
                                        radius="9"
                                        ariaLabel="three-dots-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="w-fit m-auto"
                                    /></> : <>
                                    {mode === 'add' ? 'Add Task' : 'Update Task'}
                                </>}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TaskFormWithDuration;