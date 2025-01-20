import { CalendarDays, Folder, NotebookText, Save, Trash2 } from 'lucide-react';
import React, { useContext, useState, useEffect } from 'react';
import { NotesContext } from '../../context/NotesContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function NoteDetails() {
    const { selectedNote, setSelectedNote } = useContext(NotesContext);
    const token = localStorage.getItem('userToken');

    // Function to fetch note details
    function getNoteDetails() {
        return axios.get(`https://brainmate.fly.dev/api/v1/notes/${selectedNote}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // React Query for fetching note details
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['noteDetails'],
        queryFn: getNoteDetails,
    });

    // State for editable content and title
    const [noteContent, setNoteContent] = useState('');
    const [noteTitle, setNoteTitle] = useState('');

    // Update the states when the data changes
    useEffect(() => {
        if (data?.data?.data?.note) {
            const { content, title } = data.data.data.note;
            setNoteContent(content || '');
            setNoteTitle(title || '');
        }
    }, [data]);

    // Handle input changes
    const handleContentChange = (e) => setNoteContent(e.target.value);
    const handleTitleChange = (e) => setNoteTitle(e.target.value);


    let folderNotes = useQuery({
        queryKey: ['folderNotes'],
    })

    let recentNotes = useQuery({
        queryKey: ['recentNotes'],
    })

    async function deleteNote() {
        try {
            let response = await axios.delete(`https://brainmate.fly.dev/api/v1/notes/${selectedNote}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            toast.success('note deleted successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            refetch();
            setSelectedNote('')
            folderNotes.refetch();
            recentNotes.refetch();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting note', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }


    // update note
    async function updateNote() {
        const noteData = data.data.data.note;
        if (noteContent !== noteData.content || noteTitle !== noteData.title) {
            try {
                await axios.put(
                    `https://brainmate.fly.dev/api/v1/notes/${noteData.id}`,
                    {
                        title: noteTitle,
                        content: noteContent,
                        folder_id: noteData.folder.id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                toast.success('Note updated successfully', {
                    duration: 1000,
                    position: 'bottom-right',
                });
                refetch();
                folderNotes.refetch()
                recentNotes.refetch()
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to update note', {
                    duration: 3000,
                    position: 'bottom-right',
                });
                console.error(error);
            }
        }
    }

    return (
        <div className="w-1/2 bg-darkblue h-[calc(100vh-48px)] overflow-y-scroll relative" style={{ scrollbarWidth: 'none' }}>
            {!selectedNote ? (
                <div className="w-full h-full flex justify-center items-center font-inter">
                    <div className="flex flex-col text-white w-1/2 text-center items-center">
                        <NotebookText strokeWidth={0.6} size={50} />
                        <div className="my-1">Select a note to view</div>
                        <div className="text-sm opacity-50 mt-2">
                            Choose a note from the list on the left to view its contents, or create a new note to add to your collection.
                        </div>
                    </div>
                </div>
            ) : null}

            {isLoading ? (
                <div className="flex flex-col pt-3 px-5">
                    <h1 className="h-4 bg-slate-400 opacity-20 animate-pulse rounded w-1/3"></h1>
                    <div className="flex items-center gap-10 mt-5">
                        <div className="flex items-center gap-2 text-white opacity-50 w-20">
                            <CalendarDays size={22} />
                            <div className="capitalize">date</div>
                        </div>
                        <div
                            className="text-white h-4 bg-slate-400 opacity-20 animate-pulse rounded w-1/3"
                            style={{ animationDelay: '0.15s' }}
                        ></div>
                    </div>
                    <div className="h-[1px] w-full bg-white opacity-25 my-4"></div>
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2 text-white opacity-50 w-20">
                            <Folder size={22} />
                            <div className="capitalize">folder</div>
                        </div>
                        <div
                            className="text-white h-4 bg-slate-400 opacity-20 animate-pulse rounded w-1/3"
                            style={{ animationDelay: '0.3s' }}
                        ></div>
                    </div>
                    <div className="h-[1px] w-full bg-white opacity-25 my-4"></div>
                    <p
                        className="text-white h-4 bg-slate-400 opacity-20 animate-pulse rounded w-1/3"
                        style={{ animationDelay: '0.45s' }}
                    ></p>
                </div>
            ) : (
                data?.data?.data?.note && (
                    <div className="flex flex-col pt-3 px-5">
                        <div className="flex justify-between items-center">
                            <input
                                type="text"
                                className="text-white text-2xl font-inter font-bold mb-5 bg-darkblue p-0 border-0 focus:ring-0"
                                value={noteTitle}
                                onChange={handleTitleChange}
                            />
                            <button
                                className={`${noteContent === data.data.data.note.content && noteTitle === data.data.data.note.title
                                    ? 'opacity-30 cursor-default'
                                    : 'opacity-100 drop-shadow-lg'
                                    } text-white transition-all`}
                                onClick={updateNote}
                            >
                                <Save />
                            </button>
                        </div>
                        <div className="flex items-center gap-10">
                            <div className="flex items-center gap-2 text-white opacity-50 w-20">
                                <CalendarDays size={22} />
                                <div className="capitalize">date</div>
                            </div>
                            <div className="text-white">{data.data.data.note.updated_at.substring(0, 10)}</div>
                        </div>
                        <div className="h-[1px] w-full bg-white opacity-25 my-4"></div>
                        <div className="flex items-center gap-10">
                            <div className="flex items-center gap-2 text-white opacity-50 w-20">
                                <Folder size={22} />
                                <div className="capitalize">folder</div>
                            </div>
                            <div className="text-white">{data.data.data.note.folder.name}</div>
                        </div>
                        <div className="h-[1px] w-full bg-white opacity-25 my-4"></div>
                        <textarea
                            className="bg-darkblue p-0 text-white font-inter border-0 focus:ring-0 w-full h-48"
                            value={noteContent}
                            onChange={handleContentChange}
                        />
                    </div>
                )
            )}
            <button className='absolute bottom-0 right-0 m-5 text-red-500 drop-shadow-md' onClick={deleteNote} ><Trash2 /></button>
        </div>
    );
}
