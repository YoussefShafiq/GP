import { ChevronRight, MousePointerClick } from 'lucide-react';
import React, { useContext } from 'react'
import { MaterialsContext } from '../../context/MaterialsContext';
import { useNavigate } from 'react-router-dom';

export default function MaterialsItems() {

    const { selectedProjectFolder, setselectedProjectFolder, selectedTeamFolder, setselectedTeamFolder } = useContext(MaterialsContext)
    const navigate = useNavigate()
    const token = localStorage.getItem('userToken');

    if (!selectedTeamFolder) {
        return (
            <div className="h-[calc(100vh-48px)] flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                    <MousePointerClick size={35} className='text-light' />
                    <h2 className='capitalize'>Please select team folder first</h2>
                </div>
            </div>
        );
    }

    return <>

        <div className="p-5">
            {/* path */}
            <div className='text-gray-400 flex justify-between items-center h-10 mb-5 px-5'>
                <div className='flex items-center ' >
                    <div onClick={() => { navigate('/materials'); }} className="pe-1 cursor-pointer">Materials</div><ChevronRight strokeWidth={0.7} />
                    <div onClick={() => { navigate('/materials/project'); }} className="pe-1 cursor-pointer ">{selectedProjectFolder?.name}</div><ChevronRight strokeWidth={0.7} />
                    <div onClick={() => { navigate('/materials/project'); }} className="pe-1 cursor-pointer text-black">{selectedTeamFolder?.name}</div>
                </div>
            </div>

        </div>

    </>
}
