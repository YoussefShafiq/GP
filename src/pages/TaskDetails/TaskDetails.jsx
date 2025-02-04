import React, { useContext } from 'react'
import { TaskContext } from '../../context/TaskContext'
import { useNavigate } from 'react-router-dom';
import { TeamsContext } from '../../context/TeamsContext';
import { projectContext } from '../../context/ProjectsContext';

export default function TaskDetails() {
    let { selectedTask, setselectedTask } = useContext(TaskContext)
    let { selectedProject, setselectedProject } = useContext(projectContext);
    let { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const token = localStorage.getItem('userToken');
    const navigate = useNavigate();

    return <>
        <div className="p-5">
            <div className='text-light font-semibold flex items-center h-6 px-5'>
                {!selectedTask.assigned_to_me && <>
                    <div onClick={() => { navigate('/project'); setselectedTeam(null) }} className="pe-1 cursor-pointer">{selectedProject?.name}</div> /
                    <div onClick={() => { navigate('/project/team'); }} className="px-1 cursor-pointer">{selectedTeam?.name}</div> /
                </>}
                {selectedTask.assigned_to_me && <>
                    <div onClick={() => { navigate('/mytasks'); setselectedTeam(null) }} className="pe-1 cursor-pointer capitalize">my tasks</div> /
                </>}
                <div onClick={() => { navigate('/project/team/task-details'); }} className="px-1 cursor-pointer">{selectedTask?.name}</div>
            </div>
        </div>
    </>
}
