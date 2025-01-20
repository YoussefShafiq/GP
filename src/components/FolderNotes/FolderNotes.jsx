import { useQuery } from '@tanstack/react-query'
import React, { useContext } from 'react'
import { NotesContext } from '../../context/NotesContext';
import axios from 'axios';

export default function FolderNotes() {
    const token = localStorage.getItem('userToken')
    const { selectedFolder, selectedFolderName, selectedNote, setSelectedNote } = useContext(NotesContext)


    function getFolderNotes() {
        return axios.get(`https://brainmate.fly.dev/api/v1/notes/folders/${selectedFolder}/notes`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    let { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['folderNotes'],
        queryFn: getFolderNotes,
    })

    let noteDetails = useQuery({
        queryKey: ['noteDetails'],
    })
    return <>
        {/* notes inside selected folder */}
        <div className="mt-2 flex flex-col space-y-3 text-white w-full">
            <div className="flex justify-between pe-3">
                <div className="ms-3 mb-1 opacity-50 capitalize">{selectedFolderName ? selectedFolderName : 'select folder to show notes'}</div>
                <div className="ms-3 mb-1 opacity-50 capitalize">{isFetching ? '' : data?.data.data.length}</div>

            </div>
            {/* note */}
            {isLoading ? <>
                <div className="flex flex-col p-2 space-y-2">
                    <div className="h-10 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.0s" }} ></div>
                    <div className="h-10 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.15s" }} ></div>
                    <div className="h-10 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.3s" }} ></div>
                </div>
            </> :
                <>
                    {data?.data.data.map((note) => {
                        return (
                            <div key={note.id} className={`mx-2 ${selectedNote === note.id ? 'bg-light bg-opacity-90' : 'bg-white bg-opacity-5'}  flex flex-col p-2 rounded cursor-pointer`} onClick={() => {
                                setSelectedNote(note.id); setTimeout(() => {
                                    noteDetails.refetch()
                                }, 100);
                            }}>
                                <div className="text-[16px] font-semibold pb-1">{note.title}</div>
                                <div className="flex justify-between items-center opacity-80">
                                    {/* date */}
                                    <div className="">{note.created_at.substring(0, 10)}</div>
                                    {/* note */}
                                    <div className="">{note.content.length > 25 ? note.content.substring(0, 25) + '...' : note.content}</div>
                                </div>
                            </div>
                        )
                    })}
                </>}

        </div>
    </>
}
