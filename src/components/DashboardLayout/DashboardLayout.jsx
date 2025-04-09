import { ChevronDown } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { projectContext } from '../../context/ProjectsContext';
import { TeamsContext } from '../../context/TeamsContext';

export default function DashboardLayout() {
    const { selectedDashboardProject, setselectedDashboardProject } = useContext(projectContext)
    const { selectedDashboardTeam, setselectedDashboardTeam } = useContext(TeamsContext)
    const navigate = useNavigate()

    const token = localStorage.getItem('userToken');

    // Fetch projects with React Query
    const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
        queryKey: ['allprojects'],
        queryFn: () => axios.get('https://brainmate.fly.dev/api/v1/projects/assigned', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
    });

    function getProjectTeams() {
        return axios.get(`https://brainmate.fly.dev/api/v1/projects/${selectedDashboardProject}/teams`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    const { data: projectTeamsData, isLoading: isLoadingTeams } = useQuery({
        queryKey: ['projectTeams', selectedDashboardProject],
        queryFn: getProjectTeams,
        enabled: !!selectedDashboardProject,
    });

    useEffect(() => {
        if (selectedDashboardProject) {
            const project = projectsData.data.data.projects.find(project => project.id == selectedDashboardProject)
            if (project == undefined) {
                setselectedDashboardProject('');
            }
            handleDashboardProjectChange(project);
        } else {
            navigate('/dashboard')
        }
    }, []);

    function handleDashboardProjectChange(project) {
        if (project == undefined) {
            navigate('/dashboard')
        }
        if (project.is_manager) {
            navigate('project-dashboard')
        }
    }

    const handleProjectChange = (e) => {
        const project = projectsData.data.data.projects.find(project => project.id == e.target.value)
        console.log(project);
        if (project == undefined) {
            setselectedDashboardProject('');
        }
        handleDashboardProjectChange(project);
        setselectedDashboardProject(e.target.value);
        setselectedDashboardTeam('');
    };

    const handleTeamChange = (e) => {
        setselectedDashboardTeam(e.target.value);
    };

    return (
        <div className="flex flex-col h-full dark:bg-dark p-5 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center pb-3">
                <div className="text-darkblue dark:text-white font-semibold font-inter text-3xl">
                    Dashboard
                </div>
                <div className="flex space-x-5 items-center">
                    <div className="flex space-x-3">
                        <div className="relative min-w-[200px]">
                            <select
                                value={selectedDashboardProject}
                                onChange={handleProjectChange}
                                className="appearance-none bg-base dark:bg-dark2 text-black dark:text-white pl-4 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
                            >
                                <option value="">Select Project</option>
                                {!isLoadingProjects && projectsData?.data?.data?.projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                size={18}
                            />
                        </div>

                        <div className="relative min-w-[180px]">
                            <select
                                value={selectedDashboardTeam}
                                onChange={handleTeamChange}
                                className="appearance-none bg-base dark:bg-dark2 text-black dark:text-white pl-4 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
                                disabled={!selectedDashboardProject || isLoadingTeams}
                            >
                                <option value="">Select Team</option>
                                {!isLoadingTeams && projectTeamsData?.data?.data?.teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                size={18}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <Outlet />
        </div>
    );
}