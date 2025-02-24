import { Circle, Clipboard, Clock2, Dot, ShieldCheck } from 'lucide-react';
import React, { useContext, useEffect } from 'react';
import DonutChart from '../../components/DonutChart/DonutChart';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TaskContext } from '../../context/TaskContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const token = localStorage.getItem('userToken');
    let { selectedTask, setselectedTask } = useContext(TaskContext)
    const navigate = useNavigate()
    const { data: homeStatsData, isLoading: homeStatsLoading } = useQuery({
        queryKey: ['homeStats'],
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/home/task-statistics`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
    });

    const { data: inreviewTasksData, isLoading: inreviewTasksLoading } = useQuery({
        queryKey: ['inreviewTasks'],
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/home/in-review`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
    });

    const { data: toDoTasksData, isLoading: toDoTasksLoading } = useQuery({
        queryKey: ['toDoTasks'],
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/home/to-do-list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
    });

    const statusMap = {
        1: 'pending',
        2: 'in progress',
        3: 'completed',
        4: 'cancelled',
        5: 'on hold',
        6: 'in review',
    };

    return (
        <>
            <div className="p-3 md:p-5">
                <div className="flex flex-col-reverse lg:flex-row gap-5">
                    {/* TO-Do side */}
                    <div className="flex flex-col gap-4 lg:w-1/2 bg-base shadow-xl rounded-3xl p-5">
                        <div className="flex items-center gap-2 relative">
                            <Clipboard className="text-gray-400" />
                            <Clock2 size={13} className="absolute text-gray-400 top-4 left-4 bg-base" />
                            <h2 className="text-highlight font-semibold">To-Do</h2>
                        </div>
                        <div className="flex text-gray-500 text-sm">
                            {new Date().toISOString().substring(0, 10)}<Dot />Today
                        </div>

                        {/* tasks mapping */}
                        {toDoTasksLoading ? (
                            <>
                                {/* Loading placeholders */}
                                {[...Array(4)].map((_, index) => (
                                    <div key={index} className="border border-opacity-30 border-black p-3 rounded-2xl flex gap-3">
                                        <div className="animate-pulse">
                                            <div className="rounded-full bg-gray-300 h-5 w-5"></div>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="animate-pulse">
                                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                            </div>
                                            <div className="animate-pulse">
                                                <div className="h-3 bg-gray-300 rounded w-full my-3"></div>
                                                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                                            </div>
                                            <div className="animate-pulse flex justify-between">
                                                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                                                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                                                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                {toDoTasksData?.data?.data.tasks.map((task) => (
                                    <div key={task.id} className="border border-opacity-30 border-black p-3 rounded-2xl flex gap-3">
                                        <div>
                                            <Circle size={20} className="text-highlight" />
                                        </div>
                                        <div className="flex flex-col w-5/6">
                                            <h2 className="font-semibold cursor-pointer" onClick={() => {
                                                setselectedTask(task);
                                                navigate('/task-details')
                                            }}>{task.name}</h2>
                                            <div className="text-gray-700 max-w-[80%] my-3">{task.description}</div>
                                            <div className="flex md:flex-row flex-col justify-between">
                                                <div>
                                                    Priority: <span className="text-light">{task.priority}</span>
                                                </div>
                                                <div>
                                                    Status: <span className="text-highlight">{statusMap[task.status] || 'unknown'}</span>
                                                </div>
                                                <div>
                                                    Deadline: <span className="text-gray-500">{task.deadline.substring(0, 10)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* right side */}
                    <div className="flex flex-col lg:w-1/2 h-full gap-5">
                        {/* charts */}
                        <div className="flex flex-col md:flex-row flex-wrap items-center justify-between p-5 bg-base shadow-xl rounded-3xl w-full">
                            <div className="capitalize text-xl w-full font-semibold">tasks stats</div>
                            {homeStatsLoading ? (
                                <>
                                    {/* Loading placeholders */}
                                    {[...Array(3)].map((_, index) => (
                                        <div key={index} className="w-[calc(33.333%-40px)]">
                                            <div className="animate-pulse">
                                                <div className="rounded-full bg-base border-[24px] border-gray-300 opacity-50 h-40 w-40 mx-auto"></div>
                                                <div className="h-5 bg-gray-300 opacity-50 rounded mt-4 w-1/2 ms-3"></div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <div className="w-1/2 md:w-[calc(33.333%-40px)]">
                                        <DonutChart
                                            key={`completed-${homeStatsData?.data?.data?.statistics.completed.percentage}`} // Force re-render
                                            labels={['Completed']}
                                            dataPoints={[
                                                homeStatsData?.data?.data?.statistics.completed.count,
                                                homeStatsData?.data?.data?.statistics.total_tasks - homeStatsData?.data?.data?.statistics.completed.count,
                                            ]}
                                            backgroundColors={['#f25287', '#ccc']}
                                            hoverColors={['#bf406a', '#ccc']}
                                            centerText={`${homeStatsData?.data?.data?.statistics.completed.percentage}%`}
                                            fontSize={25}
                                        />
                                    </div>

                                    <div className="w-1/2 md:w-[calc(33.333%-40px)]">
                                        <DonutChart
                                            key={`in-progress-${homeStatsData?.data?.data?.statistics.in_progress.percentage}`} // Force re-render
                                            labels={['In Progress']}
                                            dataPoints={[
                                                homeStatsData?.data?.data?.statistics.in_progress.count,
                                                homeStatsData?.data?.data?.statistics.total_tasks - homeStatsData?.data?.data?.statistics.in_progress.count,
                                            ]}
                                            backgroundColors={['#133d57', '#ccc']}
                                            hoverColors={['#071924', '#ccc']}
                                            centerText={`${homeStatsData?.data?.data?.statistics.in_progress.percentage}%`}
                                            fontSize={25}
                                        />
                                    </div>

                                    <div className="w-1/2 md:w-[calc(33.333%-40px)]">
                                        <DonutChart
                                            key={`pending-${homeStatsData?.data?.data?.statistics.pending.percentage}`} // Force re-render
                                            labels={['Pending']}
                                            dataPoints={[
                                                homeStatsData?.data?.data?.statistics.pending.count,
                                                homeStatsData?.data?.data?.statistics.total_tasks - homeStatsData?.data?.data?.statistics.pending.count,
                                            ]}
                                            backgroundColors={['#00adb5', '#ccc']}
                                            hoverColors={['#007c82', '#ccc']}
                                            centerText={`${homeStatsData?.data?.data?.statistics.pending.percentage}%`}
                                            fontSize={25}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* in review tasks */}
                        <div className="flex flex-col gap-4 bg-base shadow-xl rounded-3xl p-5">
                            <div className="flex items-center gap-2 relative">
                                <Clipboard className="text-gray-400" />
                                <ShieldCheck size={15} className="absolute text-gray-400 top-4 left-4 bg-base" />
                                <h2 className="text-highlight font-semibold">In Review Tasks</h2>
                            </div>
                            {/* in review tasks mapping */}
                            {inreviewTasksLoading ? (
                                <>
                                    {/* Loading placeholders */}
                                    {[...Array(2)].map((_, index) => (
                                        <div key={index} className="border border-opacity-30 border-black p-3 rounded-2xl flex gap-3">
                                            <div className="animate-pulse">
                                                <div className="rounded-full bg-gray-300 h-5 w-5"></div>
                                            </div>
                                            <div className="flex flex-col gap-2 w-full">
                                                <div className="animate-pulse">
                                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                                </div>
                                                <div className="animate-pulse">
                                                    <div className="h-3 bg-gray-300 rounded w-full my-3"></div>
                                                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                                                </div>
                                                <div className="animate-pulse flex justify-between">
                                                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {inreviewTasksData?.data?.data?.tasks.map((task) => (
                                        <div key={task.id} className="border border-opacity-30 border-black p-3 rounded-2xl flex gap-3">
                                            <div>
                                                <Circle size={20} className="text-highlight" />
                                            </div>
                                            <div className="flex flex-col">
                                                <h2 className="font-semibold cursor-pointer" onClick={() => {
                                                    setselectedTask(task);
                                                    navigate('/task-details')
                                                }}>{task.name}</h2>
                                                <div className="text-gray-700 max-w-[80%] my-3">{task.description}</div>
                                                <div className="flex flex-col justify-between">
                                                    <div className="text-gray-500">Deadline: {task.deadline.substring(0, 10)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}