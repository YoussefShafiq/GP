import { Folder, FolderOpen, FolderPlus, MoreVertical, Trash2, X } from 'lucide-react';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { NotesContext } from '../../context/NotesContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { ThreeDots } from 'react-loader-spinner';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion'; // Import motion from framer-motion

export default function NotesFolders() {
    const { selectedFolder, setSelectedFolder, setSelectedFolderName, setSelectedNote } = useContext(NotesContext);
    const token = localStorage.getItem('userToken');
    const [folderform, setFolderform] = useState(false);
    const [showMenu, setShowMenu] = useState(null); // Track which folder's menu is open

    // Refs for the menu and form
    const menuRef = useRef(null);
    const folderFormRef = useRef(null);

    // Close the menu or form when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(null);
            }
            if (folderFormRef.current && !folderFormRef.current.contains(event.target)) {
                setFolderform(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch folders
    function getNotesFolders() {
        return axios.get('https://brainmate-new.fly.dev/api/v1/notes/folders', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // Create a new folder
    async function createFolder(values, { resetForm }) {
        setFolderform(false);
        try {
            let response = await axios.post('https://brainmate-new.fly.dev/api/v1/notes/folders', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);
            toast.success('Folder created successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            resetForm();
            refetch();
        } catch (error) {
            toast.error(error.response.data.message, {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }

    // Delete a folder
    async function deleteFolder(folderId) {
        try {
            await axios.delete(`https://brainmate-new.fly.dev/api/v1/notes/folders/${folderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Folder deleted successfully', {
                duration: 1000,
                position: 'bottom-right',
            });

            // Check if the selected note belongs to the deleted folder
            if (noteDetails.data?.data?.data?.note?.folder?.id === folderId) {
                setSelectedNote(null); // Reset the selected note if it's in the deleted folder
            }

            // If the deleted folder is the selected folder, reset the selected folder and note
            if (selectedFolder === folderId) {
                setSelectedFolder(null);
                setSelectedFolderName(null);
                setSelectedNote(null);
            }

            // Refetch all relevant queries to update the UI
            refetch(); // Refetch folders
            foldernotes.refetch(); // Refetch folder notes
            recentnotes.refetch(); // Refetch recent notes
            noteDetails.refetch(); // Refetch note details
        } catch (error) {
            toast.error(error.response.data.message, {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }

    // Form validation schema
    let validationSchema = object({
        name: string().required('Folder name is required'),
    });

    // Formik form setup
    let formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema,
        onSubmit: (values, formikHelpers) => {
            createFolder(values, formikHelpers);
        },
    });

    // Fetch folders data
    let { data, isLoading, refetch } = useQuery({
        queryKey: ['notesFolders'],
        queryFn: getNotesFolders,
        keepPreviousData: true,
    });

    let foldernotes = useQuery({
        queryKey: ['folderNotes'],
        keepPreviousData: true,
    });

    const recentnotes = useQuery({
        queryKey: ['recentNotes'],
    });

    let noteDetails = useQuery({
        queryKey: ['noteDetails'],
    });

    return (
        <>
            {/* Create folder form with Framer Motion animation */}
            <AnimatePresence>
                {folderform && (
                    <motion.div
                        initial={{ opacity: 0 }} // Initial state (fade out)
                        animate={{ opacity: 1 }} // Animate to this state (fade in)
                        exit={{ opacity: 0 }} // Exit animation (fade out)
                        transition={{ duration: 0.3 }} // Animation duration
                        className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-15 z-50" // Full screen backdrop
                        onClick={() => setFolderform(false)} // Close modal on background click
                    >
                        <motion.div
                            className="bg-white bg-opacity-15 rounded-lg shadow-lg border p-6 w-4/5 lg:w-1/3 relative max-h-[95vh] overflow-y-auto" // Consistent size and styling
                            initial={{ y: 0, opacity: 0 }} // Initial state for the form (fade out)
                            animate={{ y: 0, opacity: 1 }} // Animate to this state (fade in)
                            exit={{ y: 0, opacity: 0 }} // Exit animation for the form (fade out)
                            transition={{ duration: 0.3 }} // Animation duration
                            onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setFolderform(false)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>

                            {/* Folder Form */}
                            <form onSubmit={formik.handleSubmit} className="w-full mt-5">
                                <div className="relative z-0 w-full group mb-4">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.name}
                                        className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                        placeholder=""
                                    />
                                    <label
                                        htmlFor="name"
                                        className="peer-focus:font-medium absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Folder Name
                                    </label>
                                    {formik.errors.name && formik.touched.name && (
                                        <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                            {formik.errors.name}
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
                                    Create Folder
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Folders */}
            <div className="mt-2 flex flex-col space-y-0 text-white">
                <div className="ms-3 pe-3 mb-1 opacity-50 flex justify-between items-center capitalize">
                    <span>Folders</span>
                    <button onClick={() => { setFolderform(true) }} >
                        <FolderPlus size={20} />
                    </button>
                </div>
                {isLoading ? (
                    <div className="flex flex-col p-2 space-y-2">
                        <div className="h-6 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.0s" }} ></div>
                        <div className="h-6 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.15s" }} ></div>
                        <div className="h-6 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.3s" }} ></div>
                    </div>
                ) : (
                    <>
                        {data?.data.data.folders.map((folder) => (
                            <div
                                key={folder.id}
                                className={`px-3 flex items-center justify-between space-x-2 my-4 py-2 ${selectedFolder === folder.id ? 'bg-white bg-opacity-5' : 'opacity-50'}  cursor-pointer`}
                                onClick={() => {
                                    setSelectedFolder(folder.id);
                                    setSelectedFolderName(folder.name);
                                    setTimeout(() => {
                                        foldernotes.refetch();
                                    }, 100);
                                }}
                            >
                                <div className="flex items-center space-x-2">
                                    {selectedFolder === folder.id ? <FolderOpen size={20} /> : <Folder size={20} />}
                                    <p>{folder.name}</p>
                                </div>
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent the folder click event
                                            setShowMenu(showMenu === folder.id ? null : folder.id);
                                            setSelectedFolder(folder.id);
                                        }}
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    {/* Animated Delete Menu */}
                                    <AnimatePresence>
                                        {showMenu === folder.id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }} // Initial state
                                                animate={{ opacity: 1, y: 0 }} // Animate to this state
                                                exit={{ opacity: 0, y: -10 }} // Exit animation
                                                transition={{ duration: 0.2, ease: 'easeInOut' }} // Animation settings
                                                className="absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                                            >
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => deleteFolder(folder.id)}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                                    >
                                                        <Trash2 size={16} className="mr-2" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </>
    );
}