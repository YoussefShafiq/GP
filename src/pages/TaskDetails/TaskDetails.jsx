import React, { useContext } from 'react'
import { TaskContext } from '../../context/TaskContext'
import { useNavigate } from 'react-router-dom';
import { TeamsContext } from '../../context/TeamsContext';
import { projectContext } from '../../context/ProjectsContext';
import { Bomb, Clock, Laptop, MousePointerClick, Send } from 'lucide-react';
import TasksTable from '../../components/TasksTable/TasksTable';
import deadlineKiller from '../../assets/images/deadline killer.png'
import worker from '../../assets/images/computer-worker.png'

export default function TaskDetails() {
    let { selectedTask, setselectedTask } = useContext(TaskContext)
    let { selectedProject, setselectedProject } = useContext(projectContext);
    let { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const token = localStorage.getItem('userToken');
    const navigate = useNavigate();

    // Inside the TaskDetails component
    const { creationDate, deadlineDate } = selectedTask; // Assuming these are available in selectedTask

    // Convert dates to timestamps
    const creationTimestamp = new Date(creationDate).getTime();
    const deadlineTimestamp = new Date(deadlineDate).getTime();
    const todayTimestamp = new Date().getTime();

    // Calculate progress
    const totalDuration = deadlineTimestamp - creationTimestamp;
    const elapsedDuration = todayTimestamp - creationTimestamp;
    // const progressPercentage = Math.min((elapsedDuration / totalDuration) * 100, 100); // Ensure it doesn't exceed 100%
    const progressPercentage = 90; // Ensure it doesn't exceed 100%

    // Gradient for the progress bar
    const progressBarStyle = {
        width: `${progressPercentage}%`,
        background: 'linear-gradient(90deg, #f54545, #f54545)', // Example gradient
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

    return <>
        <div className="p-5">
            {/* path */}
            <div className='text-light font-semibold flex items-center h-6 px-5'>
                {!selectedTask?.assigned_to_me && <>
                    <div onClick={() => { navigate('/project'); setselectedTeam(null) }} className="pe-1 cursor-pointer">{selectedProject?.name}</div> /
                    <div onClick={() => { navigate('/project/team'); }} className="px-1 cursor-pointer">{selectedTeam?.name}</div> /
                </>}
                {selectedTask?.assigned_to_me && <>
                    <div onClick={() => { navigate('/mytasks'); setselectedTeam(null) }} className="pe-1 cursor-pointer capitalize">my tasks</div> /
                </>}
                <div onClick={() => { navigate('/project/team/task-details'); }} className="px-1 cursor-pointer">{selectedTask?.name}</div>
            </div>

            {/* task details */}
            <div className="p-3">
                {/* task in table */}
                <TasksTable tasks={[selectedTask]} />


                <div className="flex justify-between gap-10 mt-8">
                    <div className="flex flex-col w-[calc(66.666%-8px)] gap-5">
                        {/* Task Progress Bar */}
                        <div className="relative w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 my-3">
                            <div
                                className="h-3 rounded-full relative"
                                style={progressBarStyle}
                            >
                                {/* Icon at the end of the progress bar */}
                                <div
                                    className="absolute right-0 flex items-center gap-1 -mt-9 transform "
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
                            <div className="text-end">1 day left</div>
                        </div>
                        {/* task description */}
                        <div className="">
                            <h2 className='capitalize mb-3 font-semibold text-gray-700' >task description</h2>
                            <div name="task description" id="task description" className='w-full outline-dashed outline-2 p-3 max-h-52 rounded-xl overflow-y-auto' >{selectedTask.description}</div>
                        </div>
                        {/* assigned to */}
                        <div className="bg-base max-h-96 p-4 rounded-2xl shadow-xl overflow-y-auto">
                            <h2 className='capitalize mb-3 font-semibold text-gray-700' >assigned to</h2>
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
                                            <p>{person.name} <span className='text-xs text-gray-500 font-light' >{person.role || '(member)'}</span></p>
                                            <p className='text-xs text-gray-600' >{person.email || `${person.name.replaceAll(' ', '_')}@gmail.com`}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-[calc(35.333%-8px)] gap-y-6">
                        {/* task notes */}
                        <div className="flex flex-col bg-base p-5 rounded-3xl shadow-xl min-h-[200px] max-h-96 relative">
                            <h2 className='capitalize ms-4 font-semibold text-gray-700'>Task Notes</h2>

                            {/* <!-- Make the ol take up the remaining space and be scrollable --> */}
                            <div className="flex-1 p-5 pb-0 overflow-y-auto">
                                <ol className="relative border-s border-gray-400 dark:border-gray-700 ">
                                    <li className="mb-5 ms-6">
                                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                            <div
                                                className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                                style={{ backgroundColor: "#09c" }}
                                                title={"youssef mohammed shafek"}
                                            >
                                                Y
                                            </div>
                                        </span>
                                        <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-xs sm:flex dark:bg-gray-700 dark:border-gray-600">
                                            <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">just now</time>
                                            <div className="text-sm font-normal text-gray-500 dark:text-gray-300">Bonnie moved <a href="#" className="font-semibold text-blue-600 dark:text-blue-500 hover:underline">Jese Leos</a> to <span className="bg-gray-100 text-gray-800 text-xs font-normal me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-600 dark:text-gray-300">Funny Group</span></div>
                                        </div>
                                    </li>
                                    <li className="mb-5 ms-6">
                                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                            <div
                                                className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                                style={{ backgroundColor: "#d2d" }}
                                                title={"youssef mohammed shafek"}
                                            >
                                                H
                                            </div>
                                        </span>
                                        <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-xs sm:flex dark:bg-gray-700 dark:border-gray-600">
                                            <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">just now</time>
                                            <div className="text-sm font-normal text-gray-500 dark:text-gray-300">Bonnie moved <a href="#" className="font-semibold text-blue-600 dark:text-blue-500 hover:underline">Jese Leos</a> to <span className="bg-gray-100 text-gray-800 text-xs font-normal me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-600 dark:text-gray-300">Funny Group</span></div>
                                        </div>
                                    </li>
                                    <li className="mb-5 ms-6">
                                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                            <div
                                                className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                                style={{ backgroundColor: "#283" }}
                                                title={"youssef mohammed shafek"}
                                            >
                                                K
                                            </div>
                                        </span>
                                        <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-xs sm:flex dark:bg-gray-700 dark:border-gray-600">
                                            <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">just now</time>
                                            <div className="text-sm font-normal text-gray-500 dark:text-gray-300">Bonnie moved <a href="#" className="font-semibold text-blue-600 dark:text-blue-500 hover:underline">Jese Leos</a> to <span className="bg-gray-100 text-gray-800 text-xs font-normal me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-600 dark:text-gray-300">Funny Group</span></div>
                                        </div>
                                    </li>
                                </ol>
                            </div>

                            {/* <!-- Fix the input and button at the bottom --> */}
                            <div className="flex justify-between items-center gap-2 bg-base mt-4 flex-shrink-0">
                                <textarea
                                    placeholder="Add Notes..."
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-light focus:border-light duration-300 resize-none"
                                    rows={1}
                                    style={{ minHeight: '40px', maxHeight: '120px', overflowY: 'auto' }}
                                />
                                <button className="p-2 bg-light text-white rounded-lg hover:bg-darkblue transition-all">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                        {/* activity log */}
                        <div className="bg-base ps-10 p-5 rounded-3xl shadow-xl max-h-96 overflow-y-auto" >
                            <h2 className='capitalize mb-2 font-semibold text-gray-700' >Activity Log</h2>

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
