import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Copy, Globe, Loader2Icon, MessageCircleMore, Pin, Video } from 'lucide-react';
import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { projectContext } from '../../context/ProjectsContext';
import { TeamsContext } from '../../context/TeamsContext';
import { ChatContext } from '../../context/ChatContext';

export default function MyTeams() {
    const token = localStorage.getItem('userToken');
    const [teamNameSearch, setTeamNameSearch] = useState('');
    const [projectNameSearch, setProjectNameSearch] = useState('');
    const { selectedChat, setselectedChat } = useContext(ChatContext);
    let { selectedProject, setselectedProject } = useContext(projectContext);
    let { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const navigate = useNavigate()

    function getMyTeams() {
        return axios.get(`https://brainmate.fly.dev/api/v1/projects/teams/get/my-teams`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    const { data, isLoading, isFetching, isRefetching, isError, error } = useQuery({
        queryKey: ['myTeams'],
        queryFn: getMyTeams,
    });

    // Filter teams based on search terms
    const filteredTeams = data?.data?.data.teams.filter(team => {
        const matchesTeamName = team.name.toLowerCase().includes(teamNameSearch.toLowerCase());
        const matchesProjectName = team.project.name.toLowerCase().includes(projectNameSearch.toLowerCase());
        return matchesTeamName && matchesProjectName;
    });

    if (isError) {
        return <div className="text-center py-5 h-[90vh] flex items-center justify-center">
            Oops!, {error.response.data.message}
        </div>
    }

    return (
        <>
            {/* team spaces controls */}
            <div className="flex flex-col md:flex-row justify-between items-center space-x-3 p-5 text-black ">
                <h1 className='font-semibold text-xl capitalize text-black dark:text-white flex gap-3 '>my teams {isRefetching && <div className="flex md:hidden items-center text-blue-500"><Loader2Icon className='animate-spin' /></div>}</h1>

                <div className="flex flex-col w-full md:w-fit mt-4 md:mt-0 md:flex-row gap-3">
                    {isRefetching && <div className="hidden md:flex items-center text-blue-500"><Loader2Icon className='animate-spin' /></div>}
                    <input
                        type="text"
                        placeholder="Search by team name"
                        value={teamNameSearch}
                        onChange={(e) => setTeamNameSearch(e.target.value)}
                        className="p-2 border border-gray-300 dark:bg-dark1 dark:text-white rounded-lg focus:ring-light focus:border-light"
                    />
                    <input
                        type="text"
                        placeholder="Search by project name"
                        value={projectNameSearch}
                        onChange={(e) => setProjectNameSearch(e.target.value)}
                        className="p-2 border border-gray-300 dark:bg-dark1 dark:text-white rounded-lg focus:ring-light focus:border-light"
                    />
                </div>
            </div>

            {/* teams list */}
            <div className="p-5 flex flex-wrap gap-5">
                {isLoading ? (
                    <>
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="md:w-[calc(33%-10px)] w-full bg-slate-400 dark:bg-dark2 opacity-20 dark:opacity-80 rounded-2xl">
                                <div className="h-10"></div>
                                <div className="flex flex-col space-y-3 p-5">
                                    <div className="bg-black dark:bg-dark1 h-8 w-2/3 rounded-xl animate-pulse"></div>
                                    <div className="bg-black dark:bg-dark1 h-8 w-1/3 rounded-xl animate-pulse"></div>
                                    <div className="bg-black dark:bg-dark1 h-8 w-2/3 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {filteredTeams?.map((team) => (
                            <div onClick={() => {
                                setselectedProject(team.project);
                                setselectedTeam(team);
                                navigate(`/project/team`);
                            }} key={team.id} className="relative rounded-3xl mt-5 md:w-[calc(50%-10px)] lg:w-[calc(33%-10px)] w-full bg-base dark:bg-dark1 shadow-lg p-4 pt-7 cursor-pointer hover:scale-[1.02] duration-300">
                                {/* name */}
                                <div className="absolute w-max max-w-full left-1/2 -translate-x-1/2 -translate-y-full">
                                    <div className="bg-light shadow-inner text-white p-3 rounded-full text-xl">{team.name}</div>
                                </div>
                                {/* content */}
                                <div className="mt-3">
                                    <h2><span className='font-semibold'>Project:</span> {team.project.name}</h2>
                                    <h2><span className='font-semibold'>Role:</span> {team.role}</h2>
                                    <h2><span className='font-semibold'>Created at:</span> {team.created_at.substring(0, 10).replaceAll('-', '-')}</h2>
                                </div>
                                <div className="my-2 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-5">
                                    <div className="flex items-center justify-center gap-2 md:gap-5">
                                        {/* <div className="bg-darkblue flex justify-center p-2 rounded-full space-x-2 items-center h-full">
                                            <button><Video color='white' /></button>
                                        </div> */}
                                        <div onClick={(e) => {
                                            navigate('/chat');
                                            e.stopPropagation();
                                            setselectedChat({
                                                'id': team.id,
                                                'name': team.name,
                                                'project': {
                                                    'name': team.project.name
                                                }
                                            })
                                        }} className="bg-darkblue dark:bg-dark2 flex justify-center p-2 rounded-full space-x-2 items-center h-full hover:scale-110 transition-all">
                                            <button onClick={() => navigate('/chat')} ><MessageCircleMore color='white' /></button>
                                        </div>
                                    </div>
                                    {team.role !== 'member' && (
                                        <div
                                            className="flex w-fit md:ms-auto items-center gap-2 p-2 bg-white dark:bg-dark2 dark:text-white shadow-inner rounded-lg cursor-pointer hover:bg-gray-50"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigator.clipboard.writeText(team.team_code);
                                                toast.success('added to clipboard', {
                                                    duration: 2000,
                                                    position: 'bottom-right',
                                                });
                                            }}
                                        >
                                            <span className="text-black dark:text-white">{team.team_code}</span>
                                            <Copy size={18} className="text-gray-500 " />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </>
    );
}