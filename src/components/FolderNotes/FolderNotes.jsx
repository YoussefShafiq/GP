import { useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect } from 'react';
import { NotesContext } from '../../context/NotesContext';
import axios from 'axios';
import { ArchiveRestore, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FolderNotes() {
    const token = localStorage.getItem('userToken');
    const { selectedFolder, selectedFolderName, selectedNote, setSelectedNote } = useContext(NotesContext);

    // Fetch notes in the selected folder
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['folderNotes', selectedFolder],
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/notes/folders/${selectedFolder}/notes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        enabled: !!selectedFolder, // Only fetch if a folder is selected
    });

    // Fetch details of the selected note
    const {
        data: noteDetails,
        refetch: refetchNoteDetails,
        isFetching: isFetchingNoteDetails,
    } = useQuery({
        queryKey: ['noteDetails', selectedNote], // Ensure queryKey changes when selectedNote changes
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/notes/${selectedNote}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        enabled: !!selectedNote, // Only fetch if a note is selected
    });

    // Fetch recent notes
    let recentNotes = useQuery({
        queryKey: ['recentNotes'],
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/notes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
    });


    // Delete a note permanently
    async function deletePermenent(noteid) {
        try {
            await axios.delete(`https://brainmate.fly.dev/api/v1/notes/trash/${noteid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Note deleted successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            refetch();
            setSelectedNote('');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting note', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }

    async function emptyTrash() {
        try {
            await axios.delete(`https://brainmate.fly.dev/api/v1/notes/trash/deleteAll`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Trash cleared successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            refetch();
            setSelectedNote('');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting note', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }

    // Restore a note from trash
    async function restore(noteid) {
        try {
            await axios.post(
                `https://brainmate.fly.dev/api/v1/notes/trash/${noteid}/restore`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Note restored successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            refetch(); // Refetch folder notes
            recentNotes.refetch(); // Refetch recent notes
            setSelectedNote(''); // Clear selected note
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error restoring note', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }
    return (
        <>
            {/* Notes inside selected folder */}
            <div className="mt-2 flex flex-col space-y-3 text-white w-full">
                <div className="flex justify-between pe-3">
                    <div className="ms-3 mb-1 opacity-50 capitalize">
                        {selectedFolderName ? selectedFolderName : 'Select a folder to show notes'}
                    </div>
                    <div className="ms-3 mb-1 capitalize flex gap-2">
                        <div className="opacity-50">{isFetching ? '_' : data?.data?.data?.length || 0}</div>
                        {selectedFolder === 'trash' && <button className='text-red-500 flex gap-2' onClick={emptyTrash} title='empty trash' ><Trash2 size={20} /></button>}
                    </div>
                </div>

                {/* Note List */}
                {isLoading ? (
                    <div className="flex flex-col p-2 space-y-2">
                        <div className="h-10 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: '0.0s' }}></div>
                        <div className="h-10 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: '0.15s' }}></div>
                        <div className="h-10 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                ) : (
                    <>
                        {data?.data?.data?.map((note) => {
                            const isTrash = selectedFolder === 'trash';
                            const noteKey = isTrash ? note.note?.id : note.id;
                            const noteTitle = isTrash ? note.note?.title : note.title;
                            const noteContent = isTrash ? note.note?.content : note.content;
                            const isSelected = selectedNote === noteKey;

                            return (
                                <div
                                    key={noteKey}
                                    className={`mx-2 ${isSelected ? 'bg-light bg-opacity-90' : 'bg-white bg-opacity-5'} relative flex flex-col p-2 rounded cursor-pointer`}
                                    onClick={() => {
                                        console.log('Selected Note Key:', noteKey); // Debugging
                                        setSelectedNote(noteKey);
                                    }}
                                >
                                    <div className="text-[16px] font-semibold pb-1">{noteTitle || 'Untitled'}</div>
                                    <div className="flex lg:flex-row flex-col-reverse lg:justify-between lg:items-center opacity-80 ">
                                        {/* Date */}
                                        <div>{note.created_at?.substring(0, 10) || 'Unknown date'}</div>
                                        {/* Note Content */}
                                        <div>
                                            {noteContent
                                                ? noteContent.length > 25
                                                    ? `${noteContent.substring(0, 25)}...`
                                                    : noteContent
                                                : 'No content'}
                                        </div>
                                    </div>
                                    {isTrash && (
                                        <div className="flex justify-between mt-2">
                                            <button
                                                className="text-red-500 hover:scale-110 transition-all"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent note selection
                                                    deletePermenent(note.id);
                                                }}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                            <button
                                                className="text-yellow-400"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent note selection
                                                    restore(note.id);
                                                }}
                                            >
                                                <ArchiveRestore size={20} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </>
    );
}