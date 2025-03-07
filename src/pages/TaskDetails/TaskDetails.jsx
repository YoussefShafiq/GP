import React, { useContext, useEffect, useState } from 'react'
import { TaskContext } from '../../context/TaskContext'
import { useNavigate, useParams } from 'react-router-dom';
import { TeamsContext } from '../../context/TeamsContext';
import { projectContext } from '../../context/ProjectsContext';
import { Bomb, ChevronRight, Clock, Edit, Laptop, Loader2Icon, MoreVertical, MousePointerClick, Paperclip, RefreshCcw, Send, Trash2 } from 'lucide-react';
import TasksTable from '../../components/TasksTable/TasksTable';
import deadlineKiller from '../../assets/images/deadline killer.png'
import uploadingimg from '../../assets/images/uploading.gif'
import worker from '../../assets/images/computer-worker.png'
import RIP from '../../assets/images/RIPicon.png'
import success from '../../assets/images/success.png'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion
import axios from 'axios';
import toast from 'react-hot-toast';
import TaskForm from '../../components/AddTaskForm/AddTaskForm';
import { Tooltip } from '@heroui/tooltip';
import { ThreeDots } from 'react-loader-spinner';

export default function TaskDetails() {
    let { selectedTask, setselectedTask } = useContext(TaskContext)
    let { selectedProject, setselectedProject } = useContext(projectContext);
    let { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const token = localStorage.getItem('userToken');
    const navigate = useNavigate();
    const { id } = useParams(); // Extract the ID from the URL
    const [showConfirmation, setShowConfirmation] = useState(false); // State for showing the confirmation popup
    const [isUpdateTaskFormOpen, setIsUpdateTaskFormOpen] = useState(false); // State for update form
    const queryClient = useQueryClient(); // For invalidating queries
    const [noteDescription, setNoteDescription] = useState(''); // State for note inputuses
    const [addingNote, setaddingNote] = useState(false)
    const [deletingAttachment, setdeletingAttachment] = useState(false)
    const [showDeleteAttachmentConfirmation, setShowDeleteAttachmentConfirmation] = useState(false);
    const [attachmentToDelete, setAttachmentToDelete] = useState(null);
    const [uploading, setuploading] = useState(false);

    const { data: taskData, isLoading: taskDataIsLoading, refetch, isRefetching, isError, error } = useQuery({
        queryKey: ['taskData', id || selectedTask?.id],
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/tasks/${id || selectedTask?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        enabled: !!id || !!selectedTask, // Only run the query if there's an ID or a selected task
    });

    useEffect(() => {
        if (taskData?.data?.data?.task && !selectedTask) {
            setselectedTask(taskData?.data?.data?.task);
        }
    }, [taskData]);



    function formatTimeAgo(createdAt) {
        const now = new Date();
        const createdDate = new Date(createdAt);

        // Handle invalid dates
        if (isNaN(createdDate.getTime())) {
            return "invalid date";
        }

        const timeDifference = now - createdDate;

        // Handle future dates
        if (timeDifference < 0) {
            return "just now";
        }

        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (seconds < 60) {
            return "just now";
        } else if (minutes < 60) {
            return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
        } else if (hours < 24) {
            return `${hours} hour${hours === 1 ? "" : "s"} ago`;
        } else if (days < 30) {
            return `${days} day${days === 1 ? "" : "s"} ago`;
        } else if (months < 12) {
            return `${months} month${months === 1 ? "" : "s"} ago`;
        } else {
            return `${years} year${years === 1 ? "" : "s"} ago`;
        }
    }
    // Inside the TaskDetails component

    // Convert dates to timestamps
    const creationTimestamp = new Date(taskData?.data?.data?.task?.created_at).getTime();
    const deadlineDate = new Date(taskData?.data?.data?.task.deadline);
    deadlineDate.setHours(23, 59, 59, 999);
    const deadlineTimestamp = deadlineDate.getTime();
    const todayTimestamp = new Date().getTime();

    // Calculate progress
    const totalDuration = deadlineTimestamp - creationTimestamp;
    const elapsedDuration = todayTimestamp - creationTimestamp;
    const progressPercentage = Math.min((elapsedDuration / totalDuration) * 100, 100); // Ensure it doesn't exceed 100%
    const millisecondsInADay = 1000 * 60 * 60 * 24; // 1 day = 86400000 milliseconds
    const timeLeft = deadlineTimestamp - todayTimestamp;
    const daysLeft = Math.ceil(timeLeft / millisecondsInADay); // Round up to the nearest whole day

    // Handle cases where the deadline has passed
    const daysLeftDisplay = daysLeft > 0 ? daysLeft : 'No';

    // Gradient for the progress bar
    const progressBarStyle = {
        width: `${progressPercentage}%`,
        background: taskData?.data?.data?.task?.status !== "3" ? 'linear-gradient(90deg, #f54545, #f54545)' : 'linear-gradient(90deg, #2ab32a, #37e637)',
    };

    const handleRemoveTask = (TaskId) => {
        setShowConfirmation(true); // Show the confirmation popup
    };
    const cancelDelete = () => {
        setShowConfirmation(false); // Hide the confirmation popup
    };
    // Get team members function
    function getTeamMembers() {
        return axios.get(`https://brainmate.fly.dev/api/v1/projects/teams/${selectedTask.team_id}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // Get team members query
    let { data: teamMembers } = useQuery({
        queryKey: ['teamMembers', selectedTask?.team_id],
        queryFn: getTeamMembers,
    });
    async function confirmDelete() {
        try {
            await axios.delete(
                `https://brainmate.fly.dev/api/v1/tasks/${selectedTask.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Task deleted successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            setselectedTask(null);
            if (selectedTeam) {
                navigate('/project/team');
            } else {
                navigate('/mytasks');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting team', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
        setShowConfirmation(false); // Hide the confirmation popup
    };

    // Mutation for adding a note
    const addNoteMutation = useMutation({
        mutationFn: (description) =>
            axios.post(
                `https://brainmate.fly.dev/api/v1/tasks/${selectedTask.id}/notes`,
                { description },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ),
        onSuccess: () => {
            // Invalidate the task data query to refetch the updated task with the new note
            queryClient.invalidateQueries(['taskData', selectedTask]);
            toast.success('Note added successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            setaddingNote(false)
            setNoteDescription(''); // Clear the input after successful submission
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error adding note', {
                duration: 3000,
                position: 'bottom-right',
            });
        },
    });

    // Handle adding a note
    const handleAddNote = (e) => {
        setaddingNote(true)
        e.preventDefault(); // Prevent form submission
        const noteverify = noteDescription.replaceAll('\n', '').replaceAll(' ', '')
        if (noteverify) {
            addNoteMutation.mutate(noteDescription); // Call the mutation
        } else {
            setaddingNote(false)
            toast.error('Note description cannot be empty', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    };


    if (!selectedTask && !id) {
        return (
            <div className="h-[calc(100vh-48px)] flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                    <MousePointerClick size={35} className='text-light' />
                    <h2 className='capitalize'>please select task first</h2>
                </div>
            </div>
        );
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'auto',
        });
    }, []);



    // Function to handle file upload
    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 8 * 1024 * 1024; // 8MB

        // Check file sizes
        const oversizedFiles = files.filter(file => file.size > maxSize);
        if (oversizedFiles.length > 0) {
            toast.error('File size exceeds 8MB limit', {
                duration: 3000,
                position: 'bottom-right',
            });
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('attachments[]', file);
        });

        try {
            setuploading(true)
            const response = await axios.post(
                `https://brainmate.fly.dev/api/v1/tasks/${selectedTask.id}/attachments`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setuploading(false)
            toast.success('Attachments uploaded successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            refetch(); // Refetch task data to update the attachments list
        } catch (error) {
            setuploading(false)
            toast.error(error.response?.data?.message || 'Error uploading attachments', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    };

    // Function to handle file deletion
    const handleFileDelete = async (attachmentId) => {
        setdeletingAttachment(true)
        try {
            await axios.delete(
                `https://brainmate.fly.dev/api/v1/tasks/attachments/${attachmentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setdeletingAttachment(false)
            toast.success('Attachment deleted successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            refetch(); // Refetch task data to update the attachments list
        } catch (error) {
            setdeletingAttachment(false)
            toast.error(error.response?.data?.message || 'Error deleting attachment', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    };

    // Function to show delete confirmation for an attachment
    const confirmDeleteAttachment = (attachmentId) => {
        setAttachmentToDelete(attachmentId);
        setShowDeleteAttachmentConfirmation(true);
    };

    // Function to cancel delete confirmation
    const cancelDeleteAttachment = () => {
        setAttachmentToDelete(null);
        setShowDeleteAttachmentConfirmation(false);
    };

    // Function to proceed with attachment deletion
    const proceedDeleteAttachment = async () => {
        if (attachmentToDelete) {
            await handleFileDelete(attachmentToDelete);
            setAttachmentToDelete(null);
            setShowDeleteAttachmentConfirmation(false);
        }
    };

    if (isError) {
        return <div className='text-center py-5'>task loading error</div>
    }


    return <>

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
                        className="bg-white dark:bg-dark1 border  p-6 rounded-lg shadow-lg"
                    >
                        <h2 className="text-lg font-semibold mb-4">Are you sure you want to remove "{taskData?.data?.data?.task?.name}" task?</h2>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-300 dark:bg-dark2 rounded-lg hover:bg-gray-400"
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

        {isUpdateTaskFormOpen && (
            <TaskForm
                isOpen={isUpdateTaskFormOpen}
                onClose={() => setIsUpdateTaskFormOpen(false)}
                selectedTeam={selectedTeam}
                token={token}
                teamMembers={teamMembers}
                mode="update"
                taskData={taskData?.data?.data?.task} // Pass the task data to pre-fill the form
                refetchTask={refetch}
            />
        )}
        <div className="p-2 md:p-5">
            {/* path */}
            <div className='text-gray-400 flex md:flex-row flex-col justify-between md:items-center lg:h-16 px-5'>
                <div className='flex flex-wrap items-center ' >

                    {selectedTask?.members ?
                        <>
                            {selectedTask?.assigned_to_me ?
                                <>
                                    {!(selectedTask?.notes) &&
                                        <>
                                            <div onClick={() => { navigate('/mytasks'); setselectedTeam(null) }} className="pe-1 cursor-pointer capitalize">my tasks</div><ChevronRight strokeWidth={0.7} />
                                        </>}
                                    {(selectedTask?.notes) &&
                                        <>
                                            <div onClick={() => { navigate('/'); setselectedTeam(null) }} className="pe-1 cursor-pointer capitalize">Home</div><ChevronRight strokeWidth={0.7} />
                                        </>}
                                </> :
                                <>
                                    {selectedProject && <><div onClick={() => { navigate('/project'); setselectedTeam(null) }} className="pe-1 cursor-pointer">{selectedProject?.name}</div><ChevronRight strokeWidth={0.7} /></>}
                                    {selectedTeam && <><div onClick={() => { navigate('/project/team'); }} className="px-1 cursor-pointer">{selectedTeam?.name}</div><ChevronRight strokeWidth={0.7} /></>}
                                </>}

                        </> : <>
                            <div onClick={() => { navigate('/'); setselectedTeam(null) }} className="pe-1 cursor-pointer capitalize">Home</div><ChevronRight strokeWidth={0.7} />
                        </>}

                    <Tooltip closeDelay={0} content={
                        <h2><span className='font-bold'>Project: </span>{taskData?.data.data.task.project_name}, <span className='font-bold'>Team: </span>{taskData?.data.data.task.team_name}</h2>
                    }>
                        <div onClick={() => { navigate(`/task-details/${id}`); }} className="px-1 cursor-pointer text-black dark:text-white">{(taskData?.data.data.task.name || selectedTask?.name)}</div>

                    </Tooltip>
                </div>
                <div className="flex justify-end gap-2 mb-4">
                    {isRefetching && <div className="hidden md:flex items-center text-blue-500"><Loader2Icon className='animate-spin' /></div>}
                    <Tooltip delay={350} closeDelay={0} content='refresh' >
                        <button
                            onClick={() => refetch()} // Open the update form
                            title='refresh'
                            className="rounded-full bg-white dark:bg-dark text-blue-500 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            <RefreshCcw size={25} />
                        </button>
                    </Tooltip>

                    {(taskData?.data.data.task.role === 'leader' || taskData?.data.data.task.role === 'manager') && <>

                        <Tooltip delay={350} closeDelay={0} content='update task' >
                            <button
                                onClick={() => setIsUpdateTaskFormOpen(true)} // Open the update form
                                title='update task'
                                className="rounded-full bg-white dark:bg-dark text-yellow-400 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                <Edit size={25} />
                            </button>
                        </Tooltip>
                        <Tooltip delay={350} closeDelay={0} content='delete task' >
                            <button
                                onClick={() => handleRemoveTask(selectedTask.id)}
                                title='delete task'
                                className="rounded-full bg-white dark:bg-dark text-red-600 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all">

                                <Trash2 size={22} />
                            </button>
                        </Tooltip>
                    </>}
                </div>
            </div>

            {/* task details */}
            <div className="p-3">
                {/* task in table */}
                {taskDataIsLoading ? <>
                    {selectedTask?.members ? <TasksTable tasks={[selectedTask]} /> : <>

                        <div className="overflow-x-auto">
                            <table className="w-full rounded-xl overflow-hidden text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-neutral-700 dark:text-gray-400">
                                    <tr>
                                        {["Task Name", "Assigned to", "Deadline", "Priority", "Status", "Tags"].map((header, index) => (
                                            <th key={index} scope="col" className="px-6 py-3 whitespace-nowrap">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>

                                    <td colSpan={6} className='text-center py-3' >
                                        <ThreeDots
                                            visible={true}
                                            height="20"
                                            width="43"
                                            color="#133d57"
                                            radius="9"
                                            ariaLabel="three-dots-loading"
                                            wrapperStyle={{}}
                                            wrapperClass="w-fit m-auto"
                                        />
                                    </td>

                                </tbody>
                            </table>
                        </div>

                    </>}
                </> : <><TasksTable tasks={[taskData?.data?.data?.task]} /></>}

                <div className="flex flex-col lg:flex-row justify-between gap-10 mt-8">
                    <div className="flex flex-col lg:w-[calc(66.666%-8px)] gap-5">
                        {/* Task Progress Bar */}
                        {!taskDataIsLoading &&
                            <div className="relative w-full bg-gray-200 rounded-full h-3 dark:bg-gray-300 my-3">
                                <div
                                    className="h-3 rounded-full relative"
                                    style={progressBarStyle}
                                >
                                    {/* Icon at the end of the progress bar */}
                                    {progressPercentage != 100 && taskData?.data?.data?.task?.status !== "3" && <div
                                        className="absolute right-0 flex items-center gap-1 -mt-9 transform z-10 "
                                        style={{ top: '50%' }}
                                    >
                                        <img src={deadlineKiller} className='w-6' alt="" />
                                    </div>}
                                    {progressPercentage == 100 && <>
                                        {taskData?.data?.data?.task?.is_overdue ? <div
                                            className="absolute right-0 flex items-center gap-1 -mt-[33px] transform z-10 opacity-60"
                                            style={{ top: '50%' }}
                                        >
                                            {/* <Bomb size={16} className="text-red-600" />  */}
                                            <img src={RIP} className='w-6' alt="" />
                                        </div> : <div
                                            className="absolute right-0 flex items-center gap-1 -mt-[30px] transform z-10"
                                            style={{ top: '50%' }}
                                        >
                                            <img src={success} className='w-6' alt="" />
                                        </div>}
                                    </>}

                                </div>
                                {progressPercentage != 100 && <div
                                    className="absolute right-0 flex items-center gap-1 -mt-7 transform "
                                    style={{ top: '50%' }}
                                >
                                    <img src={worker} className='w-6' alt="" />
                                </div>}
                                {progressPercentage != 100 ? <div className="text-end dark:text-gray-300">{daysLeftDisplay} day left</div> : <div className="text-end dark:text-gray-300">It's over</div>}
                            </div>
                        }
                        {/* Delete Attachment Confirmation Popup */}
                        <AnimatePresence>
                            {showDeleteAttachmentConfirmation && (
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
                                        <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this attachment?</h2>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={cancelDeleteAttachment}
                                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={proceedDeleteAttachment}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:cursor-wait"
                                                disabled={deletingAttachment}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* task description */}
                        <div className="mt-2">
                            <h2 className='capitalize mb-2 font-semibold text-gray-700 dark:text-gray-100' >task description</h2>
                            {taskDataIsLoading ? <>
                                <div name="task description" id="task description" className='w-full dark:outline-gray-300 dark:text-white overflow-y-auto break-words' >
                                    {selectedTask?.description?.split('\n').map((line, lineIndex) => (
                                        <React.Fragment key={lineIndex}>
                                            {line.split(' ').map((word, wordIndex) =>
                                                /\bhttps?:\/\/[^\s]+/.test(word) ? (
                                                    <a
                                                        key={wordIndex}
                                                        href={word}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className='text-light break-words hover:underline'
                                                    >
                                                        {word}
                                                    </a>
                                                ) : (
                                                    <span className='break-words' key={wordIndex}> {word} </span>
                                                )
                                            )}
                                            <br /> {/* Handles new lines */}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </> :
                                <div name="task description" id="task description" className='w-full dark:outline-gray-300 dark:text-white overflow-y-auto' >
                                    {taskData?.data?.data?.task?.description?.split('\n').map((line, lineIndex) => (
                                        <React.Fragment key={lineIndex}>
                                            {line.split(' ').map((word, wordIndex) =>
                                                /\bhttps?:\/\/[^\s]+/.test(word) ? (
                                                    <a
                                                        key={wordIndex}
                                                        href={word}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className='text-light break-words'
                                                    >
                                                        {word}
                                                    </a>
                                                ) : (
                                                    <span className='break-words' key={wordIndex}> {word} </span>
                                                )
                                            )}
                                            <br /> {/* Handles new lines */}
                                        </React.Fragment>
                                    ))}
                                </div>
                            }
                        </div>

                        {/* Attachments Section */}
                        <div className="">
                            <div className="flex flex-wrap md:flex-row flex-col justify-between items-center mb-2">
                                <h2 className='capitalize mb-3 font-semibold text-gray-700 dark:text-gray-100'>Attachments</h2>
                                {/* Add Attachment Button */}
                                <div className="flex gap-2 items-center">
                                    {uploading && <div className="hidden md:flex items-center text-blue-500"><img src={uploadingimg} alt="" className='w-6' /></div>}
                                    <div className={`flex items-center p-2 py-1 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer dark:border-gray-700 ${uploading && 'opacity-50 cursor-wait'} `}>

                                        <label htmlFor="file-upload" className={` ${uploading ? 'cursor-wait' : 'cursor-pointer'} flex items-center gap-2`}>
                                            <div className="w-6 h-6">
                                                <Paperclip size={22} className="text-gray-500 dark:text-gray-400" />
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                                Add Attachment
                                            </p>
                                        </label>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            multiple
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex lg:flex-row flex-col flex-wrap gap-4">


                                {/* Display Attachments */}
                                {taskData?.data?.data?.task?.attachments?.length > 0 ? (
                                    taskData.data.data.task.attachments.map((attachment, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer dark:border-gray-700 relative"
                                            onClick={() => window.open('https://brainmate.fly.dev/' + attachment.media, '_blank')}
                                        >
                                            {/* File Icon Based on File Type */}
                                            {['.jpg', '.png', '.svg', '.jpeg'].some(ext => attachment.name.toLowerCase().endsWith(ext)) ? (
                                                <img
                                                    src={`https://brainmate.fly.dev/${attachment.media}`}
                                                    alt={attachment.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg dark:bg-gray-700">
                                                    <Paperclip size={24} className="text-gray-500 dark:text-gray-400" />
                                                </div>
                                            )}

                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                                                {attachment.name}
                                            </p>

                                            {/* More Vertical Icon for Delete */}
                                            <div
                                                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmDeleteAttachment(attachment.id);
                                                }}
                                            >
                                                <MoreVertical size={16} className="text-gray-500 dark:text-gray-400" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">No attachments found.</p>
                                )}
                            </div>
                        </div>

                        {/* assigned to */}
                        <div className="bg-base dark:bg-dark1 max-h-96 p-4 rounded-2xl shadow-xl overflow-y-auto">
                            <h2 className='capitalize mb-3 font-semibold text-gray-700 dark:text-gray-100' >assigned to</h2>
                            {(taskDataIsLoading && selectedTeam) ? <>
                                <div className="flex flex-col flex-wrap gap-3">
                                    {selectedTask?.members?.map((person) => (
                                        <div key={person.id} className="flex gap-2 border-b pb-3">
                                            <div
                                                key={person.id}
                                                className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                                style={{ backgroundColor: person.color }}
                                                title={person.name}
                                            >
                                                {person.name[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className='dark:text-gray-50' >{person.name} <span className='text-xs text-gray-500 dark:text-gray-400 font-light' >({person.role})</span></p>
                                                <p className='text-xs text-gray-600 dark:text-gray-500' >{person.email || `${person.name.replaceAll(' ', '_')}@gmail.com`}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </> : <>
                                <div className="flex flex-col flex-wrap gap-3">
                                    {taskData?.data?.data?.task?.members?.map((person) => (
                                        <div className="flex gap-2 border-b pb-3">
                                            <div
                                                key={person.id}
                                                className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                                style={{ backgroundColor: person.color }}
                                                title={person.name}
                                            >
                                                {person.name[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className='dark:text-gray-50' >{person.name} <span className='text-xs text-gray-500 dark:text-gray-400 font-light' >({person.role})</span></p>
                                                <p className='text-xs text-gray-600 dark:text-gray-500' >{person.email || `${person.name.replaceAll(' ', '_')}@gmail.com`}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>}
                        </div>
                    </div>
                    {/* right side */}
                    <div className="flex flex-col lg:w-[calc(35.333%-8px)] gap-y-6">
                        {/* task notes */}
                        <div className="flex flex-col bg-base dark:bg-dark1 p-5 rounded-3xl shadow-xl max-h-96 relative">
                            <h2 className='capitalize ms-4 font-semibold text-gray-700 dark:text-gray-100'>Task Notes</h2>

                            {/* <!-- Make the ol take up the remaining space and be scrollable --> */}
                            <div className="flex-1 md:p-5 p-5 pe-0 pb-0 overflow-y-auto dark:text-gray-100">
                                {taskData?.data?.data.task.notes.length == 0 ? <>
                                    <div className="text-center">No notes found</div>
                                </> : <>
                                    <ol className="relative border-s border-gray-400 dark:border-gray-700 ">
                                        {taskData?.data?.data.task.notes.map((note) => (
                                            <li key={note.id} className="mb-5 ms-6">
                                                <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 dark:bg-blue-900">
                                                    <Tooltip content={note.user.email} delay={350} closeDelay={0}>
                                                        <div
                                                            className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                                            style={{ backgroundColor: note.user.color }}
                                                        >
                                                            {note.user.name[0]}
                                                        </div>
                                                    </Tooltip>
                                                </span>
                                                <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-xs md:flex dark:bg-dark2 dark:border-gray-600">
                                                    <time className="mb-1 text-center w-10 text-xs font-normal text-gray-400 order-1 md:order-last sm:mb-0">{formatTimeAgo(note.created_at)}</time>
                                                    <div className="text-sm font-normal text-gray-500 dark:text-gray-300 break-words md:max-w-[calc(100%-30px)]"><span className='font-bold text-black dark:text-white'>{note.user.name}</span>
                                                        {note.description.split('\n').map((line, lineIndex) => (
                                                            <React.Fragment key={lineIndex}>
                                                                {line.split(' ').map((word, wordIndex) =>
                                                                    /\bhttps?:\/\/[^\s]+/.test(word) ? (
                                                                        <a
                                                                            key={wordIndex}
                                                                            href={word}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className='text-light break-words hover:underline'
                                                                        >
                                                                            {word}
                                                                        </a>
                                                                    ) : (
                                                                        <span className='break-words' key={wordIndex}> {word} </span>
                                                                    )
                                                                )}
                                                                <br /> {/* Handles new lines */}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </>}
                            </div>

                            {/* <!-- Fix the input and button at the bottom --> */}
                            <form onSubmit={handleAddNote} className="flex justify-between items-center gap-2 bg-base dark:bg-dark1 mt-4 flex-shrink-0">
                                <textarea
                                    placeholder="Add Notes..."
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-light focus:border-light duration-300 resize-none dark:bg-dark1 dark:text-white"
                                    rows={1}
                                    style={{ minHeight: '40px', maxHeight: '120px', overflowY: 'auto' }}
                                    value={noteDescription}
                                    onChange={(e) => setNoteDescription(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault(); // Prevent default behavior (new line)
                                            handleAddNote(e); // Send the message
                                        }
                                    }}
                                />
                                <button button
                                    type="submit"
                                    className="p-2 bg-light text-white rounded-lg hover:bg-darkblue h-full aspect-square flex items-center justify-center transition-all disabled:opacity-20"
                                    disabled={addingNote} // Disable button while loading
                                >
                                    {addNoteMutation.isLoading ? 'Adding...' : <Send size={20} />}
                                </button>
                            </form>
                        </div>
                        {/* activity log */}
                        <div className="flex flex-col bg-base dark:bg-dark1 p-5 rounded-3xl shadow-xl max-h-96 relative">
                            <h2 className='capitalize ms-4 font-semibold text-gray-700 dark:text-gray-100'>Activity Log</h2>

                            {/* <!-- Make the ol take up the remaining space and be scrollable --> */}
                            <div className="flex-1 p-5 pb-0 overflow-y-auto dark:text-gray-100">
                                {!taskData?.data?.data.task.logs ? <>
                                    <div className="text-center">No logs found</div>
                                </> : <>
                                    <ol className="relative border-s border-gray-400 dark:border-gray-700 ">
                                        {taskData?.data?.data?.task.logs.map((log) => (

                                            <li key={log.id} className="mb-5 ms-6">
                                                <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 dark:bg-blue-900">
                                                    <Tooltip content={log.user.email} delay={350} closeDelay={0}>
                                                        <div
                                                            className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                                            style={{ backgroundColor: log.user.color }}
                                                        >
                                                            {log.user.name[0]}
                                                        </div>
                                                    </Tooltip>
                                                </span>
                                                <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-xs sm:flex  dark:bg-dark2 dark:border-gray-600">
                                                    <time className="mb-1 text-center w-10 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">{formatTimeAgo(log.created_at)}</time>
                                                    <div className="text-sm font-normal text-gray-500 dark:text-gray-300 break-words"><span className='font-bold text-black dark:text-white'>{log.user.name}</span>
                                                        {log.description.split('\n').map((line, lineIndex) => (
                                                            <React.Fragment key={lineIndex}>
                                                                {line.split(' ').map((word, wordIndex) =>
                                                                    /\bhttps?:\/\/[^\s]+/.test(word) ? (
                                                                        <a
                                                                            key={wordIndex}
                                                                            href={word}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className='text-light break-words hover:underline'
                                                                        >
                                                                            {word}
                                                                        </a>
                                                                    ) : (
                                                                        <span className='break-words' key={wordIndex}> {word} </span>
                                                                    )
                                                                )}
                                                                <br /> {/* Handles new lines */}
                                                            </React.Fragment>
                                                        ))}
                                                        <div className={`${log.event === 'updated' ? 'bg-yellow-400' : log.event === 'viewed' ? 'bg-blue-500' : log.event === 'deleted' ? 'bg-red-600' : 'bg-green-500'} w-fit mt-1 me-1 text-xs font-thin text-white rounded-lg px-1`}>
                                                            {log.event}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    </>
}
