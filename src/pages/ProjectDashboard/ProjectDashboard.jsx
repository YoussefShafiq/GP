import React, { useContext, useEffect, useState } from 'react'
import DonutChart from '../../components/DonutChart/DonutChart'
import VerticalBarChart from '../../components/VerticalBarChart/VerticalBarChart';
import LineChart from '../../components/LineChart/LineChart';
import axios from 'axios';
import { projectContext } from '../../context/ProjectsContext';
import { useQuery } from '@tanstack/react-query';

export default function ProjectDashboard() {
    const { selectedDashboardProject } = useContext(projectContext)
    const [ProjectDashboard, setProjectDashboard] = useState(null)


    function getProjectDashboardData() {
        return axios.get(`https://brainmate-new.fly.dev/api/v1/dashboard/project/${selectedDashboardProject}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            },
        })
    }

    const { data: ProjectData, isLoading: isProjectLoading } = useQuery({
        queryKey: ['ProjectData', selectedDashboardProject],
        queryFn: getProjectDashboardData
    })

    useEffect(() => {
        if (ProjectData?.data?.data) {
            setProjectDashboard(ProjectData?.data?.data)
        }
        console.log(ProjectDashboard);


    }, [ProjectData])


    const label = 'Monthly overall progress per project';

    const linechartData = {
        labels: ['team1', 'team2', 'team3', 'team4', 'team5', 'team6', 'team7'],
        dataPoints: [5, 9, 1, 5, 2, 4, 5],
    };


    const barchartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dataPoints: [5, 9, 1, 5, 2, 4, 5, 2, 4, 5, 2, 4, 5],
    };

    return <>
        <div className="flex flex-col h-full dark:bg-darkoverflow-hidden gap-4">
            <div className="flex gap-5">
                {/* First vertical data card */}
                <div className="flex flex-col justify-center w-1/12 bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 py-4 rounded-xl">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={ProjectDashboard}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[ProjectDashboard?.task_counts?.pending, ProjectDashboard?.task_counts?.total - ProjectDashboard?.task_counts?.pending]}
                                centerText={`${((ProjectDashboard?.task_counts?.pending / ProjectDashboard?.task_counts?.total) * 100).toFixed(1)}%`}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{ProjectDashboard?.task_counts?.pending}</h2>
                            <h3 className="text-sm">pending</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={ProjectDashboard}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[ProjectDashboard?.task_counts?.in_progress, ProjectDashboard?.task_counts?.total - ProjectDashboard?.task_counts?.in_progress]}
                                centerText={`${((ProjectDashboard?.task_counts?.in_progress / ProjectDashboard?.task_counts?.total) * 100).toFixed(1)}%`}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{ProjectDashboard?.task_counts?.in_progress}</h2>
                            <h3 className="text-sm">in progress</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={ProjectDashboard}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[ProjectDashboard?.task_counts?.completed, ProjectDashboard?.task_counts?.total - ProjectDashboard?.task_counts?.completed]}
                                centerText={`${((ProjectDashboard?.task_counts?.completed / ProjectDashboard?.task_counts?.total) * 100).toFixed(1)}%`}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{ProjectDashboard?.task_counts?.completed}</h2>
                            <h3 className="text-sm">completed</h3>
                        </div>
                    </div>
                </div>

                {/* Second vertical data card */}
                <div className="flex flex-col justify-center w-1/12 bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 py-4 rounded-xl">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={ProjectDashboard}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[ProjectDashboard?.task_counts?.cancelled, ProjectDashboard?.task_counts?.total - ProjectDashboard?.task_counts?.cancelled]}
                                centerText={`${((ProjectDashboard?.task_counts?.cancelled / ProjectDashboard?.task_counts?.total) * 100).toFixed(1)}%`}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{ProjectDashboard?.task_counts?.cancelled}</h2>
                            <h3 className="text-sm">cancelled</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={ProjectDashboard}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[ProjectDashboard?.task_counts?.on_hold, ProjectDashboard?.task_counts?.total - ProjectDashboard?.task_counts?.on_hold]}
                                centerText={`${((ProjectDashboard?.task_counts?.on_hold / ProjectDashboard?.task_counts?.total) * 100).toFixed(1)}%`}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{ProjectDashboard?.task_counts?.on_hold}</h2>
                            <h3 className="text-sm">on hold</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={ProjectDashboard}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[ProjectDashboard?.task_counts?.in_review, ProjectDashboard?.task_counts?.total - ProjectDashboard?.task_counts?.in_review]}
                                centerText={`${((ProjectDashboard?.task_counts?.in_review / ProjectDashboard?.task_counts?.total) * 100).toFixed(1)}%`}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{ProjectDashboard?.task_counts?.in_review}</h2>
                            <h3 className="text-sm">in review</h3>
                        </div>
                    </div>
                </div>

                {/* Project cards */}
                <div className="w-5/6 flex flex-col">
                    <div className="bg-base dark:bg-dark1 shadow-lg rounded-2xl">
                        <div className="flex justify-between items-center pt-4 px-6">
                            <h2 className="font-inter font-bold text-gray-900 dark:text-white">
                                Overall progress per team
                            </h2>
                        </div>
                        <div className="flex">
                            <div className="w-full p-5">
                                <LineChart
                                    labels={ProjectDashboard?.teams_progress?.labels}
                                    dataPoints={ProjectDashboard?.teams_progress?.values}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-5">
                <div className="flex flex-col w-1/6 gap-5">
                    <div className="flex flex-col justify-center items-center text-center h-1/2 text-sm bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 p-4 rounded-xl">
                        <div className="w-2/3">
                            <DonutChart
                                key={ProjectDashboard}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[ProjectDashboard?.project_metrics?.overall_progress, 100 - ProjectDashboard?.project_metrics?.overall_progress]}
                                centerText={`${ProjectDashboard?.project_metrics?.overall_progress || 0}%`}
                                fontSize={26}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-sm">Overall progress</h3>
                        </div>

                    </div>
                    <div className="flex flex-col justify-center items-center text-center h-1/2 text-sm bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 p-4 rounded-xl">
                        <div className="w-2/3">
                            <DonutChart
                                key={ProjectDashboard}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[ProjectDashboard?.project_metrics?.in_progress_tasks]}
                                centerText={`${ProjectDashboard?.project_metrics?.in_progress_tasks || 0}`}
                                fontSize={26}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-sm">in progress tasks</h3>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-1/6 gap-5">
                    <div className="flex flex-col justify-center items-center text-center h-1/2 text-sm bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 p-4 rounded-xl">
                        <div className="w-2/3">
                            <DonutChart
                                key={ProjectDashboard}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[ProjectDashboard?.project_metrics?.tasks_at_risk]}
                                centerText={`${ProjectDashboard?.project_metrics?.tasks_at_risk || 0}`}
                                fontSize={26}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-sm">Tasks at risk</h3>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center text-center h-1/2 text-sm bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 p-4 rounded-xl">
                        <div className="w-2/3">
                            <DonutChart
                                key={ProjectDashboard}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[ProjectDashboard?.project_metrics?.completed_tasks]}
                                centerText={`${ProjectDashboard?.project_metrics?.completed_tasks || 0}`}
                                fontSize={26}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-sm">Completed tasks</h3>
                        </div>
                    </div>
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl">
                        <div className="flex justify-between items-center pt-4 px-6">
                            <h2 className="font-inter font-bold text-gray-900 dark:text-white">

                                Monthly overall progress
                            </h2>
                        </div>
                        <div className="flex">
                            <div className="w-full p-5">
                                <VerticalBarChart
                                    key={ProjectDashboard}
                                    labels={ProjectDashboard?.monthly_progress?.labels}
                                    dataPoints={ProjectDashboard?.monthly_progress?.values}
                                    barThickness={40}
                                    borderRadius={20}
                                    backgroundColors={['#00c5c9']}
                                    hoverColors={['#1A4E6B']}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </>
}
