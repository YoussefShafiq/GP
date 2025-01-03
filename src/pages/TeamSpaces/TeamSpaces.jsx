import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Globe, MessageCircleMore, Pin, Plus, UserPlus, Video } from 'lucide-react';
import React from 'react'

export default function TeamSpaces() {

    function getTeamSpaces() {
        return axios.get('../../../public/fakeAPIs/teamspaces.json');
    }

    let { data, isLoading, isFetching } = useQuery({
        queryKey: ['teamSpaces'],
        queryFn: getTeamSpaces
    })


    return <>
        {/* team spaces controls */}
        <div className="flex justify-between items-center space-x-3 p-3  bg-base">

            <h1 className='font-semibold text-xl capitalize'>team spacecs</h1>
            <div className='flex space-x-3'>
                <div className="bg-highlight shadow-md p-2 text-white capitalize rounded-full" title='Invite New Member'>
                    <UserPlus />
                </div>
                <div className="bg-highlight shadow-md p-2 text-white capitalize rounded-full" title='Add New Teamspace'>
                    <Plus />
                </div>
            </div>
        </div>

        {/* team spaces list */}
        <div className="p-5 flex flex-wrap gap-5 ">

            <>
                {data?.data.map((teamspace) => (
                    <div key={teamspace.id} className="relative rounded-3xl mt-5 w-[calc(33%-10px)] border border-darkblue p-4">
                        {/* icon */}
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-10"><div className="bg-black p-3 rounded-full bg-opacity-25 "><Pin color='#133d57' fill='#133d57' /></div></div>
                        {/* content */}
                        <div className="mt-3 ">
                            <h2><span className='font-bold' >Team Name:</span> {teamspace.name}</h2>
                            <h2><span className='font-bold' >Number of Members:</span> {teamspace.assignedMembers}</h2>
                            <h2><span className='font-bold' >Number of Active Tasks:</span> {teamspace.activeTasks}</h2>

                        </div>
                        <div className="w-fit my-2 flex flex-col space-y-2">
                            <div className="bg-darkblue flex p-2 pe-3 rounded-2xl space-x-2 items-center">
                                <div><Globe color='white' /></div>
                                <p className='text-white capitalize'>Schedule meeting</p>
                            </div>
                            <div className="bg-darkblue flex p-2 pe-3 rounded-2xl space-x-2 items-center">
                                <div><Video color='white' /></div>
                                <p className='text-white capitalize'>Video Conference </p>
                            </div>
                            <div className="bg-darkblue flex p-2 pe-3 rounded-2xl space-x-2 items-center">
                                <div><MessageCircleMore color='white' /></div>
                                <p className='text-white capitalize'>Group Chat </p>
                            </div>
                        </div>
                    </div>
                ))}
            </>

        </div>
    </>
}
