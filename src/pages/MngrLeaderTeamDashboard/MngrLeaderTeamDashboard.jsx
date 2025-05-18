import React, { useContext, useEffect, useState } from 'react'
import DonutChart from '../../components/DonutChart/DonutChart'
import VerticalBarChart from '../../components/VerticalBarChart/VerticalBarChart';
import LineChart from '../../components/LineChart/LineChart';
import { TeamsContext } from '../../context/TeamsContext';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export default function MngrLeaderTeamDashboard() {
    const { selectedDashboardTeam } = useContext(TeamsContext)
    const [teamDashboard, setTeamDashboard] = useState(null)

    function getTeamDashboardData() {
        return axios.get(`https://brainmate-new.fly.dev/api/v1/dashboard/team/leader/${selectedDashboardTeam}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            },
        })
    }

    const { data: teamData, isLoading: isTeamLoading, isError, error } = useQuery({
        queryKey: ['TeamDashboardData', selectedDashboardTeam],
        queryFn: getTeamDashboardData
    })

    useEffect(() => {
        if (teamData?.data?.data) {
            setTeamDashboard(teamData.data.data)
            console.log("Team dashboard data updated:", teamData.data.data)
        }
    }, [teamData, selectedDashboardTeam])

    // Helper function to calculate percentage safely
    const calculatePercentage = (numerator, denominator) => {
        if (!denominator || denominator === 0) return '0%'
        const percentage = (numerator / denominator) * 100
        return `${Math.round(percentage * 10) / 10}%`
    }


    if (isError) {
        return <div className="flex justify-center items-center h-full">{error.response.data.message}</div>
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex gap-5">
                <div className="flex flex-col items-center gap-5 w-1/5">
                    <div className="w-full flex flex-col justify-center items-center text-center h-1/2 text-sm bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 p-4 rounded-xl">
                        <div className="w-2/3">
                            <DonutChart
                                key={`overdue-${teamDashboard?.task_alerts?.overdue}-${selectedDashboardTeam}`}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[
                                    teamDashboard?.task_alerts?.overdue || 0,
                                    teamDashboard?.workload_distribution?.total_team_tasks || 0
                                ]}
                                centerText={calculatePercentage(
                                    teamDashboard?.task_alerts?.overdue,
                                    teamDashboard?.workload_distribution?.total_team_tasks
                                )}
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
                                key={`at-risk-${teamDashboard?.task_alerts?.at_risk}-${selectedDashboardTeam}`}
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={[
                                    teamDashboard?.task_alerts?.at_risk || 0,
                                    (teamDashboard?.workload_distribution?.total_team_tasks || 0) - (teamDashboard?.task_alerts?.at_risk || 0)
                                ]}
                                centerText={calculatePercentage(
                                    teamDashboard?.task_alerts?.at_risk,
                                    teamDashboard?.workload_distribution?.total_team_tasks
                                )}
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
                                Workload distribution across team members
                            </h2>
                        </div>
                        <div className="flex">
                            <div className="w-full p-5">
                                <LineChart
                                    key={`workload-${selectedDashboardTeam}`}
                                    labels={teamDashboard?.workload_distribution?.labels || []}
                                    dataPoints={teamDashboard?.workload_distribution?.percentages || []}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl">
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-base font-medium text-black dark:text-white">Team Progress</span>
                        <span className="text-sm font-medium text-black dark:text-white">
                            {teamDashboard?.team_progress != null ? Math.round(teamDashboard?.team_progress * 10) / 10 : 0}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                            className="bg-light h-2.5 rounded-full"
                            style={{
                                width: `${teamDashboard?.team_progress || 0}%`,
                                backgroundColor: '#00c5c9'
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-5">
                <div className="flex flex-col space-y-4 bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl">
                    <div className="w-full">
                        <DonutChart
                            key={`avg-completion-${teamDashboard?.avg_completion_time}-${selectedDashboardTeam}`}
                            dataPoints={[teamDashboard?.avg_completion_time || 0]}
                            centerText={`${teamDashboard?.avg_completion_time || 0}h`}
                            label="AVG time to complete tasks"
                            fontSize={45}
                            backgroundColors={['#F25287']}
                            hoverColors={['#FF668E']}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center w-full bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl overflow-hidden h-full">
                    <div className="w-full flex flex-col justify-center items-center text-center h-1/2 text-sm text-black dark:text-white gap-2 p-4 rounded-xl">
                        <div className="flex items-center w-full text-start">
                            <h2 className="text-lg font-semibold w-1/4">Team Name</h2>
                            <h3 className="text-base w-3/4 text-start">{teamDashboard?.team_info?.name || 'N/A'}</h3>
                        </div>
                        <div className="w-full bg-white opacity-20 h-[1px] m-auto my-2"></div>
                        <div className="flex items-center w-full text-start">
                            <h2 className="text-lg font-semibold w-1/4">Role</h2>
                            <h3 className="text-base w-3/4 text-start">{teamDashboard?.team_info?.role || 'N/A'}</h3>
                        </div>
                        <div className="w-full bg-white opacity-20 h-[1px] m-auto my-2"></div>
                    </div>
                    <div className="flex items-center overflow-hidden w-full">
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                key={`pending-${teamDashboard?.task_counts?.pending}-${selectedDashboardTeam}`}
                                dataPoints={[
                                    teamDashboard?.task_counts?.pending || 0,
                                    (teamDashboard?.workload_distribution?.total_team_tasks || 0) - (teamDashboard?.task_counts?.pending || 0)
                                ]}
                                centerText={calculatePercentage(
                                    teamDashboard?.task_counts?.pending,
                                    teamDashboard?.workload_distribution?.total_team_tasks
                                )}
                                label="Pending"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                key={`in-progress-${teamDashboard?.task_counts?.in_progress}-${selectedDashboardTeam}`}
                                dataPoints={[
                                    teamDashboard?.task_counts?.in_progress || 0,
                                    (teamDashboard?.workload_distribution?.total_team_tasks || 0) - (teamDashboard?.task_counts?.in_progress || 0)
                                ]}
                                centerText={calculatePercentage(
                                    teamDashboard?.task_counts?.in_progress,
                                    teamDashboard?.workload_distribution?.total_team_tasks
                                )}
                                label="in progress"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                key={`completed-${teamDashboard?.task_counts?.completed}-${selectedDashboardTeam}`}
                                dataPoints={[
                                    teamDashboard?.task_counts?.completed || 0,
                                    (teamDashboard?.workload_distribution?.total_team_tasks || 0) - (teamDashboard?.task_counts?.completed || 0)
                                ]}
                                centerText={calculatePercentage(
                                    teamDashboard?.task_counts?.completed,
                                    teamDashboard?.workload_distribution?.total_team_tasks
                                )}
                                label="Completed"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                key={`in-review-${teamDashboard?.task_counts?.in_review}-${selectedDashboardTeam}`}
                                dataPoints={[
                                    teamDashboard?.task_counts?.in_review || 0,
                                    (teamDashboard?.workload_distribution?.total_team_tasks || 0) - (teamDashboard?.task_counts?.in_review || 0)
                                ]}
                                centerText={calculatePercentage(
                                    teamDashboard?.task_counts?.in_review,
                                    teamDashboard?.workload_distribution?.total_team_tasks
                                )}
                                label="in review"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                key={`cancelled-${teamDashboard?.task_counts?.cancelled}-${selectedDashboardTeam}`}
                                dataPoints={[
                                    teamDashboard?.task_counts?.cancelled || 0,
                                    (teamDashboard?.workload_distribution?.total_team_tasks || 0) - (teamDashboard?.task_counts?.cancelled || 0)
                                ]}
                                centerText={calculatePercentage(
                                    teamDashboard?.task_counts?.cancelled,
                                    teamDashboard?.workload_distribution?.total_team_tasks
                                )}
                                label="cancelled"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                key={`on-hold-${teamDashboard?.task_counts?.on_hold}-${selectedDashboardTeam}`}
                                dataPoints={[
                                    teamDashboard?.task_counts?.on_hold || 0,
                                    (teamDashboard?.workload_distribution?.total_team_tasks || 0) - (teamDashboard?.task_counts?.on_hold || 0)
                                ]}
                                centerText={calculatePercentage(
                                    teamDashboard?.task_counts?.on_hold,
                                    teamDashboard?.workload_distribution?.total_team_tasks
                                )}
                                label="on hold"
                                fontSize={20}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-5">
                <div className="bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl">
                    <div className="h-[300px]">
                        <DonutChart
                            key={`priority-${teamDashboard?.tasks_by_priority?.low}-${teamDashboard?.tasks_by_priority?.medium}-${teamDashboard?.tasks_by_priority?.high}-${selectedDashboardTeam}`}
                            labels={['low', 'medium', 'high']}
                            dataPoints={[
                                teamDashboard?.tasks_by_priority?.low || 0,
                                teamDashboard?.tasks_by_priority?.medium || 0,
                                teamDashboard?.tasks_by_priority?.high || 0
                            ]}
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
                                    key={`completion-trend-${selectedDashboardTeam}`}
                                    labels={teamDashboard?.completion_trend?.labels || []}
                                    dataPoints={teamDashboard?.completion_trend?.values || []}
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