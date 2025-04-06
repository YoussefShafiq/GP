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
    const [attachments, setAttachments] = useState([]);
    const { selectedTask, setselectedTask } = useContext(TaskContext);

    // Form validation schema
    const taskValidationSchema = object({
        name: string().required('Task name is required'),
        description: string().required('Description is required'),
        tags: string().required('Tags are required'),
        priority: string().required('Priority is required'),
        duration: string().required('Duration is required'),
        members: array().min(1, 'At least one member is required'),
        attachments: array(),
    });

    // Initialize form with task data when in update mode
    useEffect(() => {
        if (mode === 'update' && taskData) {
            addTaskFormik.setValues({
                name: taskData.name,
                description: taskData.description,
                tags: taskData.tags,
                priority: taskData.priority,
                is_backlog: true,
                duration: taskData.duration,
                members: taskData.members?.map((member) => member.id) || [],
                attachments: taskData.attachments || [],
            });
            setSelectedMembers(taskData.members || []);
            setAttachments(taskData.attachments || []);
        }
    }, [mode, taskData]);

    // Formik configuration
    const addTaskFormik = useFormik({
        initialValues: {
            name: '',
            team_id: selectedTeam?.id,
            description: '',
            tags: '',
            priority: '',
            is_backlog: true,
            duration: '',
            members: [],
            attachments: [],
        },
        validationSchema: taskValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                setsendingTask(true);
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                };

                if (mode === 'add') {
                    // Create task with FormData for file uploads
                    const formData = new FormData();
                    Object.entries(values).forEach(([key, value]) => {
                        if (key !== 'members' && key !== 'attachments') {
                            formData.append(key, value);
                        }
                    });

                    // Add members and attachments
                    selectedMembers.forEach(member => formData.append('members[]', member.id));
                    attachments.forEach(file => formData.append('attachments[]', file));

                    config.headers['Content-Type'] = 'multipart/form-data';
                    await axios.post('https://brainmate.fly.dev/api/v1/tasks', formData, config);
                    toast.success('Task created successfully!');
                } else if (mode === 'update') {
                    // Update task with JSON data
                    const updateData = {
                        ...values,
                        members: selectedMembers.map(member => member.id),
                        // Note: For updating attachments, you might need additional logic
                        // depending on your API requirements
                    };
                    await axios.put(
                        `https://brainmate.fly.dev/api/v1/tasks/${taskData.id}`,
                        updateData,
                        config
                    );
                    toast.success('Task updated successfully!');
                }

                resetForm();
                onClose();
                setSelectedMembers([]);
                setAttachments([]);
            } catch (error) {
                console.error('API Error:', error);
                toast.error(error.response?.data?.message || 'An error occurred');
            } finally {
                setsendingTask(false);
            }
        },
    });

    // Handle file uploads
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setAttachments(prev => [...prev, ...files]);
        addTaskFormik.setFieldValue('attachments', [...addTaskFormik.values.attachments, ...files]);
    };

    // Handle file deletion
    const handleFileDelete = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
        addTaskFormik.setFieldValue(
            'attachments',
            addTaskFormik.values.attachments.filter((_, i) => i !== index)
        );
    };

    // Filter available team members
    useEffect(() => {
        if (teamMembers?.data?.data?.users) {
            const filtered = teamMembers.data.data.users.filter(
                user => !selectedMembers.some(member => member.id === user.id)
            );
            setTeamMembersState(filtered);
        }
    }, [teamMembers, selectedMembers]);

    // Update formik values when selected members change
    useEffect(() => {
        addTaskFormik.setFieldValue(
            'members',
            selectedMembers.map(member => member.id)
        );
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
                        <button
                            onClick={() => { onClose(); setselectedTask(null); }}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-500"
                        >
                            <X size={24} />
                        </button>

                        <div className="m-auto w-fit bg-light text-white px-3 py-2 rounded-xl text-xl">
                            {mode === 'update' ? taskData?.name : selectedTeam?.name}
                        </div>

                        <form onSubmit={addTaskFormik.handleSubmit} className="w-full mt-5 flex flex-wrap gap-x-[10px] gap-y-5">
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

                            {/* Priority */}
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

                            {/* Duration */}
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
                                    Duration (hours)
                                </label>
                                {addTaskFormik.errors.duration && addTaskFormik.touched.duration && (
                                    <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                        {addTaskFormik.errors.duration}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="relative z-0 w-full group">
                                <textarea
                                    name="description"
                                    id="description"
                                    onChange={addTaskFormik.handleChange}
                                    onBlur={addTaskFormik.handleBlur}
                                    value={addTaskFormik.values.description}
                                    className="block py-2 w-full text-sm text-black dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                    placeholder=" "
                                    rows="3"
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

                            {/* Tags */}
                            <div className="relative z-0 w-full group">
                                <input
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
                                    Tags (comma separated)
                                </label>
                                {addTaskFormik.errors.tags && addTaskFormik.touched.tags && (
                                    <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                        {addTaskFormik.errors.tags}
                                    </div>
                                )}
                            </div>

                            {/* Members Assignment */}
                            <div className="relative z-0 w-full group">
                                <div className="my-3 flex flex-wrap gap-2">
                                    {selectedMembers?.map((member) => (
                                        <div key={member.id} className="flex gap-1 items-center bg-gray-300 dark:bg-dark2 w-fit p-2 rounded-full">
                                            {member.name}
                                            <XIcon
                                                size={15}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedMembers(prev => prev.filter(m => m.id !== member.id));
                                                    setTeamMembersState(prev => [...prev, member]);
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
                                    className="flex justify-between items-center cursor-pointer py-2 border-b-2 border-gray-300"
                                >
                                    <span className="text-sm text-gray-700 dark:text-gray-500">Assign Team Members</span>
                                    <ChevronDown className={`${assignTobtn ? 'rotate-180 text-light' : ''} duration-300`} />
                                </div>

                                <AnimatePresence>
                                    {assignTobtn && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative bg-transparent rounded w-full max-h-40 overflow-y-auto mt-2"
                                        >
                                            {teamMembersState?.map((user) => (
                                                <motion.div
                                                    key={user.id}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    onClick={() => {
                                                        setSelectedMembers(prev => [...prev, user]);
                                                        setTeamMembersState(prev => prev.filter(m => m.id !== user.id));
                                                    }}
                                                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-dark2 cursor-pointer"
                                                >
                                                    <div className="flex-1">
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </div>
                                                    <div className="text-xs bg-gray-200 dark:bg-dark3 px-2 py-1 rounded">
                                                        {user.role}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Attachments (only for create mode) */}
                            {mode === 'add' && (
                                <div className="relative z-0 w-full group">
                                    <label className="block text-sm text-gray-700 dark:text-gray-500 mb-2">
                                        Attachments
                                    </label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                                    />
                                    <div className="mt-2 space-y-2">
                                        {attachments.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-dark2 rounded">
                                                <span className="text-sm truncate max-w-xs">{file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleFileDelete(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <XIcon size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={sendingTask}
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-darkblue via-blueblack to-blueblack text-white text-lg font-bold hover:shadow-md disabled:opacity-70"
                            >
                                {sendingTask ? (
                                    <ThreeDots
                                        visible={true}
                                        height="20"
                                        width="43"
                                        color="white"
                                        radius="9"
                                        wrapperClass="w-fit m-auto"
                                    />
                                ) : mode === 'add' ? 'Create Task' : 'Update Task'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TaskFormWithDuration;