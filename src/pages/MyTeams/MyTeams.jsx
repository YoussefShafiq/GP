import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Copy, Globe, Loader2Icon, MessageCircleMore, Pin, Video } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function MyTeams() {
    const token = localStorage.getItem('userToken');
    const [teamNameSearch, setTeamNameSearch] = useState('');
    const [projectNameSearch, setProjectNameSearch] = useState('');

    function getMyTeams() {
        return axios.get(`https://brainmate.fly.dev/api/v1/projects/teams/get/my-teams`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    const { data, isLoading, isFetching, isRefetching } = useQuery({
        queryKey: ['myTeams'],
        queryFn: getMyTeams,
    });

    // Filter teams based on search terms
    const filteredTeams = data?.data?.data.teams.filter(team => {
        const matchesTeamName = team.name.toLowerCase().includes(teamNameSearch.toLowerCase());
        const matchesProjectName = team.name.toLowerCase().includes(projectNameSearch.toLowerCase());
        return matchesTeamName && matchesProjectName;
    });

    return (
        <>
            {/* team spaces controls */}
            <div className="flex flex-col md:flex-row justify-between items-center space-x-3 p-5 text-black ">
                <h1 className='font-semibold text-xl capitalize text-light flex gap-3 '>my teams {isRefetching && <div className="flex md:hidden items-center text-blue-500"><Loader2Icon className='animate-spin' /></div>}</h1>

                <div className="flex flex-col w-full md:w-fit mt-4 md:mt-0 md:flex-row gap-3">
                    {isRefetching && <div className="hidden md:flex items-center text-blue-500"><Loader2Icon className='animate-spin' /></div>}
                    <input
                        type="text"
                        placeholder="Search by team name"
                        value={teamNameSearch}
                        onChange={(e) => setTeamNameSearch(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-light focus:border-light"
                    />
                    <input
                        type="text"
                        placeholder="Search by project name"
                        value={projectNameSearch}
                        onChange={(e) => setProjectNameSearch(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-light focus:border-light"
                    />
                </div>
            </div>

            {/* team spaces list */}
            <div className="p-5 flex flex-wrap gap-5">
                {isLoading ? (
                    <>
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="md:w-[calc(33%-10px)] w-full bg-slate-400 opacity-20 rounded-2xl">
                                <div className="h-10"></div>
                                <div className="flex flex-col space-y-3 p-5">
                                    <div className="bg-black h-8 w-2/3 rounded-xl animate-pulse"></div>
                                    <div className="bg-black h-8 w-1/3 rounded-xl animate-pulse"></div>
                                    <div className="bg-black h-8 w-2/3 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {filteredTeams?.map((team) => (
                            <div key={team.id} className="relative rounded-3xl mt-5 md:w-[calc(33%-10px)] w-full bg-base shadow-lg p-4">
                                {/* icon */}
                                <div className="absolute left-1/2 -translate-x-1/2 -translate-y-10">
                                    <div className="bg-light shadow-inner text-white p-3 rounded-full text-xl">{team.name}</div>
                                </div>
                                {/* content */}
                                <div className="mt-3">
                                    <h2><span className='font-semibold'>project:</span> {team.project_id}</h2>
                                    <h2><span className='font-semibold'>role:</span> {team.role}</h2>
                                    <h2><span className='font-semibold'>created at:</span> {team.created_at.substring(0, 10).replaceAll('-', '/')}</h2>
                                </div>
                                <div className="my-2 flex items-center justify-center gap-2 md:gap-5">
                                    <div className="bg-darkblue flex justify-center p-2 rounded-full space-x-2 items-center h-full">
                                        <button><Globe color='white' /></button>
                                    </div>
                                    <div className="bg-darkblue flex justify-center p-2 rounded-full space-x-2 items-center h-full">
                                        <button><Video color='white' /></button>
                                    </div>
                                    <div className="bg-darkblue flex justify-center p-2 rounded-full space-x-2 items-center h-full">
                                        <button><MessageCircleMore color='white' /></button>
                                    </div>
                                    {team.role !== 'member' && (
                                        <div
                                            className="flex w-fit ms-auto items-center gap-2 p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                                            onClick={() => {
                                                navigator.clipboard.writeText(team.team_code);
                                                toast.success('added to clipboard', {
                                                    duration: 2000,
                                                    position: 'bottom-right',
                                                });
                                            }}
                                        >
                                            <span className="text-black">{team.team_code}</span>
                                            <Copy size={18} className="text-gray-500" />
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