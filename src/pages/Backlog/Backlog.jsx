import React, { useContext, useEffect, useState } from 'react';
import { projectContext } from '../../context/ProjectsContext';
import { TeamsContext } from '../../context/TeamsContext';
import { Bot, BringToFront, Calendar, ChevronRight, Clock, Edit, MousePointerClick, Plus, Trash, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@heroui/tooltip';
import TaskFormWithDuration from '../../components/TaskFormWithDuration/TaskFormWithDuration';
import { useQuery } from '@tanstack/react-query';
import { TaskContext } from '../../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion


export default function Backlog() {
    const navigate = useNavigate();
    let { selectedTask, setselectedTask } = useContext(TaskContext);
    const { selectedProject, setselectedProject } = useContext(projectContext);
    const { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const [checkedTasks, setcheckedTasks] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [floatingTask, setFloatingTask] = useState(null); // State to track the task for the floating design
    const token = localStorage.getItem('userToken');

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

    const tasks = [
        {
            id: 1,
            name: "Design Homepage",
            description: "Create a visually appealing and user-friendly homepage design for the website.",
            members: [
                { id: 101, name: "Youssef Shafek", email: "youssef@example.com", color: "#09c" },
                { id: 102, name: "Alice Johnson", email: "alice@example.com", color: "#f06" },
            ],
            duration: 3,
            priority: "High",
            tags: "UI/UX, Design",
        },
        {
            id: 2,
            name: "Implement API Endpoints",
            description: "Develop and integrate RESTful API endpoints for the backend system.",
            members: [
                { id: 103, name: "Bob Smith", email: "bob@example.com", color: "#0c9" },
            ],
            duration: 5,
            priority: "Medium",
            tags: "Backend, API",
        },
        {
            id: 3,
            name: "Write Unit Tests",
            description: "Write comprehensive unit tests to ensure code quality and reliability.",
            members: [
                { id: 104, name: "Charlie Brown", email: "charlie@example.com", color: "#fc0" },
                { id: 105, name: "David Wilson", email: "david@example.com", color: "#c0f" },
            ],
            duration: 2,
            priority: "Low",
            tags: "Testing, Quality Assurance",
        },
        {
            id: 4,
            name: "Deploy to Production",
            description: "Deploy the application to the production environment and ensure everything is running smoothly.",
            members: [
                { id: 106, name: "Eve Adams", email: "eve@example.com", color: "#f00" },
            ],
            duration: 1,
            priority: "High",
            tags: "DevOps, Deployment",
        },
        {
            id: 5,
            name: "Create User Documentation",
            description: "Write detailed user documentation to help users understand how to use the application.",
            members: [
                { id: 101, name: "Youssef Shafek", email: "youssef@example.com", color: "#09c" },
                { id: 107, name: "Frank Miller", email: "frank@example.com", color: "#0f9" },
            ],
            duration: 4,
            priority: "Medium",
            tags: "Documentation, Technical Writing",
        },
        {
            id: 6,
            name: "Optimize Database Queries",
            description: "Analyze and optimize database queries to improve application performance.",
            members: [
                { id: 108, name: "Grace Lee", email: "grace@example.com", color: "#c09" },
            ],
            duration: 3,
            priority: "Medium",
            tags: "Database, Optimization",
        },
        {
            id: 7,
            name: "Implement Authentication",
            description: "Add user authentication and authorization features to the application.",
            members: [
                { id: 109, name: "Henry Brown", email: "henry@example.com", color: "#9c0" },
            ],
            duration: 4,
            priority: "High",
            tags: "Security, Authentication",
        },
        {
            id: 8,
            name: "Design Mobile App UI",
            description: "Create a responsive and intuitive user interface for the mobile application.",
            members: [
                { id: 110, name: "Ivy Davis", email: "ivy@example.com", color: "#f90" },
            ],
            duration: 5,
            priority: "High",
            tags: "UI/UX, Mobile",
        },
        {
            id: 9,
            name: "Set Up CI/CD Pipeline",
            description: "Configure a continuous integration and continuous deployment pipeline for the project.",
            members: [
                { id: 111, name: "Jack Wilson", email: "jack@example.com", color: "#09f" },
            ],
            duration: 3,
            priority: "Medium",
            tags: "DevOps, CI/CD",
        },
        {
            id: 10,
            name: "Conduct User Testing",
            description: "Organize and conduct user testing sessions to gather feedback on the application.",
            members: [
                { id: 112, name: "Karen White", email: "karen@example.com", color: "#f0c" },
            ],
            duration: 2,
            priority: "Low",
            tags: "Testing, User Feedback",
        },
    ];

    const handleCheckboxChange = (id) => {
        if (checkedTasks.includes(id)) {
            // If already selected, remove it
            setcheckedTasks(checkedTasks.filter((checkedTasks) => checkedTasks !== id));
        } else {
            // If not selected, add it
            setcheckedTasks([...checkedTasks, id]);
        }
    };

    const handleSelectAll = () => {
        if (checkedTasks.length === tasks.length) {
            setcheckedTasks([]);
        } else {
            setcheckedTasks(tasks.map((task) => task.id));
        }
    };

    const editTask = (task) => {
        setselectedTask(task);
        setIsFormOpen(true);
    };

    const handleRowClick = (task) => {
        setFloatingTask(task); // Set the task for the floating design
    };

    const handleCloseFloatingTask = () => {
        setFloatingTask(null); // Close the floating design
    };

    useEffect(() => {
        console.log(checkedTasks);
    }, [checkedTasks]);

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
                                onClick={() => {

                                }}
                                className="rounded-full aspect-square  bg-base dark:bg-dark2 text-red-500 p-2 flex justify-center items-center  hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                <Trash2 />
                            </button>
                        </Tooltip>
                        <Tooltip closeDelay={0} delay={350} content='Add task'>
                            <button
                                onClick={() => {
                                    setselectedTask(null);
                                    setIsFormOpen(true);
                                }}
                                className="rounded-full aspect-square  bg-base dark:bg-dark2 text-blue-500 p-2 flex justify-center items-center hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                <Plus size={25} />
                            </button>
                        </Tooltip>
                        <Tooltip closeDelay={0} delay={350} content='Commit Tasks'>
                            <button
                                onClick={() => { }}
                                className="rounded-full dark:bg-light text-white bg-light py-1 px-2 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                Commit Tasks
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
                                    checked={checkedTasks.length === tasks.length}
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
                            {tasks.map((task) => (
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
                                            {task.members.slice(0, 5).map((person) => (
                                                <Tooltip key={person.id} content={person.name} delay={0} closeDelay={0}>
                                                    <div
                                                        key={person.id}
                                                        className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                                        style={{ backgroundColor: person.color }}
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
                                            {task.duration} days
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
                            ))}
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
                                <div className="space-y-2">
                                    <p><strong>Description:</strong> {floatingTask.description}</p>
                                    <p><strong>Duration:</strong> {floatingTask.duration} days</p>
                                    <p><strong>Priority:</strong> {floatingTask.priority}</p>
                                    <p><strong>Tags:</strong> {floatingTask.tags}</p>
                                    <p><strong>Assigned To:</strong></p>
                                    <div className="flex flex-col gap-3 max-h-52 overflow-auto bg-base dark:bg-dark2 p-3 rounded-lg">
                                        {floatingTask.members.map((member) => (
                                            <div className="flex gap-2 border-b pb-2 border-b-gray-300 dark:border-b-gray-700">
                                                <Tooltip key={member.id} content={member.name} delay={0} closeDelay={0}>
                                                    <div
                                                        className="w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default"
                                                        style={{ backgroundColor: member.color }}
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
                    teamMembers={teamMembers}
                    mode={selectedTask ? 'update' : 'add'}
                    taskData={selectedTask}
                />
            </div >
        </>
    );
}