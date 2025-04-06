import React, { useContext, useEffect, useState } from 'react';
import { projectContext } from '../../context/ProjectsContext';
import { TeamsContext } from '../../context/TeamsContext';
import { Bot, BringToFront, Calendar, ChevronRight, Clock, Edit, MousePointerClick, Plus, Trash, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@heroui/tooltip';
import TaskFormWithDuration from '../../components/TaskFormWithDuration/TaskFormWithDuration';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskContext } from '../../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Backlog() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    let { selectedTask, setselectedTask } = useContext(TaskContext);
    const { selectedProject, setselectedProject } = useContext(projectContext);
    const { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const [checkedTasks, setcheckedTasks] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [floatingTask, setFloatingTask] = useState(null);
    const token = localStorage.getItem('userToken');

    // Fetch team members
    function getTeamMembers() {
        return axios.get(
            `https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}/users`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }

    // Fetch backlog tasks
    function getBacklogTasks() {
        return axios.get(
            `https://brainmate.fly.dev/api/v1/tasks/teams/${selectedTeam.id}/backlog`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }

    // Queries
    const { data: teamMembersData, isLoading: isTeamMembersLoading } = useQuery({
        queryKey: ['teamMembers', selectedTeam?.id],
        queryFn: getTeamMembers,
        enabled: !!selectedTeam,
    });

    const {
        data: tasksData,
        isLoading: isTasksLoading,
        isError: isTasksError,
        refetch: refetchTasks
    } = useQuery({
        queryKey: ['backlogTasks', selectedTeam?.id],
        queryFn: getBacklogTasks,
        enabled: !!selectedTeam,
    });

    // Mutations
    const publishMutation = useMutation({
        mutationFn: async (taskIds) => {
            const response = await axios.post(
                'https://brainmate.fly.dev/api/v1/tasks/backlog/publish-bulk',
                {
                    task_ids: taskIds,
                    team_id: selectedTeam.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success('Tasks published successfully');
            setcheckedTasks([]);
            queryClient.invalidateQueries(['backlogTasks']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to publish tasks');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (taskIds) => {
            const response = await axios.post(
                'https://brainmate.fly.dev/api/v1/tasks/backlog/delete-bulk',
                {
                    task_ids: taskIds,
                    team_id: selectedTeam.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success('Tasks deleted successfully');
            setcheckedTasks([]);
            queryClient.invalidateQueries(['backlogTasks']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete tasks');
        }
    });

    // Handlers
    const handleCheckboxChange = (id) => {
        setcheckedTasks(prev =>
            prev.includes(id) ? prev.filter(taskId => taskId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (checkedTasks.length === tasksData?.length) {
            setcheckedTasks([]);
        } else {
            setcheckedTasks(tasksData?.data.data.backlog_tasks.map(task => task.id) || []);
        }
    };

    const editTask = (task) => {
        setselectedTask(task);
        setIsFormOpen(true);
    };

    const handleRowClick = (task) => {
        setFloatingTask(task);
    };

    const handleCloseFloatingTask = () => {
        setFloatingTask(null);
    };

    const handlePublishTasks = () => {
        if (checkedTasks.length === 0) {
            toast.error('Please select at least one task to publish');
            return;
        }
        publishMutation.mutate(checkedTasks);
    };

    const handleDeleteTasks = () => {
        if (checkedTasks.length === 0) {
            toast.error('Please select at least one task to delete');
            return;
        }
        if (confirm('Are you sure you want to delete the selected tasks?')) {
            deleteMutation.mutate(checkedTasks);
        }
    };

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

    if (isTasksLoading) {
        return (
            <div className="h-[calc(100vh-48px)] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-light"></div>
            </div>
        );
    }

    if (isTasksError) {
        return (
            <div className="h-[calc(100vh-48px)] flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                    <X size={35} className='text-red-500' />
                    <h2 className='capitalize'>Failed to load tasks</h2>
                    <button
                        onClick={() => refetchTasks()}
                        className="px-4 py-2 bg-light text-white rounded hover:bg-opacity-90"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="p-5">
                <div className="flex flex-col border-b lg:flex-row sticky top-12 bg-white dark:bg-dark p-3 md:p-5 z-[49] justify-between md:items-center gap-3 mb-5 min-h-16 ">
                    {/* Breadcrumb Navigation */}
                    <div className='text-gray-400 flex items-center flex-wrap'>
                        <div onClick={() => { navigate('/project'); setselectedTeam(null); }} className="pe-1 cursor-pointer">{selectedProject?.name}</div>
                        <ChevronRight strokeWidth={0.7} />
                        <div onClick={() => { navigate('/project/team'); }} className="px-1 cursor-pointer">{selectedTeam?.name}</div>
                        <ChevronRight strokeWidth={0.7} />
                        <div className="px-1 cursor-pointer text-black dark:text-white">Backlog</div>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-2">
                        <Tooltip closeDelay={0} delay={350} content='Generate with AI'>
                            <button
                                onClick={() => { }}
                                className="rounded-full aspect-square text-highlight p-2 flex justify-center items-center hover:shadow-lg hover:-translate-y-0.5 transition-all bg-base dark:bg-dark2">
                                <Bot />
                            </button>
                        </Tooltip>
                        <Tooltip closeDelay={0} delay={350} content='Delete Tasks'>
                            <button
                                onClick={handleDeleteTasks}
                                disabled={deleteMutation.isPending}
                                className="rounded-full aspect-square bg-base dark:bg-dark2 text-red-500 p-2 flex justify-center items-center hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? (
                                    <div className="animate-spin h-5 w-5 border-2 border-red-500 rounded-full border-t-transparent"></div>
                                ) : (
                                    <Trash2 />
                                )}
                            </button>
                        </Tooltip>
                        <Tooltip closeDelay={0} delay={350} content='Add task'>
                            <button
                                onClick={() => {
                                    setselectedTask(null);
                                    setIsFormOpen(true);
                                }}
                                className="rounded-full aspect-square bg-base dark:bg-dark2 text-blue-500 p-2 flex justify-center items-center hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                <Plus size={25} />
                            </button>
                        </Tooltip>
                        <Tooltip closeDelay={0} delay={350} content='Commit Tasks'>
                            <button
                                onClick={handlePublishTasks}
                                disabled={publishMutation.isPending}
                                className="rounded-full dark:bg-light text-white bg-light py-1 px-2 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                {publishMutation.isPending ? 'Publishing...' : 'Commit Tasks'}
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Task Table */}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg scrollbar-hide">
                    <table className='w-full rounded-xl overflow-hidden text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-dark1 dark:bg-opacity-50 dark:text-gray-400">
                            <th>
                                <input
                                    type="checkbox"
                                    checked={checkedTasks.length === tasksData?.length && tasksData?.length > 0}
                                    onChange={handleSelectAll}
                                    className='h-5 w-5 text-blue-600 ms-5 focus:ring-0 rounded-md cursor-pointer dark:bg-dark2'
                                />
                            </th>
                            {["Task Name", "Assigned to", "Duration", "Priority", "Tags"].map((header, index) => (
                                <th key={index} scope="col" className="px-6 py-3 whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                            <th className='w-fit'>Update</th>
                        </thead>
                        <tbody>
                            {tasksData?.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        No tasks found in backlog
                                    </td>
                                </tr>
                            ) : (
                                tasksData?.data.data.backlog_tasks.map((task) => (
                                    <tr
                                        key={task.id}
                                        onClick={() => handleRowClick(task)}
                                        className={`bg-white border-b dark:bg-dark1 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-opacity-80 duration-150`}
                                    >
                                        <td onClick={(e) => { e.stopPropagation(); handleCheckboxChange(task.id) }}>
                                            <input
                                                type="checkbox"
                                                checked={checkedTasks.includes(task.id)}
                                                onChange={() => handleCheckboxChange(task.id)}
                                                className='h-5 w-5 text-blue-600 ms-5 focus:ring-0 rounded-md cursor-pointer dark:bg-dark2'
                                            />
                                        </td>
                                        <th scope="row" className="min-w-40 flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                            {task.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            <div className="flex -space-x-2 max-w-[200px] overflow-hidden px-2">
                                                {task.members?.slice(0, 5).map((person) => (
                                                    <Tooltip key={person.id} content={person.name} delay={0} closeDelay={0}>
                                                        <div
                                                            className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                                            style={{ backgroundColor: person.color || '#09c' }}
                                                        >
                                                            {person.name[0]}
                                                        </div>
                                                    </Tooltip>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Clock className="mr-2" color="#faca15" />
                                                {task.duration} {task.duration === 1 ? 'day' : 'days'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <BringToFront className="mr-2" color="#19f" />
                                                {task.priority}
                                            </div>
                                        </td>
                                        <Tooltip content={task.tags} closeDelay={0} delay={350}>
                                            <td className="px-6 py-4 max-w-52 overflow-hidden whitespace-nowrap">{task.tags}</td>
                                        </Tooltip>
                                        <td>
                                            <button onClick={(e) => { e.stopPropagation(); editTask(task); }}>
                                                <Edit color='#e3a008' />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Floating Task Details Modal */}
                <AnimatePresence>
                    {floatingTask && (
                        <motion.div
                            id="floating-div"
                            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-15 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setFloatingTask(null)}
                        >
                            <motion.div
                                className="bg-white dark:bg-dark1 rounded-lg shadow-lg border p-6 w-5/6 md:w-2/3 relative max-h-[95vh] overflow-y-auto "
                                initial={{ y: 0, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={handleCloseFloatingTask}
                                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-500"
                                >
                                    <X size={24} />
                                </button>
                                <h2 className="text-xl font-bold mb-4 text-center">{floatingTask.name}</h2>
                                <div className="space-y-4">
                                    <p><strong>Description:</strong> {floatingTask.description}</p>
                                    <p><strong>Duration:</strong> {floatingTask.duration} {floatingTask.duration === 1 ? 'day' : 'days'}</p>
                                    <p><strong>Priority:</strong> {floatingTask.priority}</p>
                                    <p><strong>Tags:</strong> {floatingTask.tags}</p>
                                    <p><strong>Assigned To:</strong></p>
                                    <div className="flex flex-col gap-3 max-h-52 overflow-auto bg-base dark:bg-dark2 p-3 rounded-lg">
                                        {floatingTask.members?.map((member) => (
                                            <div key={member.id} className="flex gap-2 border-b pb-2 border-b-gray-300 dark:border-b-gray-700">
                                                <Tooltip content={member.name} delay={0} closeDelay={0}>
                                                    <div
                                                        className="w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default"
                                                        style={{ backgroundColor: member.color || '#09c' }}
                                                    >
                                                        {member.name[0]}
                                                    </div>
                                                </Tooltip>
                                                <div className="flex flex-col">
                                                    <h2>{member.name}</h2>
                                                    <h2 className='text-xs opacity-75'>{member.email}</h2>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Task Form Modal */}
                <TaskFormWithDuration
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    selectedTeam={selectedTeam}
                    token={token}
                    teamMembers={teamMembersData.data.data}
                    mode={selectedTask ? 'update' : 'add'}
                    taskData={selectedTask}
                />
            </div>
        </>
    );
}