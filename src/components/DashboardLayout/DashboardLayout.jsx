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
    const [Project, setProject] = useState(null)
    const [Team, setTeam] = useState(null)
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
            if (selectedDashboardTeam) {
                const team = projectTeamsData?.data?.data?.teams.find(team => team.id == selectedDashboardTeam)
                setTeam(team)
                if (team == undefined) {
                    setselectedDashboardTeam('');
                }
                handleDashboardTeamChange(team);
            } else {
                const project = projectsData?.data?.data?.projects.find(project => project.id == selectedDashboardProject)
                setProject(project)
                if (project == undefined) {
                    setselectedDashboardProject('');
                }
                handleDashboardProjectChange(project);
            }
        } else {
            navigate('/dashboard')
        }
    }, []);

    function handleDashboardProjectChange(project) {
        console.log(project);

        if (project === undefined) {
            console.log('project undefined');

            navigate('/dashboard')
        }
        if (project?.is_manager) {
            console.log('project manager');

            navigate('project-dashboard')
        } else {
            console.log('not project manager');
            navigate('/dashboard')
        }
    }

    const handleProjectChange = (e) => {
        const project = projectsData?.data?.data?.projects.find(project => project.id == e.target.value)
        console.log(project);
        if (project == undefined) {
            setselectedDashboardProject('');
        }
        handleDashboardProjectChange(project);
        setselectedDashboardProject(e.target.value);
        setselectedDashboardTeam('');
    };

    function handleDashboardTeamChange(Team) {
        console.log(Team);

        console.log(Team);
        if (Team == undefined) {
            setselectedDashboardTeam('');
            handleDashboardProjectChange(Project);
        } else if (Team.role == 'manager' || Team.role == 'leader') {
            navigate('managment-team-dashboard')
        } else {
            navigate('team-dashboard')
        }
    }

    const handleTeamChange = (e) => {
        setselectedDashboardTeam(e.target.value);
        const team = projectTeamsData?.data?.data?.teams.find(team => team.id == e.target.value)
        console.log(team);
        handleDashboardTeamChange(team);

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
                        <div className="min-w-[200px]">
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
                        </div>

                        <div className="min-w-[180px]">
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <Outlet />
        </div>
    );
}