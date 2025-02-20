import React, { useContext, useEffect, useState } from 'react'
import { TaskContext } from '../../context/TaskContext'
import { useNavigate } from 'react-router-dom';
import { TeamsContext } from '../../context/TeamsContext';
import { projectContext } from '../../context/ProjectsContext';
import { Bomb, ChevronRight, Clock, Edit, Laptop, MousePointerClick, Send, Trash2 } from 'lucide-react';
import TasksTable from '../../components/TasksTable/TasksTable';
import deadlineKiller from '../../assets/images/deadline killer.png'
import worker from '../../assets/images/computer-worker.png'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion
import axios from 'axios';
import toast from 'react-hot-toast';
import TaskForm from '../../components/AddTaskForm/AddTaskForm';

export default function TaskDetails() {
    let { selectedTask, setselectedTask } = useContext(TaskContext)
    let { selectedProject, setselectedProject } = useContext(projectContext);
    let { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const token = localStorage.getItem('userToken');
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false); // State for showing the confirmation popup
    const [isUpdateTaskFormOpen, setIsUpdateTaskFormOpen] = useState(false); // State for update form
    const queryClient = useQueryClient(); // For invalidating queries
    const [noteDescription, setNoteDescription] = useState(''); // State for note inputuses
    const [addingNote, setaddingNote] = useState(false)

    const { data: taskData, isLoading: taskDataIsLoading, refetch } = useQuery({
        queryKey: ['taskData', selectedTask],
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/tasks/${selectedTask.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
    });

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
            return "in the future";
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
    const deadlineTimestamp = new Date(taskData?.data?.data?.task.deadline).getTime();
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
        background: 'linear-gradient(90deg, #f54545, #f54545)', // Example gradient
    };

    const handleRemoveTask = (TaskId) => {
        setShowConfirmation(true); // Show the confirmation popup
    };
    const cancelDelete = () => {
        setShowConfirmation(false); // Hide the confirmation popup
    };
    // Get team members function
    function getTeamMembers() {
        if (teamData?.data?.data.team.role !== 'member')
            return axios.get(`https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    }

    // Get team members query
    let { data: teamMembers } = useQuery({
        queryKey: ['teamMembers', selectedTeam?.id],
        queryFn: getTeamMembers,
        enabled: !!selectedTeam,

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
        if (noteDescription.trim()) {
            addNoteMutation.mutate(noteDescription); // Call the mutation
        } else {
            toast.error('Note description cannot be empty', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    };


    if (!selectedTask) {
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
                        className="bg-white p-6 rounded-lg shadow-lg"
                    >
                        <h2 className="text-lg font-semibold mb-4">Are you sure you want to remove "{selectedTask.name}" task?</h2>
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
        <div className="p-5">
            {/* path */}
            <div className='text-gray-400 flex justify-between items-center h-16 px-5'>
                <div className='flex items-center ' >
                    {!selectedTask?.assigned_to_me && <>
                        <div onClick={() => { navigate('/project'); setselectedTeam(null) }} className="pe-1 cursor-pointer">{selectedProject?.name}</div><ChevronRight strokeWidth={0.7} />
                        <div onClick={() => { navigate('/project/team'); }} className="px-1 cursor-pointer">{selectedTeam?.name}</div><ChevronRight strokeWidth={0.7} />
                    </>}
                    {selectedTask?.assigned_to_me && <>
                        <div onClick={() => { navigate('/mytasks'); setselectedTeam(null) }} className="pe-1 cursor-pointer capitalize">my tasks</div><ChevronRight strokeWidth={0.7} />
                    </>}
                    <div onClick={() => { navigate('/task-details'); }} className="px-1 cursor-pointer text-black dark:text-white">{selectedTask?.name}</div>
                </div>
                {taskData?.data.data.task.role !== 'member' && <>
                    <div className="flex justify-end gap-2 mb-4">
                        <button
                            onClick={() => setIsUpdateTaskFormOpen(true)} // Open the update form
                            title='update task'
                            className="rounded-full bg-white dark:bg-dark text-yellow-400 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            <Edit size={25} />
                        </button>
                        <button
                            onClick={() => handleRemoveTask(selectedTask.id)}
                            title='delete task'
                            className="rounded-full bg-white dark:bg-dark text-red-600 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all">

                            <Trash2 size={22} />
                        </button>
                    </div>
                </>}
            </div>

            {/* task details */}
            <div className="p-3">
                {/* task in table */}

                {taskDataIsLoading ? <><TasksTable tasks={[selectedTask]} /></> : <><TasksTable tasks={[taskData?.data?.data?.task]} /></>}

                <div className="flex justify-between gap-10 mt-8">
                    <div className="flex flex-col w-[calc(66.666%-8px)] gap-5">
                        {/* Task Progress Bar */}
                        <div className="relative w-full bg-gray-200 rounded-full h-3 dark:bg-gray-300 my-3">
                            <div
                                className="h-3 rounded-full relative"
                                style={progressBarStyle}
                            >
                                {/* Icon at the end of the progress bar */}
                                <div
                                    className="absolute right-0 flex items-center gap-1 -mt-9 transform z-10 "
                                    style={{ top: '50%' }}
                                >
                                    {/* <Bomb size={16} className="text-red-600" />  */}
                                    <img src={deadlineKiller} className='w-6' alt="" />
                                </div>

                            </div>
                            <div
                                className="absolute right-0 flex items-center gap-1 -mt-7 transform "
                                style={{ top: '50%' }}
                            >
                                {/* <Bomb size={16} className="text-red-600" />  */}
                                <img src={worker} className='w-6' alt="" />
                            </div>
                            <div className="text-end dark:text-gray-300">{daysLeftDisplay} day left</div>
                        </div>
                        {/* task description */}
                        <div className="">
                            <h2 className='capitalize mb-3 font-semibold text-gray-700 dark:text-gray-100' >task description</h2>
                            {taskDataIsLoading ? <>
                                <div name="task description" id="task description" className='w-full flex flex-col gap-3 outline-dashed outline-2 p-3 max-h-52 rounded-xl overflow-y-auto' >
                                    <div className="h-4 w-full bg-gray-300 rounded-lg animate-pulse"></div>
                                    <div className="h-4 w-1/3 bg-gray-300 rounded-lg animate-pulse"></div>
                                    <div className="h-4 w-2/3 bg-gray-300 rounded-lg animate-pulse"></div>
                                </div>
                            </> :
                                <div name="task description" id="task description" className='w-full outline-dashed dark:outline-gray-300 dark:text-white outline-2 p-3 max-h-52 rounded-xl overflow-y-auto' >{taskData?.data?.data?.task?.description}</div>
                            }
                        </div>
                        {/* assigned to */}
                        <div className="bg-base dark:bg-neutral-800 max-h-96 p-4 rounded-2xl shadow-xl overflow-y-auto">
                            <h2 className='capitalize mb-3 font-semibold text-gray-700 dark:text-gray-100' >assigned to</h2>
                            <div className="flex flex-col flex-wrap gap-3">
                                {selectedTask.members.map((person) => (
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
                                            <p className='dark:text-gray-50' >{person.name} <span className='text-xs text-gray-500 dark:text-gray-400 font-light' >{person.role || '(member)'}</span></p>
                                            <p className='text-xs text-gray-600 dark:text-gray-500' >{person.email || `${person.name.replaceAll(' ', '_')}@gmail.com`}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-[calc(35.333%-8px)] gap-y-6">
                        {/* task notes */}
                        <div className="flex flex-col bg-base dark:bg-neutral-800 p-5 rounded-3xl shadow-xl max-h-96 relative">
                            <h2 className='capitalize ms-4 font-semibold text-gray-700 dark:text-gray-100'>Task Notes</h2>

                            {/* <!-- Make the ol take up the remaining space and be scrollable --> */}
                            <div className="flex-1 p-5 pb-0 overflow-y-auto dark:text-gray-100">
                                {taskData?.data?.data.task.notes.length == 0 ? <>
                                    <div className="text-center">No notes found</div>
                                </> : <>
                                    <ol className="relative border-s border-gray-400 dark:border-gray-700 ">
                                        {taskData?.data?.data.task.notes.map((note) => (
                                            <li key={note.id} className="mb-5 ms-6">
                                                <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 dark:bg-blue-900">
                                                    <div
                                                        className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                                        style={{ backgroundColor: note.user.color }}
                                                        title={note.user.email}
                                                    >
                                                        Y
                                                    </div>
                                                </span>
                                                <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-xs sm:flex dark:bg-gray-700 dark:border-gray-600">
                                                    <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">{formatTimeAgo(note.created_at)}</time>
                                                    <div className="text-sm font-normal text-gray-500 dark:text-gray-300"><span className='font-bold text-black dark:text-white'>{note.user.name}</span> {note.description}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </>}
                            </div>

                            {/* <!-- Fix the input and button at the bottom --> */}
                            <form onSubmit={handleAddNote} className="flex justify-between items-center gap-2 bg-base dark:bg-neutral-800 mt-4 flex-shrink-0">
                                <textarea
                                    placeholder="Add Notes..."
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-light focus:border-light duration-300 resize-none"
                                    rows={1}
                                    style={{ minHeight: '40px', maxHeight: '120px', overflowY: 'auto' }}
                                    value={noteDescription}
                                    onChange={(e) => setNoteDescription(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="p-2 bg-light text-white rounded-lg hover:bg-darkblue h-full aspect-square flex items-center justify-center transition-all"
                                    disabled={addingNote} // Disable button while loading
                                >
                                    {addNoteMutation.isLoading ? 'Adding...' : <Send size={20} />}
                                </button>
                            </form>
                        </div>
                        {/* activity log */}
                        <div className="bg-base dark:bg-neutral-800 ps-10 p-5 rounded-3xl shadow-xl max-h-96 overflow-y-auto" >
                            <h2 className='capitalize mb-2 font-semibold text-gray-700 dark:text-gray-100' >Activity Log</h2>

                            <ol class="relative border-s mt-5 border-gray-400 dark:border-gray-700">
                                <li class="mb-5 ms-6">
                                    <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <div
                                            className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                            style={{ backgroundColor: "#09c" }}
                                            title={"youssef mohammed shafek"}
                                        >
                                            Y
                                        </div>
                                    </span>
                                    <div class="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-xs sm:flex dark:bg-gray-700 dark:border-gray-600">
                                        <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">just now</time>
                                        <div class="text-sm font-normal text-gray-500 dark:text-gray-300">Bonnie moved <a href="#" class="font-semibold text-blue-600 dark:text-blue-500 hover:underline">Jese Leos</a> to <span class="bg-gray-100 text-gray-800 text-xs font-normal me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-600 dark:text-gray-300">Funny Group</span></div>
                                    </div>
                                </li>
                                <li class="mb-5 ms-6">
                                    <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <div
                                            className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                            style={{ backgroundColor: "#d2d" }}
                                            title={"youssef mohammed shafek"}
                                        >
                                            H
                                        </div>
                                    </span>
                                    <div class="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-xs sm:flex dark:bg-gray-700 dark:border-gray-600">
                                        <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">just now</time>
                                        <div class="text-sm font-normal text-gray-500 dark:text-gray-300">Bonnie moved <a href="#" class="font-semibold text-blue-600 dark:text-blue-500 hover:underline">Jese Leos</a> to <span class="bg-gray-100 text-gray-800 text-xs font-normal me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-600 dark:text-gray-300">Funny Group</span></div>
                                    </div>
                                </li>
                                <li class="mb-5 ms-6">
                                    <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <div
                                            className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                            style={{ backgroundColor: "#283" }}
                                            title={"youssef mohammed shafek"}
                                        >
                                            K
                                        </div>
                                    </span>
                                    <div class="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-xs sm:flex dark:bg-gray-700 dark:border-gray-600">
                                        <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">just now</time>
                                        <div class="text-sm font-normal text-gray-500 dark:text-gray-300">Bonnie moved <a href="#" class="font-semibold text-blue-600 dark:text-blue-500 hover:underline">Jese Leos</a> to <span class="bg-gray-100 text-gray-800 text-xs font-normal me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-600 dark:text-gray-300">Funny Group</span></div>
                                    </div>
                                </li>


                            </ol>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </>
}
