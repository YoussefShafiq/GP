import { BellDot, ChevronDown, MoveDownLeft, MoveUpRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faAward, faListCheck, faPeopleGroup, faSquarePollVertical } from '@fortawesome/free-solid-svg-icons';
import DonutChart from '../../components/DonutChart/DonutChart';
import LineChart from '../../components/LineChart/LineChart';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import VerticalBarChart from '../../components/VerticalBarChart/VerticalBarChart';


export default function Dashboard() {


    const token = localStorage.getItem('userToken');


    function getDashbaordData() {
        return axios.get(
            `https://brainmate-new.fly.dev/api/v1/dashboard/general`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }


    // Queries
    const { data: dashbaordData, isLoading: isDashboardLoading } = useQuery({
        queryKey: ['dashbaordData'],
        queryFn: getDashbaordData,
    });
    const label = 'Task Progress over last year';


    const [DashData, setDashData] = useState({})

    useEffect(() => {
        setDashData(dashbaordData?.data?.data);

    }, [dashbaordData]);

    const linechartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dataPoints: [5, 9, 1, 5, 2, 4, 5, 2, 4, 5, 2, 4, 5],
    };
    const linechartData2 = {
        labels: ['project1', 'project2', 'project3', 'project4', 'project5', 'project6', 'project7', 'project8', 'project9', 'project10', 'project11', 'project12'],
        dataPoints: [5, 9, 1, 5, 2, 4, 5, 2, 4, 5, 2, 4, 5],
    };


    return (
        <div className="flex flex-col h-full dark:bg-darkoverflow-hidden">


            {/* Dashboard Content */}
            <div className="flex gap-5">
                {/* First vertical data card */}
                <div className="flex flex-col justify-center w-1/12 bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 py-4 rounded-xl">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={dashbaordData?.data?.data}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[dashbaordData?.data?.data.task_counts.pending, dashbaordData?.data?.data.task_counts.total - dashbaordData?.data?.data.task_counts.pending]}
                                centerText={`${Math.round((dashbaordData?.data?.data.task_counts.pending / dashbaordData?.data?.data.task_counts.total) * 100) || 0}%`}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{dashbaordData?.data?.data.task_counts.pending}</h2>
                            <h3 className="text-sm">pending</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={dashbaordData?.data?.data}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[dashbaordData?.data?.data.task_counts.in_progress, dashbaordData?.data?.data.task_counts.total - dashbaordData?.data?.data.task_counts.in_progress]}
                                centerText={`${Math.round((dashbaordData?.data?.data.task_counts.in_progress / dashbaordData?.data?.data.task_counts.total) * 100) || 0}%`}

                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{dashbaordData?.data?.data.task_counts.in_progress}</h2>
                            <h3 className="text-sm">in progress</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={dashbaordData?.data?.data}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[dashbaordData?.data?.data.task_counts.completed, dashbaordData?.data?.data.task_counts.total - dashbaordData?.data?.data.task_counts.completed]}
                                centerText={`${Math.round((dashbaordData?.data?.data.task_counts.completed / dashbaordData?.data?.data.task_counts.total) * 100) || 0}%`}

                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{dashbaordData?.data?.data.task_counts.completed}</h2>
                            <h3 className="text-sm">completed</h3>
                        </div>
                    </div>
                </div>

                {/* Second vertical data card */}
                <div className="flex flex-col justify-center w-1/12 bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 py-4 rounded-xl">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={dashbaordData?.data?.data}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[dashbaordData?.data?.data.task_counts.cancelled, dashbaordData?.data?.data.task_counts.total - dashbaordData?.data?.data.task_counts.cancelled]}
                                centerText={`${Math.round((dashbaordData?.data?.data.task_counts.cancelled / dashbaordData?.data?.data.task_counts.total) * 100) || 0}%`}

                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{dashbaordData?.data?.data.task_counts.cancelled}</h2>
                            <h3 className="text-sm">cancelled</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={dashbaordData?.data?.data}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[dashbaordData?.data?.data.task_counts.on_hold, dashbaordData?.data?.data.task_counts.total - dashbaordData?.data?.data.task_counts.on_hold]}
                                centerText={`${Math.round((dashbaordData?.data?.data.task_counts.on_hold / dashbaordData?.data?.data.task_counts.total) * 100) || 0}%`}

                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{dashbaordData?.data?.data.task_counts.on_hold}</h2>
                            <h3 className="text-sm">on hold</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={dashbaordData?.data?.data}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[dashbaordData?.data?.data.task_counts.in_review, dashbaordData?.data?.data.task_counts.total - dashbaordData?.data?.data.task_counts.in_review]}
                                centerText={`${Math.round((dashbaordData?.data?.data.task_counts.in_review / dashbaordData?.data?.data.task_counts.total) * 100) || 0}%`}

                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{dashbaordData?.data?.data.task_counts.in_review}</h2>
                            <h3 className="text-sm">in review</h3>
                        </div>
                    </div>
                </div>

                {/* Project cards */}
                <div className="flex flex-col w-1/6 gap-5">
                    <div className="flex flex-col justify-center items-center text-center h-1/2 text-sm bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 p-4 rounded-xl">
                        <FontAwesomeIcon icon={faListCheck} className="text-2xl" />
                        <h2 className="font-semibold capitalize">teams</h2>
                        <h2 className="text-3xl">{dashbaordData?.data?.data?.teams_count.current}</h2>
                        <h3 className='flex items-center'> {dashbaordData?.data.data.teams_count.trend == 'increase' ? <MoveDownLeft className='text-red-500' /> : <MoveUpRight className='text-green-500' />}  {dashbaordData?.data?.data.teams_count.change_percentage}% {dashbaordData?.data.data.teams_count.trend} from last month</h3>
                    </div>
                    <div className="flex flex-col justify-center items-center text-center h-1/2 text-sm bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 p-4 rounded-xl">
                        <FontAwesomeIcon icon={faPeopleGroup} className="text-2xl" />
                        <h2 className="font-semibold capitalize">projects</h2>
                        <h2 className="text-3xl">{dashbaordData?.data?.data?.projects_count.current}</h2>
                        <h3 className='flex items-center'> {dashbaordData?.data.data.projects_count.trend == 'increase' ? <MoveDownLeft className='text-red-500' /> : <MoveUpRight className='text-green-500' />}  {dashbaordData?.data?.data.projects_count.change_percentage}% {dashbaordData?.data.data.projects_count.trend} from last month</h3>
                    </div>
                </div>

                {/* Main chart area */}
                <div className="w-4/6 flex flex-col">
                    <div className="bg-base dark:bg-dark1 shadow-lg rounded-2xl">
                        <div className="flex justify-between items-center pt-4 px-6">
                            <h2 className="font-inter font-bold text-gray-900 dark:text-white">
                                {label} (no of tasks completed per month)
                            </h2>
                        </div>
                        <div className="flex">
                            <div className="w-full p-5">
                                <LineChart
                                    key={dashbaordData?.data?.data?.completion_trend}
                                    labels={dashbaordData?.data?.data?.completion_trend.labels}
                                    dataPoints={dashbaordData?.data?.data?.completion_trend.values}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom section */}
            <div className="flex mt-8 gap-3">
                <div className=" bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl">
                    <div className="h-[300px]">
                        <DonutChart
                            key={dashbaordData?.data?.data.tasks_by_priority}
                            labels={['high', 'medium', 'low']}
                            dataPoints={[dashbaordData?.data?.data.tasks_by_priority.high, dashbaordData?.data?.data.tasks_by_priority.medium, dashbaordData?.data?.data.tasks_by_priority.low]}
                            centerText="75"
                            label="tasks per priority"
                            fontSize={45}
                        />
                    </div>
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl">
                        <div className="flex justify-between items-center pt-4 px-6">
                            <h2 className="font-inter font-bold text-gray-900 dark:text-white">
                                assigned tasks per project
                            </h2>
                        </div>
                        <div className="flex">
                            <div className="w-full p-5">
                                <VerticalBarChart
                                    key={dashbaordData?.data?.data?.workload_by_project}
                                    labels={dashbaordData?.data?.data?.workload_by_project.labels}
                                    dataPoints={dashbaordData?.data?.data?.workload_by_project.values}
                                    backgroundColors={['#00c5c9']}
                                    hoverColors={['#1A4E6B']}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}