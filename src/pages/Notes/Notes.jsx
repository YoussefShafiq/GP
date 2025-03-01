import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion
import { Archive, Folder, FolderOpen, FolderPlus, Heart, NotebookText, Plus, Star, Trash, X } from 'lucide-react';
import React, { useContext, useState, useEffect, useRef } from 'react';
import NotesFolders from '../../components/NotesFolders/NotesFolders';
import FolderNotes from '../../components/FolderNotes/FolderNotes';
import RecentNotes from '../../components/RecentNotes/RecentNotes';
import NoteDetails from '../../components/NoteDetails/NoteDetails';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import { NotesContext } from '../../context/NotesContext';

export default function Notes() {
    const { setSelectedFolder, setSelectedFolderName, selectedFolder, setSelectedNote, selectedNote } = useContext(NotesContext);
    const [addnoteForm, setaddnoteForm] = useState(false);
    const token = localStorage.getItem('userToken');

    // Ref for the create note form
    const notesFormRef = useRef(null);

    // Close the form when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (notesFormRef.current && !notesFormRef.current.contains(event.target)) {
                setaddnoteForm(false); // Close the form
            }
        }

        // Attach the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up the event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch all notes for the recent notes section
    let recentNotes = useQuery({
        queryKey: ['recentNotes'],
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/notes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
    });

    let notesFoldersquery = useQuery({
        queryKey: ['notesFolders'],
        keepPreviousData: true,
    });

    // Fetch notes for the selected folder
    let folderNotes = useQuery({
        queryKey: ['folderNotes', selectedFolder], // Include selectedFolder in the queryKey
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/notes/folders/${selectedFolder}/notes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        enabled: !!selectedFolder, // Only fetch if a folder is selected
    });

    // Add a new note
    async function addNote(values, { resetForm }) {
        setaddnoteForm(false);
        try {
            let response = await axios.post('https://brainmate.fly.dev/api/v1/notes', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.data.id);
            setSelectedNote(response.data.data.id);
            setSelectedFolder(response.data.data.folder_id);

            toast.success('Note added successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            resetForm();
            folderNotes.refetch(); // Refetch folder notes
            recentNotes.refetch(); // Refetch recent notes
            notesFoldersquery.refetch(); // Refetch recent notes
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding note', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }

    // Form validation schema
    let validationSchema = object({
        title: string().required('Title is required'),
        folder_id: string().required('Folder is required'),
    });

    // Formik form handling
    let formik = useFormik({
        initialValues: {
            title: '',
            content: '',
            folder_id: '',
        },
        validationSchema,
        onSubmit: (values, formikHelpers) => {
            addNote(values, formikHelpers);
        },
    });

    // Fetch folders for the dropdown
    let notesFolders = useQuery({
        queryKey: ['notesFolders'],
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/folders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
    });

    return (
        <>

            <motion.div
                initial={{ opacity: 0, y: 100 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 1, y: -100 }}
                transition={{ duration: 0.3 }}
            >
                {/* Create note form with Framer Motion animation */}
                <AnimatePresence>
                    {addnoteForm && (
                        <motion.div
                            initial={{ opacity: 0 }} // Initial state (fade out)
                            animate={{ opacity: 1 }} // Animate to this state (fade in)
                            exit={{ opacity: 0 }} // Exit animation (fade out)
                            transition={{ duration: 0.3 }} // Animation duration
                            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-15 z-50" // Full screen backdrop
                            onClick={() => setaddnoteForm(false)} // Close modal on background click
                        >
                            <motion.div
                                className="bg-white bg-opacity-15 rounded-lg shadow-lg border p-6 w-1/3 relative max-h-[95vh] overflow-y-auto" // Consistent size and styling
                                initial={{ y: 0, opacity: 0 }} // Initial state for the form (fade out)
                                animate={{ y: 0, opacity: 1 }} // Animate to this state (fade in)
                                exit={{ y: 0, opacity: 0 }} // Exit animation for the form (fade out)
                                transition={{ duration: 0.3 }} // Animation duration
                                onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setaddnoteForm(false)}
                                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>

                                {/* Add Note Form */}
                                <form onSubmit={formik.handleSubmit} className="w-full mt-5">
                                    {/* Title Input */}
                                    <div className="relative z-0 w-full group mb-4">
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.title}
                                            className="block py-2 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="title"
                                            className="absolute text-sm text-gray-400 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                        >
                                            Title
                                        </label>
                                        {formik.errors.title && formik.touched.title && (
                                            <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                                {formik.errors.title}
                                            </div>
                                        )}
                                    </div>

                                    {/* Folder Dropdown */}
                                    <div className="relative z-0 w-full group mb-4">
                                        <select
                                            name="folder_id"
                                            id="folder_id"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.folder_id}
                                            className="block p-2 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                        >
                                            <option value="" defaultValue={''} disabled hidden>
                                                Select folder
                                            </option>
                                            {notesFolders?.data?.data.data.folders.map((folder) => {
                                                return (
                                                    <option key={folder.id} className="text-black" value={`${folder.id}`}>
                                                        {folder.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <label
                                            htmlFor="folder_id"
                                            className="absolute text-sm text-gray-400 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                        >
                                            Folder
                                        </label>
                                        {formik.errors.folder_id && formik.touched.folder_id && (
                                            <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                                {formik.errors.folder_id}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full h-12 rounded-xl bg-gradient-to-r from-darkblue via-blueblack to-blueblack text-white text-lg font-bold hover:shadow-md"
                                        style={{ transition: 'background-position 0.4s ease', backgroundSize: '150%' }}
                                        onMouseEnter={(e) => (e.target.style.backgroundPosition = 'right')}
                                        onMouseLeave={(e) => (e.target.style.backgroundPosition = 'left')}
                                    >
                                        Add Note
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <div className="flex flex-wrap border-s box-border text-sm">
                    <div className={`${selectedNote ? 'w-0 lg:w-1/4 overflow-hidden' : 'w-1/2 lg:w-1/4'} bg-darkblue h-[calc(100vh-48px)] overflow-y-scroll transition-all`} style={{ scrollbarWidth: 'none' }}>
                        {/* Recents */}
                        <RecentNotes />

                        {/* New Notes */}
                        <button
                            className="w-5/6 py-2 my-3 flex justify-center items-center gap-2 text-white m-auto bg-light rounded-lg"
                            onClick={() => {
                                setaddnoteForm(true);
                            }}
                        >
                            <Plus />
                            <div className="font-inter font-bold">Add Note</div>
                        </button>

                        {/* Folders */}
                        <NotesFolders />

                        {/* More */}
                        <div className="mt-8 flex flex-col space-y-0 text-white">
                            <div className="ms-3 mb-1 opacity-50 capitalize">More</div>
                            <div
                                className={`px-3 flex items-center space-x-2 my-4 py-2 ${selectedFolder === 'favorites' ? 'bg-white bg-opacity-5' : 'opacity-50'
                                    }  cursor-pointer`}
                                onClick={() => {
                                    setSelectedFolder('favorites');
                                    setSelectedFolderName('favorites');
                                    setTimeout(() => {
                                        folderNotes.refetch();
                                    }, 100);
                                }}
                            >
                                <Heart size={20} />
                                <p className="capitalize">favorite</p>
                            </div>
                            <div
                                className={`px-3 flex items-center space-x-2 my-4 py-2 ${selectedFolder === 'trash' ? 'bg-white bg-opacity-5' : 'opacity-50'
                                    }  cursor-pointer`}
                                onClick={() => {
                                    setSelectedFolder('trash');
                                    setSelectedFolderName('trash');
                                    setTimeout(() => {
                                        folderNotes.refetch();
                                    }, 100);
                                }}
                            >
                                <Trash size={20} />
                                <p className="capitalize">Trash</p>
                            </div>
                        </div>
                    </div>
                    <div className={`${selectedNote ? 'w-0 lg:w-1/4 overflow-hidden' : 'w-1/2 lg:w-1/4'} bg-notes h-[calc(100vh-48px)] overflow-y-scroll transition-all`} style={{ scrollbarWidth: 'none' }}>
                        {/* Notes inside selected folder */}
                        <FolderNotes />
                    </div>
                    {/* Note details */}
                    <NoteDetails />
                </div>
            </motion.div >

        </>
    );
}