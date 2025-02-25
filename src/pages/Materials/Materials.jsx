import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronRight, FolderMinus, Square } from 'lucide-react'
import React, { useContext } from 'react'
import { MaterialsContext } from '../../context/MaterialsContext';
import { useNavigate } from 'react-router-dom';
import MaterialFolderSkeleton from '../../components/MaterialFolderSkeleton/MaterialFolderSkeleton';

export default function Materials() {
    const { selectedProjectFolder, setselectedProjectFolder } = useContext(MaterialsContext)
    const navigate = useNavigate()
    const token = localStorage.getItem('userToken');

    // Fetch projects
    function getProjects() {
        return axios.get('https://brainmate.fly.dev/api/v1/projects/assigned', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    let { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['allprojects'],
        queryFn: getProjects,
        keepPreviousData: true,
    });

    return <>
        <div className="p-5">
            {/* path */}
            <div className='text-black flex justify-between items-center h-10 px-5 mb-5'>
                <div className='flex items-center ' >
                    <div onClick={() => { navigate('/materials'); }} className="pe-1 cursor-pointer ">Materials</div><ChevronRight strokeWidth={0.7} />
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
                    {data?.data.data.projects.map((project) => (
                        <div key={project.id} onClick={() => {
                            setselectedProjectFolder(project)
                            navigate('project')
                        }} className="relative bg-base rounded-lg shadow-lg p-6 w-full lg:w-[calc(25%-10px)] rounded-tl-none mt-5 cursor-pointer ">
                            <div className="absolute w-1/2 -top-6 left-0 bg-base h-6 text-white text-sm font-semibold px-4 py-1 rounded-tl-lg rounded-tr-3xl "></div>
                            <div className="">
                                <div className="flex items-center gap-2">
                                    <div className="aspect-square p-1.5 rounded-lg bg-highlight"><Square fill='#eee' color='#eee' size={8} /></div>
                                    <h2 className="text-lg font-bold text-gray-800">{project.name}</h2>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-sm text-gray-500 mt-2">{project.created_at.substring(0, 10)}</p>
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
