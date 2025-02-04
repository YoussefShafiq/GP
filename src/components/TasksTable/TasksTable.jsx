import React, { useContext, useState } from 'react';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BringToFront, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { TeamsContext } from '../../context/TeamsContext';

export default function TasksTable({ tasks = [] }) {
    let { selectedTeam } = useContext(TeamsContext);
    const queryClient = useQueryClient();
    const token = localStorage.getItem('userToken');

    const [loadingTaskId, setLoadingTaskId] = useState(null); // Track loading state per task

    async function handleStatusChange(taskId, newStatus) {
        setLoadingTaskId(taskId); // Disable select for this task
        try {
            const response = await axios.put(
                `https://brainmate.fly.dev/api/v1/tasks/${taskId}/status`,
                { status: `${newStatus}` },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            queryClient.invalidateQueries(['teamTasks', selectedTeam?.id]);

            toast.success(response.data.message, {
                duration: 2000,
                position: 'bottom-right',
            });
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Error changing task status', {
                duration: 3000,
                position: 'bottom-right',
            });
        } finally {
            setLoadingTaskId(null); // Re-enable select after response
        }
    }

    return (
        <div className="relative md:overflow-visible overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {["Task Name", "Assigned to", "Deadline", "Priority", "Status", "Tags"].map((header, index) => (
                            <th key={index} scope="col" className="px-6 py-3 whitespace-nowrap">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="bg-white border-b dark:bg-white dark:bg-opacity-5 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <th scope="row" className="min-w-40 flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                {task.name}
                            </th>
                            <td className="px-6 py-4">
                                <div className="flex -space-x-2 max-w-[200px] overflow-hidden px-2">
                                    {task.members.slice(0, 5).map((person, personIndex) => (
                                        <div
                                            key={personIndex}
                                            className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                            style={{ backgroundColor: person.color }}
                                            title={person.name}
                                        >
                                            {person.name[0]}
                                        </div>
                                    ))}
                                    {task.members.length > 5 && (
                                        <div className="w-6 h-6 flex items-center justify-center text-white bg-gray-400 drop-shadow-xl rounded-full uppercase cursor-default"
                                            title={`+${task.members.length - 5} more`}>
                                            +{task.members.length - 5}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <Calendar className="mr-2" color="red" />
                                    {task.deadline.substring(0, 10).replaceAll('-', '/')}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <BringToFront className="mr-2" color="#19f" />
                                    {task.priority}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    className="text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-1"
                                    value={Number(task.status)}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    disabled={loadingTaskId === task.id} // Disable when updating
                                >
                                    {[
                                        { value: 1, label: 'pending' },
                                        { value: 2, label: 'in_progress' },
                                        { value: 3, label: 'completed' },
                                        { value: 4, label: 'cancelled' },
                                        { value: 5, label: 'on_hold' },
                                        { value: 6, label: 'in_review' },
                                    ].map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label.replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-6 py-4 max-w-52 overflow-hidden whitespace-nowrap">{task.tags}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
