import React, { useContext, useState, useMemo, useEffect } from 'react';
import { projectContext } from '../../context/ProjectsContext';
import { MousePointerClick, Plus, Trash2, Copy, UserRoundPlus, LogOut, Edit, Loader2Icon, Settings, ChevronDown, ChevronRight, MessageCircleMore, ListTodo, X, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { TeamsContext } from '../../context/TeamsContext';
import LeaveTeamForm from '../../components/LeaveTeamForm/LeaveTeamForm';
import DeleteTeamForm from '../../components/DeleteTeamForm/DeleteTeamForm';
import UpdateTeamForm from '../../components/UpdateTeamForm/UpdateTeamForm';
import InviteMemberForm from '../../components/InviteMemberForm/InviteMemberForm';
import AddTaskForm from '../../components/AddTaskForm/AddTaskForm';
import TasksTable from '../../components/TasksTable/TasksTable';
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import FilterBar from '../../components/FilterBar/FilterBar'; // Import the FilterBar component
import { Tooltip } from '@heroui/tooltip';
import { ChatContext } from '../../context/ChatContext';

export default function Team() {
    let { selectedProject, setselectedProject } = useContext(projectContext);
    const { selectedChat, setselectedChat } = useContext(ChatContext)
    let { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const [teamOptionsDropdown, setteamOptionsDropdown] = useState(false)
    const [deleteTeamForm, setDeleteTeamForm] = useState(false);
    const [leaveTeamForm, setLeaveTeamForm] = useState(false);
    const [updateTeamForm, setUpdateTeamForm] = useState(false);
    const [inviteMemberForm, setInviteMemberForm] = useState(false);
    const [addTaskForm, setAddTaskForm] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchTag, setSearchTag] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [sortPriority, setSortPriority] = useState('');
    const [sortDeadline, setSortDeadline] = useState('');
    const [filterState, setFilterState] = useState('');
    const [teamInfo, setteamInfo] = useState(false)
    const token = localStorage.getItem('userToken');
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Get team details function
    function getTeamDetails() {
        return axios.get(`https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // Get team details query
    let { data: teamData, isLoading: isTeamLoading, error: teamError, isError: TeamDataError, refetch: refetchTeamDetails } = useQuery({
        queryKey: ['teamDetails', selectedTeam?.id],
        queryFn: getTeamDetails,
        enabled: !!selectedTeam,
    });

    // Get team members function
    function getTeamMembers() {
        if (teamData?.data?.data?.team.role !== 'member')
            return axios.get(`https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    }

    // Get team members query
    let { data: teamMembers, refetch: refetchTeamMembers } = useQuery({
        queryKey: ['teamMembers', selectedTeam?.id],
        queryFn: getTeamMembers,
        enabled: !!selectedTeam,

    });

    // Get team tasks function
    function getTeamTasks() {
        return axios.get(`https://brainmate.fly.dev/api/v1/tasks/teams/${selectedTeam.id}/tasks`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // Get team tasks query
    let { data: teamTasks, isError: isTasksError, isRefetching: refetchingTasks, error: TasksError, refetch: refetchTeamTasks } = useQuery({
        queryKey: ['teamTasks', selectedTeam?.id],
        queryFn: getTeamTasks,
        enabled: !!selectedTeam,
    });

    // Invalidate the teamTasks query when tasks are added, updated, or deleted
    const invalidateTeamTasks = () => {
        queryClient.invalidateQueries(['teamTasks', selectedTeam?.id]);
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
        let tasks = teamTasks?.data?.data?.tasks || [];

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
    }, [teamTasks, searchName, searchTag, filterPriority, sortPriority, sortDeadline, filterState]);


    if (TeamDataError) {
        return <div className="text-center py-5 h-[90vh] flex items-center justify-center">
            Oops!, {teamError?.response?.data?.message}
        </div>
    } else if (isTasksError) {
        return <div className="text-center py-5 h-[90vh] flex items-center justify-center">
            Oops!, {TasksError?.response?.data?.message}
        </div>
    }

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

    return (
        <>
            <LeaveTeamForm isOpen={leaveTeamForm} onClose={() => setLeaveTeamForm(false)} selectedTeam={selectedTeam} setselectedTeam={setselectedTeam} />
            <DeleteTeamForm isOpen={deleteTeamForm} onClose={() => setDeleteTeamForm(false)} selectedTeam={selectedTeam} setselectedTeam={setselectedTeam} />
            <UpdateTeamForm isOpen={updateTeamForm} onClose={() => setUpdateTeamForm(false)} selectedTeam={selectedTeam} setselectedTeam={setselectedTeam} />
            <InviteMemberForm isOpen={inviteMemberForm} onClose={() => setInviteMemberForm(false)} selectedTeam={selectedTeam} />
            <AddTaskForm
                isOpen={addTaskForm}
                onClose={() => {
                    setAddTaskForm(false);
                    invalidateTeamTasks();
                }}
                selectedTeam={selectedTeam}
                token={token}
                teamMembers={teamMembers}
                mode="add"
            />
            <AnimatePresence>
                {teamInfo && (
                    <motion.div
                        id="floating-div"
                        className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-15 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setteamInfo(false)}
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
                                onClick={() => setteamInfo(false)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-500"
                            >
                                <X size={24} />
                            </button>

                            <div className="space-y-2">
                                <p><strong>Description:</strong></p>
                                <div className="max-h-52 overflow-auto bg-base dark:bg-dark2 p-3 rounded-lg">
                                    {teamData?.data?.data?.team?.description && <>
                                        {teamData?.data?.data?.team?.description?.split(`\n`).map((line, lineIndex) => (
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
                                    </>}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isTeamLoading ? (
                <div className="p-5 ">
                    <div className="flex justify-between items-center mb-5 border-b h-16 p-5">
                        <div className='text-gray-400 flex items-center'>
                            <div onClick={() => { navigate('/project'); setselectedTeam(null) }} className="pe-1 cursor-pointer">{selectedProject?.name}</div><ChevronRight strokeWidth={0.7} /><div className="ps-1 cursor-pointer">{selectedTeam?.name}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse"></div>
                            <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-5">
                    <div className="flex flex-col border-b lg:flex-row sticky top-12 bg-white dark:bg-dark p-3 md:p-5 z-[49] justify-between md:items-center gap-3 mb-5 min-h-16">
                        <div className='text-gray-400 flex items-center '>
                            <div onClick={() => { navigate('/project'); setselectedTeam(null) }} className="pe-1 cursor-pointer">{selectedProject?.name}</div><ChevronRight strokeWidth={0.7} /><div className="ps-1 cursor-pointer text-black dark:text-white ">{selectedTeam?.name}</div>
                            {refetchingTasks && <div className="md:hidden flex items-center text-blue-500"><Loader2Icon className='animate-spin' /></div>}
                        </div>
                        <div className="hidden md:flex flex-wrap justify-center gap-2">
                            {refetchingTasks && <div className="md:flex hidden items-center text-blue-500"><Loader2Icon className='animate-spin' /></div>}
                            {teamData?.data?.data?.team.role !== 'member' && (<>
                                <div
                                    className="flex md:w-fit justify-between items-center gap-2 p-2 bg-gray-100 dark:bg-dark1 dark:text-white rounded-lg cursor-pointer hover:bg-gray-200"
                                    onClick={() => {
                                        navigator.clipboard.writeText(teamData?.data?.data?.team.team_code);
                                        toast.success('added to clipboard', {
                                            duration: 2000,
                                            position: 'bottom-right',
                                        });
                                    }}
                                >
                                    <span className="text-black dark:text-white hidden md:block">{teamData?.data?.data?.team.team_code}</span>
                                    <Copy size={18} className="text-gray-500" />
                                </div>
                                <Tooltip delay={100} closeDelay={0} content='Invite member' >
                                    <button onClick={() => setInviteMemberForm(true)} className="rounded-full bg-base dark:bg-dark2 text-red-600 p-2 hover:shadow-lg hover:-translate-y-0.5 h-full aspect-square transition-all"><UserRoundPlus size={25} /></button>
                                </Tooltip>
                                <Tooltip delay={100} closeDelay={0} content='Chat'>
                                    <div onClick={(e) => {
                                        navigate('/chat');
                                        e.stopPropagation();
                                        setselectedChat({
                                            'id': teamData?.data?.data?.team.id,
                                            'name': teamData?.data?.data?.team.name,
                                            'project': {
                                                'name': teamData?.data?.data?.team.project_name
                                            }
                                        })
                                    }} className="bg-base text-darkblue dark:text-white dark:bg-dark2 flex justify-center p-2 rounded-full space-x-2 items-center h-full hover:scale-110 transition-all cursor-pointer">
                                        <button onClick={() => navigate('/chat')} ><MessageCircleMore /></button>
                                    </div>
                                </Tooltip>
                                <Tooltip delay={100} closeDelay={0} content='Manage team members'>
                                    <button
                                        onClick={() => navigate('/project/team/manage-members')}
                                        className="rounded-full bg-base dark:bg-dark2 text-green-500 p-2 h-full aspect-square hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                    >
                                        <Settings size={25} />
                                    </button>
                                </Tooltip>
                                <Tooltip delay={100} closeDelay={0} content='Backlog' >
                                    <button onClick={() => navigate(`/project/team/backlog/${selectedTeam.id}`)} className="rounded-full bg-base dark:bg-dark2  text-light p-2 h-full aspect-square hover:shadow-lg hover:-translate-y-0.5 transition-all"><ListTodo size={25} /></button>
                                </Tooltip>
                                <Tooltip delay={100} closeDelay={0} content='Add task' >
                                    <button onClick={() => setAddTaskForm(true)} className="rounded-full bg-base dark:bg-dark2 text-blue-500 p-2 hover:shadow-lg hover:-translate-y-0.5 h-full aspect-square transition-all"><Plus size={25} /></button>
                                </Tooltip>
                                <Tooltip delay={100} closeDelay={0} content='Update team name' >
                                    <button onClick={() => setUpdateTeamForm(true)} className="rounded-full bg-base dark:bg-dark2 text-yellow-400 p-2 hover:shadow-lg hover:-translate-y-0.5 h-full aspect-square transition-all"><Edit size={25} /></button>
                                </Tooltip>
                                <Tooltip delay={100} closeDelay={0} content='Delete team' >
                                    <button onClick={() => setDeleteTeamForm(true)} className="rounded-full bg-base dark:bg-dark2 text-red-600 p-2 hover:shadow-lg hover:-translate-y-0.5 h-full aspect-square transition-all"><Trash2 size={25} /></button>
                                </Tooltip>
                            </>)}
                            <Tooltip delay={100} closeDelay={0} content='Leave team' >
                                <button onClick={() => setLeaveTeamForm(true)} className="rounded-full bg-base dark:bg-dark2 text-red-600 p-2 hover:shadow-lg hover:-translate-y-0.5 h-full aspect-square transition-all"><LogOut size={25} /></button>
                            </Tooltip>
                            <Tooltip delay={100} closeDelay={0} content='Info' >
                                <button onClick={() => setteamInfo(true)} className="rounded-full bg-base dark:bg-dark2 text-gray-700 dark:text-gray-200 p-2 hover:shadow-lg hover:-translate-y-0.5 h-full aspect-square transition-all"><Info size={25} /></button>
                            </Tooltip>
                        </div>

                        <div className="absolute top-6 right-0 ms-auto md:hidden flex">
                            <button onClick={() => setteamOptionsDropdown(!teamOptionsDropdown)} className='flex justify-end bg-gray-300 dark:bg-dark2 rounded-full p-1.5'>
                                <ChevronDown />
                            </button>
                            <AnimatePresence>
                                {teamOptionsDropdown && (
                                    <motion.div
                                        className="absolute flex flex-col top-full right-0 justify-center gap-2 bg-white dark:bg-dark1 p-3 rounded-xl overflow-hidden"
                                        initial={{ opacity: 0, y: -20 }} // Initial state (hidden)
                                        animate={{ opacity: 1, y: 0 }}   // Animate to visible state
                                        exit={{ opacity: 0, y: -20 }}    // Animate to hidden state
                                        transition={{ duration: 0.3 }}   // Animation duration
                                    >
                                        {refetchingTasks && <div className="md:flex hidden items-center text-blue-500"><Loader2Icon className='animate-spin' /></div>}
                                        {teamData?.data?.data?.team.role !== 'member' && (<>
                                            <div
                                                className="flex md:w-fit justify-between items-center gap-2 p-2 bg-gray-100 dark:bg-dark1 rounded-lg cursor-pointer hover:bg-gray-200"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(teamData?.data?.data?.team.team_code);
                                                    toast.success('added to clipboard', {
                                                        duration: 2000,
                                                        position: 'bottom-right',
                                                    });
                                                }}
                                            >
                                                <span className="text-black hidden md:block">{teamData?.data?.data?.team.team_code}</span>
                                                <Copy size={18} className="text-gray-500" />
                                            </div>
                                            <button onClick={() => setInviteMemberForm(true)} title='invite member to team' className="rounded-full bg-white dark:bg-dark1 text-red-600 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><UserRoundPlus size={25} /></button>
                                            <div onClick={(e) => {
                                                navigate('/chat');
                                                e.stopPropagation();
                                                setselectedChat({
                                                    'id': teamData?.data?.data?.team.id,
                                                    'name': teamData?.data?.data?.team.name,
                                                    'project': {
                                                        'name': teamData?.data?.data?.team.project_name
                                                    }
                                                })
                                            }} className="">
                                                <button onClick={() => navigate('/chat')} className='text-light dark:text-white p-1 rounded-full items-center hover:scale-110 transition-all' ><MessageCircleMore /></button>
                                            </div>
                                            {teamData?.data?.data?.team.role === 'manager' && <>
                                                <button title='manage team members'
                                                    onClick={() => navigate('manage-members')}
                                                    className="rounded-full bg-white dark:bg-dark1 text-green-500 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                                >
                                                    <Settings size={25} />
                                                </button>
                                                <button onClick={() => setDeleteTeamForm(true)} title='delete team' className="rounded-full bg-white dark:bg-dark1 text-red-600 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Trash2 size={25} /></button>
                                            </>}
                                            <Tooltip delay={350} closeDelay={0} content='Backlog' >
                                                <button onClick={() => navigate(`backlog/${selectedTeam.id}`)} className="rounded-full text-light p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><ListTodo size={25} /></button>
                                            </Tooltip>
                                            <button onClick={() => setAddTaskForm(true)} title='add task' className="rounded-full bg-white dark:bg-dark1 text-blue-500 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Plus size={25} /></button>
                                            <button onClick={() => setUpdateTeamForm(true)} title='update team name' className="rounded-full bg-white dark:bg-dark1 text-yellow-400 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Edit size={25} /></button>
                                        </>)}
                                        <button onClick={() => setteamInfo(true)} className="rounded-full text-gray-700 dark:text-gray-200 p-1 hover:shadow-lg hover:-translate-y-0.5 h-full aspect-square transition-all"><Info size={25} /></button>
                                        <button onClick={() => setLeaveTeamForm(true)} className="rounded-full bg-white dark:bg-dark1 text-red-600 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><LogOut size={25} /></button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className="md:p-5">
                        <FilterBar
                            onSearch={handleSearch}
                            onFilter={handleFilter}
                            onSort={handleSort}
                            onStateFilter={handleStateFilter}
                        />
                        {teamTasks?.data?.data && (
                            <div className="space-y-6">
                                {(filterState == '' || filterState == 1) && <div>
                                    <div className="px-3 py-1 text-white my-3 bg-pending w-fit rounded-lg">pending</div>
                                    <TasksTable tasks={filteredAndSortedTasks.filter((task) => Number(task.status) === 1)} />
                                </div>}
                                {(filterState == '' || filterState == 2) && <div>
                                    <div className="px-3 py-1 text-white my-3 bg-in_progress w-fit rounded-lg">in progress</div>
                                    <TasksTable tasks={filteredAndSortedTasks.filter((task) => Number(task.status) === 2)} />
                                </div>}
                                {(filterState == '' || filterState == 3) && <div>
                                    <div className="px-3 py-1 text-white my-3 bg-completed w-fit rounded-lg">completed</div>
                                    <TasksTable tasks={filteredAndSortedTasks.filter((task) => Number(task.status) === 3)} />
                                </div>}
                                {(filterState == '' || filterState == 4) && <div>
                                    <div className="px-3 py-1 text-white my-3 bg-cancelled w-fit rounded-lg">cancelled</div>
                                    <TasksTable tasks={filteredAndSortedTasks.filter((task) => Number(task.status) === 4)} />
                                </div>}
                                {(filterState == '' || filterState == 5) && <div>
                                    <div className="px-3 py-1 text-white my-3 bg-on_hold w-fit rounded-lg">on hold</div>
                                    <TasksTable tasks={filteredAndSortedTasks.filter((task) => Number(task.status) === 5)} />
                                </div>}
                                {(filterState == '' || filterState == 6) && <div>
                                    <div className="px-3 py-1 text-white my-3 bg-in_review w-fit rounded-lg">in review</div>
                                    <TasksTable tasks={filteredAndSortedTasks.filter((task) => Number(task.status) === 6)} />
                                </div>}

                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}