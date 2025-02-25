import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronRight, FolderMinus, MousePointerClick, Square } from 'lucide-react'
import React, { useContext } from 'react'
import { MaterialsContext } from '../../context/MaterialsContext';
import { useNavigate } from 'react-router-dom';
import MaterialFolderSkeleton from '../MaterialFolderSkeleton/MaterialFolderSkeleton';

export default function MaterialTeams() {
    const { selectedProjectFolder, setselectedProjectFolder, selectedTeamFolder, setselectedTeamFolder } = useContext(MaterialsContext)
    const navigate = useNavigate()
    const token = localStorage.getItem('userToken');

    function getProjectTeams() {
        return axios.get(`https://brainmate.fly.dev/api/v1/projects/${selectedProjectFolder.id}/teams`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    let { data, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['projectTeams', selectedProjectFolder?.id], // Add selectedProject.id to queryKey
        queryFn: getProjectTeams,
        keepPreviousData: true,
    });

    if (!selectedProjectFolder) {
        return (
            <div className="h-[calc(100vh-48px)] flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                    <MousePointerClick size={35} className='text-light' />
                    <h2 className='capitalize'>Please select project folder first</h2>
                </div>
            </div>
        );
    }

    return <>
        <div className="p-5">
            {/* path */}
            <div className='text-gray-400 flex flex-wrap justify-between items-center h-10 mb-5 px-5'>
                <div className='flex items-center ' >
                    <div onClick={() => { navigate('/materials'); }} className="pe-1 cursor-pointer">Materials</div><ChevronRight strokeWidth={0.7} />
                    <div onClick={() => { navigate('/materials/project'); }} className="pe-1 cursor-pointer text-black">{selectedProjectFolder?.name}</div>
                </div>
            </div>


            {/* folders */}
            <div className="flex flex-wrap gap-3">
                {isLoading ? <>
                    <MaterialFolderSkeleton />
                    <MaterialFolderSkeleton />
                    <MaterialFolderSkeleton />
                    <MaterialFolderSkeleton />
                </> : <>
                    {data?.data.data.teams.filter(team => team.hasAccess).map((team) => (
                        <div key={team.id} onClick={() => {
                            setselectedTeamFolder(team)
                            navigate('team')
                        }} className="relative bg-base rounded-lg shadow-lg p-6 w-full lg:w-[calc(25%-10px)] rounded-tl-none mt-5 cursor-pointer ">
                            <div className="absolute w-1/2 -top-6 left-0 bg-base h-6 text-white text-sm font-semibold px-4 py-1 rounded-tl-lg rounded-tr-3xl "></div>
                            <div className="">
                                <div className="flex items-center gap-2">
                                    <div className="aspect-square p-1.5 rounded-lg bg-highlight"><Square fill='#eee' color='#eee' size={8} /></div>
                                    <h2 className="text-lg font-bold text-gray-800">{team.name}</h2>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-sm text-gray-500 mt-2">{team.created_at.substring(0, 10)}</p>
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                </div>
                            </div>
                        </div>
                    ))}
                </>}
            </div>
        </div>
    </>
}
