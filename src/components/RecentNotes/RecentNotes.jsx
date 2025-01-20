import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { NotebookText } from 'lucide-react';
import React, { useContext } from 'react';
import { NotesContext } from '../../context/NotesContext';

export default function RecentNotes() {
    const { selectedNote, setSelectedNote } = useContext(NotesContext);
    const token = localStorage.getItem('userToken');

    // Function to fetch all notes
    function getAllNotes() {
        return axios.get(`https://brainmate.fly.dev/api/v1/notes`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // React Query to fetch notes
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['recentNotes'],
        queryFn: getAllNotes,
    });

    // React Query to fetch note details
    let noteDetails = useQuery({
        queryKey: ['noteDetails'],
    });

    return (
        <>
            <div className="mt-2 flex flex-col space-y-0 text-white">
                <div className="ms-3 mb-1 opacity-50 capitalize">Recents</div>
                {isLoading ? (
                    <>
                        <div className="flex flex-col p-2 space-y-2">
                            <div
                                className="h-8 bg-slate-400 opacity-20 rounded animate-pulse"
                                style={{ animationDelay: '0.0s' }}
                            ></div>
                            <div
                                className="h-8 bg-slate-400 opacity-20 rounded animate-pulse"
                                style={{ animationDelay: '0.15s' }}
                            ></div>
                            <div
                                className="h-8 bg-slate-400 opacity-20 rounded animate-pulse"
                                style={{ animationDelay: '0.3s' }}
                            ></div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Slice the array to get the first 3 elements */}
                        {data?.data.data.slice(0, 3).map((note) => {
                            return (
                                <div
                                    key={note.id}
                                    className={`px-3 mx-3 rounded flex items-center space-x-2 my-4 py-2 ${selectedNote === note.id ? 'bg-light' : 'opacity-50'
                                        } cursor-pointer`}
                                    onClick={() => {
                                        setSelectedNote(note.id);
                                        setTimeout(() => {
                                            noteDetails.refetch();
                                        }, 100);
                                    }}
                                >
                                    <NotebookText size={20} />
                                    <p>{note.title}</p>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </>
    );
}