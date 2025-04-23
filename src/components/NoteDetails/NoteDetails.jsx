import { CalendarDays, Folder, Heart, NotebookText, Save, Star, Trash2, X } from 'lucide-react';
import React, { useContext, useState, useEffect } from 'react';
import { NotesContext } from '../../context/NotesContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function NoteDetails() {
    const { selectedNote, setSelectedNote, selectedFolder } = useContext(NotesContext);
    const token = localStorage.getItem('userToken');

    // Function to fetch note details
    function getNoteDetails() {
        return axios.get(`https://brainmate-new.fly.dev/api/v1/notes/${selectedNote}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // React Query for fetching note details
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['noteDetails', selectedNote], // Include selectedNote in the queryKey
        queryFn: getNoteDetails,
        enabled: !!selectedNote, // Only fetch if selectedNote is set
    });

    // State for editable content, title, and selected folder
    const [noteContent, setNoteContent] = useState('');
    const [noteTitle, setNoteTitle] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState('');
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false); // Loading state for favorite button

    // Update the states when the data changes
    useEffect(() => {
        if (data?.data?.data?.note) {
            const { content, title, folder, deleted_at } = data.data.data.note;
            setNoteContent(content || '');
            setNoteTitle(title || '');
            setSelectedFolderId(folder?.id || ''); // Set the current folder ID
        }
    }, [data]);

    // Handle input changes
    const handleContentChange = (e) => setNoteContent(e.target.value);
    const handleTitleChange = (e) => setNoteTitle(e.target.value);
    const handleFolderChange = (e) => setSelectedFolderId(e.target.value);

    // Fetch folder notes
    let folderNotes = useQuery({
        queryKey: ['folderNotes', selectedFolder], // Include selectedFolder in the queryKey
        queryFn: () =>
            axios.get(`https://brainmate-new.fly.dev/api/v1/notes/folders/${selectedFolder}/notes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        enabled: !!selectedFolder, // Only fetch if a folder is selected
    });

    // Fetch recent notes
    let recentNotes = useQuery({
        queryKey: ['recentNotes'],
        queryFn: () =>
            axios.get(`https://brainmate-new.fly.dev/api/v1/notes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
    });

    // Fetch folders for the dropdown
    let foldersQuery = useQuery({
        queryKey: ['notesFolders'],
        keepPreviousData: true,
    });

    // Delete a note
    async function deleteNote() {
        try {
            let response = await axios.delete(`https://brainmate-new.fly.dev/api/v1/notes/${selectedNote}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Note deleted successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            setSelectedNote(null); // Clear selected note
            refetch(); // Refetch note details
            folderNotes.refetch(); // Refetch folder notes
            recentNotes.refetch(); // Refetch recent notes
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting note', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }

    // Toggle favorite status of a note
    async function toggleFavorite(flag) {
        if (!selectedNote) {
            console.error('No note selected'); // Debugging
            toast.error('No note selected', {
                duration: 3000,
                position: 'bottom-right',
            });
            return;
        }

        setIsFavoriteLoading(true); // Set loading state
        try {
            console.log('Toggling favorite. Flag:', flag); // Debugging

            // Send a request to update the favorite status
            const response = await axios.post(
                `https://brainmate-new.fly.dev/api/v1/notes/favorites`,
                {
                    note_id: selectedNote,
                    flag: flag, // true to favorite, false to unfavorite
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('API Response:', response.data); // Debugging

            if (response.data?.success) {
                // Show a success toast
                toast.success(
                    flag ? 'Added to Favorites' : 'Removed from Favorites',
                    {
                        duration: 1000,
                        position: 'bottom-right',
                        icon: <Heart color='#f05252' fill='#f05252' />
                    }
                );

                // Refetch data to update the UI
                refetch(); // Refetch note details
                folderNotes.refetch(); // Refetch folder notes
                recentNotes.refetch(); // Refetch recent notes
            } else {
                console.error('API did not return success:', response.data); // Debugging
                toast.error('Failed to update favorite status', {
                    duration: 3000,
                    position: 'bottom-right',
                });
            }
        } catch (error) {
            console.error('Error toggling favorite:', error); // Debugging
            toast.error(error?.response?.data?.message || 'Error updating favorite status', {
                duration: 3000,
                position: 'bottom-right',
            });
        } finally {
            setIsFavoriteLoading(false); // Reset loading state
        }
    }

    // Update a note
    async function updateNote() {
        const noteData = data?.data?.data?.note;
        if (!noteData) return;

        if (
            (noteContent !== noteData.content && noteContent.trim() !== '') || // Check if content has changed and is not empty
            (noteTitle !== noteData.title && noteTitle.trim() !== '') || // Check if title has changed and is not empty
            selectedFolderId !== noteData.folder.id // Check if folder has changed
        ) {
            try {
                await axios.put(
                    `https://brainmate-new.fly.dev/api/v1/notes/${noteData.id}`,
                    {
                        title: noteTitle.trim() || noteData.title, // Use existing title if new title is empty
                        content: noteContent.trim() || noteData.content, // Use existing content if new content is empty
                        folder_id: selectedFolderId, // Include the selected folder ID
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
                refetch(); // Refetch note details
                folderNotes.refetch(); // Refetch folder notes
                recentNotes.refetch(); // Refetch recent notes
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to update note', {
                    duration: 3000,
                    position: 'bottom-right',
                });
                console.error(error);
            }
        }
    }

    // Auto-save when input fields lose focus
    const handleBlur = () => {
        updateNote();
    };

    // Check if the note is deleted
    const isNoteDeleted = data?.data?.data?.note?.deleted_at !== null;

    return (
        <div className={`${selectedNote ? 'w-full lg:w-1/2' : 'w-0 lg:w-1/2 overflow-hidden'} bg-darkblue dark:bg-darklayout h-[calc(100vh-48px)] overflow-y-scroll relative transition-all`} style={{ scrollbarWidth: 'none' }}>
            {/* Show "Select a note to view" if no note is selected */}

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
            ) : isLoading ? (
                // Show loading state if a note is selected but data is still loading
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
                // Show note details if a note is selected and data is loaded
                data?.data?.data?.note && (
                    <div className="flex flex-col pt-3 px-5">
                        <div className="flex lg:hidden justify-between items-center">
                            <button onClick={() => setSelectedNote(null)} className='text-red-500 flex items-center'><X />Close</button>
                            {/* Save and favorite buttons */}
                            {!isNoteDeleted && (
                                <div className="gap-3 flex">
                                    {/* Favorite Button */}
                                    {data?.data?.data?.note.isFavorite ? (
                                        <button
                                            className="text-red-500"
                                            onClick={() => toggleFavorite(0)}
                                            disabled={isFavoriteLoading}
                                        >
                                            <Heart fill="#f05252 " />
                                        </button>
                                    ) : (
                                        <button
                                            className="text-red-500"
                                            onClick={() => toggleFavorite(1)}
                                            disabled={isFavoriteLoading}
                                        >
                                            <Heart />
                                        </button>
                                    )}

                                    {/* Save Button */}
                                    <button
                                        className={`${noteContent === data.data.data.note.content &&
                                            noteTitle === data.data.data.note.title &&
                                            selectedFolderId === data.data.data.note.folder.id
                                            ? 'opacity-30 cursor-default'
                                            : 'opacity-100 drop-shadow-lg'
                                            } text-white transition-all`}
                                        onClick={updateNote}
                                    >
                                        <Save />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center relative">
                            <input
                                type="text"
                                className="text-white text-2xl font-inter font-bold mb-5 bg-transparent p-0 border-0 focus:ring-0"
                                value={noteTitle}
                                onChange={handleTitleChange}
                                onBlur={handleBlur}
                                placeholder='Title'
                                disabled={isNoteDeleted}
                            />
                            {!selectedNote}
                            {/* Save and favorite buttons */}
                            {!isNoteDeleted && (
                                <div className="lg:flex gap-3 hidden">
                                    {/* Favorite Button */}
                                    {data?.data?.data?.note.isFavorite ? (
                                        <button
                                            className="text-red-500"
                                            onClick={() => toggleFavorite(0)}
                                            disabled={isFavoriteLoading}
                                        >
                                            <Heart fill="#f05252 " />
                                        </button>
                                    ) : (
                                        <button
                                            className="text-red-500"
                                            onClick={() => toggleFavorite(1)}
                                            disabled={isFavoriteLoading}
                                        >
                                            <Heart />
                                        </button>
                                    )}

                                    {/* Save Button */}
                                    <button
                                        className={`${noteContent === data.data.data.note.content &&
                                            noteTitle === data.data.data.note.title &&
                                            selectedFolderId === data.data.data.note.folder.id
                                            ? 'opacity-30 cursor-default'
                                            : 'opacity-100 drop-shadow-lg'
                                            } text-white transition-all`}
                                        onClick={updateNote}
                                    >
                                        <Save />
                                    </button>
                                </div>
                            )}
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
                            <select
                                className="text-white bg-transparent p-2 border-0 focus:ring-0"
                                value={selectedFolderId}
                                onChange={handleFolderChange}
                                onBlur={handleBlur}
                                disabled={isNoteDeleted}
                            >
                                {foldersQuery?.data?.data.data.folders.map((folder) => (
                                    <option
                                        key={folder.id}
                                        value={folder.id}
                                        className="bg-darkblue dark:bg-darklayout text-white hover:bg-blue-500 hover:text-white cursor-pointer"
                                    >
                                        {folder.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="h-[1px] w-full bg-white opacity-25 my-4"></div>
                        <textarea
                            className="bg-transparent p-0 text-white font-inter border-0 focus:ring-0 w-full h-48"
                            value={noteContent}
                            onChange={handleContentChange}
                            onBlur={handleBlur}
                            placeholder='note content'
                            disabled={isNoteDeleted}
                        />
                        {!isNoteDeleted && (
                            <button className="absolute bottom-0 right-0 m-5 text-red-500 drop-shadow-md" onClick={deleteNote}>
                                <Trash2 />
                            </button>
                        )}
                    </div>
                )
            )}
        </div>
    );
}