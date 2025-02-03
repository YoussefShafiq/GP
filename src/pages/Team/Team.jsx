import React, { useContext, useState } from 'react';
import { projectContext } from '../../context/ProjectsContext';
import { MousePointerClick, Plus, Trash2, Copy, UserRoundPlus, LogOut, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import { useNavigate } from 'react-router-dom';
import { TeamsContext } from '../../context/TeamsContext';
import LeaveTeamForm from '../../components/LeaveTeamForm/LeaveTeamForm';
import DeleteTeamForm from '../../components/DeleteTeamForm/DeleteTeamForm';
import UpdateTeamForm from '../../components/UpdateTeamForm/UpdateTeamForm';
import InviteMemberForm from '../../components/InviteMemberForm/InviteMemberForm';
import AddTaskForm from '../../components/AddTaskForm/AddTaskForm';
import TasksTable from '../../components/TasksTable/TasksTable';

export default function Team() {
    let { selectedProject, setselectedProject } = useContext(projectContext);
    let { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const [deleteTeamForm, setDeleteTeamForm] = useState(false);
    const [leaveTeamForm, setLeaveTeamForm] = useState(false);
    const [updateTeamForm, setUpdateTeamForm] = useState(false);
    const [inviteMemberForm, setInviteMemberForm] = useState(false);
    const [addTaskForm, setAddTaskForm] = useState(false);
    const token = localStorage.getItem('userToken');
    const navigate = useNavigate();
    const queryClient = useQueryClient(); // Initialize queryClient

    // Get team details function
    function getTeamDetails() {
        return axios.get(`https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // Get team details query
    let { data: teamData, isLoading: isTeamLoading, error: teamError } = useQuery({
        queryKey: ['teamDetails', selectedTeam?.id],
        queryFn: getTeamDetails,
        enabled: !!selectedTeam,
    });

    // Get team members function
    function getTeamMembers() {
        return axios.get(`https://brainmate.fly.dev/api/v1/projects/teams/${selectedTeam.id}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // Get team members query
    let { data: teamMembers } = useQuery({
        queryKey: ['teamMembers', selectedTeam?.id],
        queryFn: getTeamMembers,
        enabled: !!selectedTeam,
    });

    // Get team tasks function
    function getTeamTasks() {
        return axios.get(`https://brainmate.fly.dev/api/v1/tasks/teams/${selectedTeam.id}/tasks`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // Get team tasks query
    let { data: teamTasks, isError } = useQuery({
        queryKey: ['teamTasks', selectedTeam?.id],
        queryFn: getTeamTasks,
        enabled: !!selectedTeam,
    });

    // Invalidate the teamTasks query when tasks are added, updated, or deleted
    const invalidateTeamTasks = () => {
        queryClient.invalidateQueries(['teamTasks', selectedTeam?.id]);
    };

    if (!selectedTeam) {
        return (
            <div className="h-[calc(100vh-48px)] flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                    <MousePointerClick size={35} className='text-light' />
                    <h2 className='capitalize'>Please select team first</h2>
                </div>
            </div>
        );
    }

    console.log(teamTasks?.data?.data.tasks);

    return (
        <>
            {/* Leave Team Form */}
            <LeaveTeamForm isOpen={leaveTeamForm} onClose={() => setLeaveTeamForm(false)} selectedTeam={selectedTeam} setselectedTeam={setselectedTeam} />

            {/* Delete Team Form */}
            <DeleteTeamForm isOpen={deleteTeamForm} onClose={() => setDeleteTeamForm(false)} selectedTeam={selectedTeam} setselectedTeam={setselectedTeam} />

            {/* Update Team Form */}
            <UpdateTeamForm isOpen={updateTeamForm} onClose={() => setUpdateTeamForm(false)} selectedTeam={selectedTeam} setselectedTeam={setselectedTeam} />

            {/* Invite Member Form */}
            <InviteMemberForm isOpen={inviteMemberForm} onClose={() => setInviteMemberForm(false)} selectedTeam={selectedTeam} />

            {/* Add Task Form */}
            <AddTaskForm
                isOpen={addTaskForm}
                onClose={() => {
                    setAddTaskForm(false);
                    invalidateTeamTasks(); // Invalidate the teamTasks query when the form is closed
                }}
                selectedTeam={selectedTeam}
                token={token}
                teamMembers={teamMembers}
            />

            {/* Loading Skeleton */}
            {isTeamLoading ? (
                <div className="p-5">
                    <div className="flex justify-between items-center mb-5">
                        <div className='text-light font-semibold flex items-center'>
                            <div onClick={() => { navigate('/project'); setselectedTeam(null) }} className="pe-1 cursor-pointer">{selectedProject?.name}</div> / <div className="ps-1 cursor-pointer">{selectedTeam?.name}</div>
                        </div>
                        {/* Buttons Skeleton */}
                        <div className="flex gap-2">
                            <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse"></div>
                            <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-5">
                    <div className="flex justify-between items-center mb-5 h-9">
                        {/* Path */}
                        <div className='text-light font-semibold flex items-center'>
                            <div onClick={() => { navigate('/project'); setselectedTeam(null) }} className="pe-1 cursor-pointer">{selectedProject?.name}</div> / <div className="ps-1 cursor-pointer">{selectedTeam?.name}</div>
                        </div>
                        <div className="flex gap-2">
                            {teamData?.data?.data.team.role !== 'member' && (<>
                                {/* Team Code with Copy Icon */}
                                <div
                                    className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                                    onClick={() => {
                                        navigator.clipboard.writeText(teamData?.data.data.team.team_code);
                                        toast.success('added to clipboard', {
                                            duration: 2000,
                                            position: 'bottom-right',
                                        });
                                    }}
                                >
                                    <span className="text-black">{teamData?.data.data.team.team_code}</span>
                                    <Copy size={18} className="text-gray-500" />
                                </div>
                                <button onClick={() => setUpdateTeamForm(true)} className="rounded-full bg-white text-yellow-400 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Edit size={25} /></button>
                                <button onClick={() => setDeleteTeamForm(true)} className="rounded-full bg-white text-red-600 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Trash2 size={25} /></button>
                                <button onClick={() => setInviteMemberForm(true)} className="rounded-full bg-white text-red-600 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><UserRoundPlus size={25} /></button>
                                <button onClick={() => setAddTaskForm(true)} className="rounded-full bg-white text-blue-500 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Plus size={25} /></button>
                            </>)}
                            <button onClick={() => setLeaveTeamForm(true)} className="rounded-full bg-white text-red-600 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><LogOut size={25} /></button>
                        </div>
                    </div>
                    {/* body */}
                    <div className="p-5">
                        {teamTasks?.data?.data && (
                            <div className="space-y-6">
                                {['pending', 'in_progress', 'completed', 'cancelled', 'on_hold', 'in_review'].map((status, index) => (
                                    <div key={status}>
                                        <div className={`px-3 py-1 text-white my-3 bg-${status} w-fit rounded-lg`}>{status.replace('_', ' ')}</div>
                                        <TasksTable tasks={teamTasks?.data?.data?.tasks.filter((task) => Number(task.status) === index + 1)} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}