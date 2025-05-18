import React, { useContext, useEffect, useState } from 'react'
import DonutChart from '../../components/DonutChart/DonutChart'
import VerticalBarChart from '../../components/VerticalBarChart/VerticalBarChart';
import LineChart from '../../components/LineChart/LineChart';
import axios from 'axios';
import { projectContext } from '../../context/ProjectsContext';
import { useQuery } from '@tanstack/react-query';

export default function ProjectDashboard() {
    const { selectedDashboardProject } = useContext(projectContext)
    const [projectDashboard, setProjectDashboard] = useState(null)

    function getProjectDashboardData() {
        return axios.get(`https://brainmate-new.fly.dev/api/v1/dashboard/project/${selectedDashboardProject}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            },
        })
    }

    const { data: projectData, isLoading: isProjectLoading, isError, error } = useQuery({
        queryKey: ['ProjectData', selectedDashboardProject],
        queryFn: getProjectDashboardData
    })

    useEffect(() => {
        if (projectData?.data?.data) {
            setProjectDashboard(projectData.data.data)
            console.log("Dashboard data updated:", projectData.data.data)
        }
    }, [projectData, selectedDashboardProject])



    if (isError) {
        return <div className="flex justify-center items-center h-full">{error.response.data.message}</div>
    }

    // Helper function to calculate percentage safely
    const calculatePercentage = (numerator, denominator) => {
        if (!denominator || denominator === 0) return '0%'
        return `${((numerator / denominator) * 100).toFixed(1)}%`
    }

    return (
        <div className="flex flex-col h-full dark:bg-dark overflow-hidden gap-4">
            <div className="flex gap-5">
                {/* First vertical data card */}
                <div className="flex flex-col justify-center w-1/12 bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 py-4 rounded-xl">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={`pending-${projectDashboard?.task_counts?.pending}`}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[
                                    projectDashboard?.task_counts?.pending || 0,
                                    (projectDashboard?.task_counts?.total || 0) - (projectDashboard?.task_counts?.pending || 0)
                                ]}
                                centerText={calculatePercentage(
                                    projectDashboard?.task_counts?.pending,
                                    projectDashboard?.task_counts?.total
                                )}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{projectDashboard?.task_counts?.pending || 0}</h2>
                            <h3 className="text-sm">pending</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={`in-progress-${projectDashboard?.task_counts?.in_progress}`}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[
                                    projectDashboard?.task_counts?.in_progress || 0,
                                    (projectDashboard?.task_counts?.total || 0) - (projectDashboard?.task_counts?.in_progress || 0)
                                ]}
                                centerText={calculatePercentage(
                                    projectDashboard?.task_counts?.in_progress,
                                    projectDashboard?.task_counts?.total
                                )}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{projectDashboard?.task_counts?.in_progress || 0}</h2>
                            <h3 className="text-sm">in progress</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={`completed-${projectDashboard?.task_counts?.completed}`}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[
                                    projectDashboard?.task_counts?.completed || 0,
                                    (projectDashboard?.task_counts?.total || 0) - (projectDashboard?.task_counts?.completed || 0)
                                ]}
                                centerText={calculatePercentage(
                                    projectDashboard?.task_counts?.completed,
                                    projectDashboard?.task_counts?.total
                                )}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{projectDashboard?.task_counts?.completed || 0}</h2>
                            <h3 className="text-sm">completed</h3>
                        </div>
                    </div>
                </div>

                {/* Second vertical data card */}
                <div className="flex flex-col justify-center w-1/12 bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 py-4 rounded-xl">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={`cancelled-${projectDashboard?.task_counts?.cancelled}`}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[
                                    projectDashboard?.task_counts?.cancelled || 0,
                                    (projectDashboard?.task_counts?.total || 0) - (projectDashboard?.task_counts?.cancelled || 0)
                                ]}
                                centerText={calculatePercentage(
                                    projectDashboard?.task_counts?.cancelled,
                                    projectDashboard?.task_counts?.total
                                )}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{projectDashboard?.task_counts?.cancelled || 0}</h2>
                            <h3 className="text-sm">cancelled</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={`on-hold-${projectDashboard?.task_counts?.on_hold}`}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[
                                    projectDashboard?.task_counts?.on_hold || 0,
                                    (projectDashboard?.task_counts?.total || 0) - (projectDashboard?.task_counts?.on_hold || 0)
                                ]}
                                centerText={calculatePercentage(
                                    projectDashboard?.task_counts?.on_hold,
                                    projectDashboard?.task_counts?.total
                                )}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{projectDashboard?.task_counts?.on_hold || 0}</h2>
                            <h3 className="text-sm">on hold</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-2/3">
                            <DonutChart
                                key={`in-review-${projectDashboard?.task_counts?.in_review}`}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[
                                    projectDashboard?.task_counts?.in_review || 0,
                                    (projectDashboard?.task_counts?.total || 0) - (projectDashboard?.task_counts?.in_review || 0)
                                ]}
                                centerText={calculatePercentage(
                                    projectDashboard?.task_counts?.in_review,
                                    projectDashboard?.task_counts?.total
                                )}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">{projectDashboard?.task_counts?.in_review || 0}</h2>
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
                                    key={`teams-progress-${selectedDashboardProject}`}
                                    labels={projectDashboard?.teams_progress?.labels || []}
                                    dataPoints={projectDashboard?.teams_progress?.values || []}
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
                                key={`overall-progress-${projectDashboard?.project_metrics?.overall_progress}`}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[
                                    projectDashboard?.project_metrics?.overall_progress || 0,
                                    100 - (projectDashboard?.project_metrics?.overall_progress || 0)
                                ]}
                                centerText={`${projectDashboard?.project_metrics?.overall_progress || 0}%`}
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
                                key={`in-progress-tasks-${projectDashboard?.project_metrics?.in_progress_tasks}`}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[projectDashboard?.project_metrics?.in_progress_tasks || 0]}
                                centerText={`${projectDashboard?.project_metrics?.in_progress_tasks || 0}`}
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
                                key={`tasks-at-risk-${projectDashboard?.project_metrics?.tasks_at_risk}`}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[projectDashboard?.project_metrics?.tasks_at_risk || 0]}
                                centerText={`${projectDashboard?.project_metrics?.tasks_at_risk || 0}`}
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
                                key={`completed-tasks-${projectDashboard?.project_metrics?.completed_tasks}`}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[projectDashboard?.project_metrics?.completed_tasks || 0]}
                                centerText={`${projectDashboard?.project_metrics?.completed_tasks || 0}`}
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
                                    key={`monthly-progress-${selectedDashboardProject}`}
                                    labels={projectDashboard?.monthly_progress?.labels || []}
                                    dataPoints={projectDashboard?.monthly_progress?.values || []}
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
    )
}