import { Archive, Folder, FolderOpen, FolderPlus, NotebookText, Plus, Star, Trash, X } from 'lucide-react';
import React, { useContext, useState } from 'react';
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
    const { setSelectedFolder, setSelectedFolderName, selectedFolder, setSelectedNote } = useContext(NotesContext);
    const [addnoteForm, setaddnoteForm] = useState(false);
    const token = localStorage.getItem('userToken');

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
    })

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
            setSelectedNote(response.data.data.id)
            setSelectedFolder(response.data.data.folder_id)

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
        // content: string().required('Content is required'),
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
            {/* Create note form */}
            <div
                className={`absolute w-1/3 p-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md rounded-lg border shadow-lg bg-[#555] bg-opacity-20 z-10 ${addnoteForm ? 'flex' : 'hidden'
                    } justify-center items-center`}
            >
                <button
                    className="absolute top-0 right-0 m-3 text-red-500 hover:drop-shadow-lg hover:text-red-700 transition-all"
                    onClick={() => {
                        setaddnoteForm(false);
                    }}
                >
                    <X size={25} />
                </button>
                <form onSubmit={formik.handleSubmit} className="w-full max-w-sm mt-5">
                    {/* Title Input */}
                    <div className="relative z-0 w-full group mb-4">
                        <input
                            type="text"
                            name="title"
                            id="title"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.title}
                            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
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


                    <div className="relative z-0 w-full group mb-4">
                        {/* Dropdown List */}
                        <select
                            name="folder_id"
                            id="folder_id"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.folder_id}
                            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
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
            </div>

            <div className="flex flex-wrap border-s box-border text-sm">
                <div className="w-1/4 bg-darkblue h-[calc(100vh-48px)] overflow-y-scroll" style={{ scrollbarWidth: 'none' }}>
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
                        <div className="font-inter">Add Note</div>
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
                            <Star size={20} />
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
                <div className="w-1/4 bg-notes h-[calc(100vh-48px)] overflow-y-scroll" style={{ scrollbarWidth: 'none' }}>
                    {/* Notes inside selected folder */}
                    <FolderNotes />
                </div>
                {/* Note details */}
                <NoteDetails />
            </div>
        </>
    );
}