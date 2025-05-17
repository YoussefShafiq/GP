import React, { useContext, useEffect, useState } from 'react'
import VerticalBarChart from '../../components/VerticalBarChart/VerticalBarChart';
import DonutChart from '../../components/DonutChart/DonutChart';
import LineChart from '../../components/LineChart/LineChart';
import { projectContext } from '../../context/ProjectsContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TeamsContext } from '../../context/TeamsContext';

export default function MemberTeamDashboard() {
    const { selectedDashboardProject, setselectedDashboardProject } = useContext(projectContext)
    const { selectedDashboardTeam, setselectedDashboardTeam } = useContext(TeamsContext)

    const [TeamDashboard, setTeamDashboard] = useState(null)

    function getTeamDashboardData() {
        return axios.get(`https://brainmate-new.fly.dev/api/v1/dashboard/team/member/${selectedDashboardTeam}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            },
        })
    }

    const { data: TeamData, isLoading: isTeamLoading } = useQuery({
        queryKey: ['TeamDashboardData', selectedDashboardTeam],
        queryFn: getTeamDashboardData
    })

    useEffect(() => {
        if (TeamData?.data?.data) {
            setTeamDashboard(TeamData?.data?.data)
        }
        console.log(TeamDashboard);


    }, [TeamData, selectedDashboardTeam])


    const linechartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dataPoints: [5, 9, 1, 5, 2, 4, 5, 2, 4, 5, 2, 4, 5],
    };

    return <>
        <div className="flex flex-col gap-5">
            <div className="flex gap-5">
                <div className="flex flex-col items-center gap-5 w-1/5 ">
                    <div className="w-full flex flex-col justify-center items-center text-center h-1/2 text-sm bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 p-4 rounded-xl">
                        <div className="w-2/3">
                            <DonutChart
                                key={TeamDashboard}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[TeamDashboard?.task_alerts?.overdue, TeamDashboard?.task_counts?.total]}
                                centerText={`${Math.round(((TeamDashboard?.task_alerts?.overdue / TeamDashboard?.task_counts?.total) * 100 || 0) * 10) / 10}%`}
                                fontSize={26}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-sm">Overdue tasks</h3>
                        </div>
                    </div>
                    <div className="w-full flex flex-col justify-center items-center text-center h-1/2 text-sm bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 p-4 rounded-xl">
                        <div className="w-2/3">
                            <DonutChart
                                key={TeamDashboard}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[TeamDashboard?.task_alerts?.at_risk, TeamDashboard?.task_counts?.total - TeamDashboard?.task_alerts?.at_risk]}
                                centerText={`${Math.round(((TeamDashboard?.task_alerts?.at_risk / TeamDashboard?.task_counts?.total) * 100 || 0) * 10) / 10}%`}
                                fontSize={26}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-sm">At risk tasks</h3>
                        </div>
                    </div>
                </div>
                <div className="w-4/5 flex flex-col">
                    <div className="bg-base dark:bg-dark1 shadow-lg rounded-2xl">
                        <div className="flex justify-between items-center pt-4 px-6">
                            <h2 className="font-inter font-bold text-gray-900 dark:text-white">
                                Total tasks duration per month
                            </h2>
                        </div>
                        <div className="flex">
                            <div className="w-full p-5">
                                <LineChart
                                    key={TeamDashboard}
                                    labels={TeamDashboard?.monthly_duration?.labels}
                                    dataPoints={TeamDashboard?.monthly_duration?.values}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-5">
                <div className="flex flex-col space-y-4 bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl">
                    <div className="w-full">
                        <DonutChart
                            key={TeamDashboard}
                            dataPoints={[TeamDashboard?.avg_completion_time]}
                            centerText={`${TeamDashboard?.avg_completion_time || 0}`}
                            label="AVG time to complete tasks"
                            fontSize={45}
                            backgroundColors={['#F25287']}
                            hoverColors={['#FF668E']}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center w-full bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl overflow-hidden h-full">
                    <div className="w-full flex flex-col justify-center items-center text-center h-1/2 text-sm  text-black dark:text-white gap-2 p-4 rounded-xl">

                        <div className="flex items-center w-full text-start">
                            <h2 className="text-lg font-semibold w-1/4">Team Name</h2>
                            <h3 className="text-base w-3/4 text-start">{TeamDashboard?.team_info?.name}</h3>
                        </div>
                        <div className="w-full bg-white opacity-20 h-[1px] m-auto my-2"></div>
                        <div className="flex items-center w-full text-start">
                            <h2 className="text-lg font-semibold w-1/4">Role</h2>
                            <h3 className="text-base w-3/4 text-start">{TeamDashboard?.team_info?.role}</h3>
                        </div>
                        <div className="w-full bg-white opacity-20 h-[1px] m-auto my-2"></div>
                    </div>
                    <div className="flex items-center overflow-hidden w-full">
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                key={TeamDashboard}
                                dataPoints={[TeamDashboard?.task_counts?.pending, TeamDashboard?.task_counts?.total - TeamDashboard?.task_counts?.pending]}
                                centerText={`${Math.round(((TeamDashboard?.task_counts?.pending / TeamDashboard?.task_counts?.total) * 100 || 0) * 10) / 10}%`}
                                label="Pending"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                key={TeamDashboard}
                                dataPoints={[TeamDashboard?.task_counts?.in_progress, TeamDashboard?.task_counts?.total - TeamDashboard?.task_counts?.in_progress]}
                                centerText={`${Math.round(((TeamDashboard?.task_counts?.in_progress / TeamDashboard?.task_counts?.total) * 100 || 0) * 10) / 10}%`}
                                label="in progress"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                key={TeamDashboard}
                                dataPoints={[TeamDashboard?.task_counts?.completed, TeamDashboard?.task_counts?.total - TeamDashboard?.task_counts?.completed]}
                                centerText={`${Math.round(((TeamDashboard?.task_counts?.completed / TeamDashboard?.task_counts?.total) * 100 || 0) * 10) / 10}%`}
                                label="Completed"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                key={TeamDashboard}
                                dataPoints={[TeamDashboard?.task_counts?.in_review, TeamDashboard?.task_counts?.total - TeamDashboard?.task_counts?.in_review]}
                                centerText={`${Math.round(((TeamDashboard?.task_counts?.in_review / TeamDashboard?.task_counts?.total) * 100 || 0) * 10) / 10}%`}
                                label="in review"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                key={TeamDashboard}
                                dataPoints={[TeamDashboard?.task_counts?.cancelled, TeamDashboard?.task_counts?.total - TeamDashboard?.task_counts?.cancelled]}
                                centerText={`${Math.round(((TeamDashboard?.task_counts?.cancelled / TeamDashboard?.task_counts?.total) * 100 || 0) * 10) / 10}%`}
                                label="cancelled"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                key={TeamDashboard}
                                dataPoints={[TeamDashboard?.task_counts?.on_hold, TeamDashboard?.task_counts?.total - TeamDashboard?.task_counts?.on_hold]}
                                centerText={`${Math.round(((TeamDashboard?.task_counts?.on_hold / TeamDashboard?.task_counts?.total) * 100 || 0) * 10) / 10}%`}
                                label="on hold"
                                fontSize={20}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-5">
                <div className=" bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl">
                    <div className="h-[300px]">
                        <DonutChart
                            key={TeamDashboard}
                            labels={['low', 'medium', 'high']}
                            dataPoints={[TeamDashboard?.tasks_by_priority?.low, TeamDashboard?.tasks_by_priority?.medium, TeamDashboard?.tasks_by_priority?.high]}
                            label="Task breakdown by priority"
                            fontSize={45}
                        />
                    </div>
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl">
                        <div className="flex justify-between items-center pt-4 px-6">
                            <h2 className="font-inter font-bold text-gray-900 dark:text-white">
                                Task completion rate over Year
                            </h2>
                        </div>
                        <div className="flex">
                            <div className="w-full p-5">
                                <VerticalBarChart
                                    key={TeamDashboard}
                                    labels={TeamDashboard?.completion_trend?.labels}
                                    dataPoints={TeamDashboard?.completion_trend?.values}
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
