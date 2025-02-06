import React, { useContext, useState, useMemo } from 'react';
import { projectContext } from '../../context/ProjectsContext';
import { MousePointerClick, Plus, Trash2, Copy, UserRoundPlus, LogOut, Edit, Loader2Icon, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { TeamsContext } from '../../context/TeamsContext';
import TasksTable from '../../components/TasksTable/TasksTable';
import FilterBar from '../../components/FilterBar/FilterBar'; // Import the FilterBar component

export default function MyTasks() {
    let { selectedProject, setselectedProject } = useContext(projectContext);
    let { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchTag, setSearchTag] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [sortPriority, setSortPriority] = useState('');
    const [sortDeadline, setSortDeadline] = useState('');
    const [filterState, setFilterState] = useState('');
    const token = localStorage.getItem('userToken');
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Get user tasks function
    function getUserTasks() {
        return axios.get(`https://brainmate.fly.dev/api/v1/tasks`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // Get user tasks query
    let { data: userTasks, isError, isRefetching: refetchingTasks } = useQuery({
        queryKey: ['userTasks'],
        queryFn: getUserTasks,
    });

    // Invalidate the userTasks query when tasks are added, updated, or deleted
    const invalidateUserTasks = () => {
        queryClient.invalidateQueries(['userTasks']);
    };

    // Handle search, filter, and sort
    const handleSearch = (name, tag) => {
        setSearchName(name);
        setSearchTag(tag);
    };

    const handleFilter = (priority) => {
        setFilterPriority(priority);
    };

    const handleSort = (type, order) => {
        if (type === 'priority') {
            setSortPriority(order);
            setSortDeadline('');
        } else if (type === 'deadline') {
            setSortDeadline(order);
            setSortPriority('');
        }
    };

    const handleStateFilter = (state) => {
        setFilterState(state);
    };

    // Filter and sort tasks
    const filteredAndSortedTasks = useMemo(() => {
        let tasks = userTasks?.data?.data?.tasks || [];

        // Filter by assigned_to_me
        tasks = tasks.filter(task => task.assigned_to_me === true);

        // Filter by name
        if (searchName) {
            tasks = tasks.filter(task => task.name.toLowerCase().includes(searchName.toLowerCase()));
        }

        // Filter by tag
        if (searchTag) {
            tasks = tasks.filter(task => task.tags.toLowerCase().includes(searchTag.toLowerCase()));
        }

        // Filter by priority
        if (filterPriority) {
            tasks = tasks.filter(task => task.priority === filterPriority);
        }

        // Filter by state
        if (filterState) {
            tasks = tasks.filter(task => task.status === filterState);
        }

        // Sort by priority
        if (sortPriority) {
            tasks = tasks.sort((a, b) => {
                const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                return sortPriority === 'asc' ? priorityOrder[a.priority] - priorityOrder[b.priority] : priorityOrder[b.priority] - priorityOrder[a.priority];
            });
        }

        // Sort by deadline
        if (sortDeadline) {
            tasks = tasks.sort((a, b) => {
                const deadlineA = new Date(a.deadline);
                const deadlineB = new Date(b.deadline);
                return sortDeadline === 'asc' ? deadlineA - deadlineB : deadlineB - deadlineA;
            });
        }

        return tasks;
    }, [userTasks, searchName, searchTag, filterPriority, sortPriority, sortDeadline, filterState]);

    return (
        <div className="p-5">
            <div className="flex sticky top-12 bg-white p-5 z-[49] justify-between items-center mb-0 h-16">
                <div className='text-light font-semibold flex w-full justify-center items-center'>
                    <div className="ps-1 cursor-pointer">My Tasks</div>
                </div>
                <div className="flex gap-2">
                    {refetchingTasks && <div className="flex items-center text-blue-500"><Loader2Icon className='animate-spin' /></div>}
                </div>
            </div>
            <div className="md:p-5">
                <FilterBar
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                    onSort={handleSort}
                    onStateFilter={handleStateFilter}
                />
                {userTasks?.data?.data && (
                    <div className="space-y-6">
                        <div>
                            <div className="px-3 py-1 text-white my-3 bg-pending w-fit rounded-lg">pending</div>
                            <TasksTable tasks={filteredAndSortedTasks.filter((task) => Number(task.status) === 1)} />
                        </div>
                        <div>
                            <div className="px-3 py-1 text-white my-3 bg-in_progress w-fit rounded-lg">in progress</div>
                            <TasksTable tasks={filteredAndSortedTasks.filter((task) => Number(task.status) === 2)} />
                        </div>
                        <div>
                            <div className="px-3 py-1 text-white my-3 bg-completed w-fit rounded-lg">completed</div>
                            <TasksTable tasks={filteredAndSortedTasks.filter((task) => Number(task.status) === 3)} />
                        </div>
                        <div>
                            <div className="px-3 py-1 text-white my-3 bg-cancelled w-fit rounded-lg">cancelled</div>
                            <TasksTable tasks={filteredAndSortedTasks.filter((task) => Number(task.status) === 4)} />
                        </div>
                        <div>
                            <div className="px-3 py-1 text-white my-3 bg-on_hold w-fit rounded-lg">on hold</div>
                            <TasksTable tasks={filteredAndSortedTasks.filter((task) => Number(task.status) === 5)} />
                        </div>
                        <div>
                            <div className="px-3 py-1 text-white my-3 bg-in_review w-fit rounded-lg">in review</div>
                            <TasksTable tasks={filteredAndSortedTasks.filter((task) => Number(task.status) === 6)} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}