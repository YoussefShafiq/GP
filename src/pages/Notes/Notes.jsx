import { Archive, Folder, FolderOpen, FolderPlus, NotebookText, Plus, Star, Trash, X } from 'lucide-react'
import React, { useState } from 'react'
import NotesFolders from '../../components/NotesFolders/NotesFolders'
import FolderNotes from '../../components/FolderNotes/FolderNotes'
import RecentNotes from '../../components/RecentNotes/RecentNotes'
import NoteDetails from '../../components/NoteDetails/NoteDetails'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function Notes() {
    const [addnoteForm, setaddnoteForm] = useState(false)
    const token = localStorage.getItem('userToken')

    let folderNotes = useQuery({
        queryKey: ['folderNotes'],
    })

    function getAllNotes() {
        return axios.get(`https://brainmate.fly.dev/api/v1/notes`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    let recentNotes = useQuery({
        queryKey: ['recentNotes'],
        queryFn: getAllNotes
    })



    async function addNote(values, { resetForm }) {
        setaddnoteForm(false)
        try {
            let response = await axios.post('https://brainmate.fly.dev/api/v1/notes', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            toast.success('note added successfully', {
                duration: 1000,
                position: 'bottom-right'
            })
            resetForm()
            folderNotes.refetch()
            recentNotes.refetch()
        } catch (error) {
            toast.error(error.response.data.message, {
                duration: 3000,
                position: 'bottom-right'
            })
        }
    }

    let validationSchema = object({
        title: string().required('folder name is required'),
        content: string().required('folder name is required'),
        folder_id: string().required('folder name is required'),
    })

    let formik = useFormik({
        initialValues: {
            title: '',
            content: '',
            folder_id: ''
        }, validationSchema, onSubmit: (values, formikHelpers) => {
            addNote(values, formikHelpers);
        },
    })

    let notesFolders = useQuery({
        queryKey: ['notesFolders'],
    })

    return <>
        {/* create note form */}
        <div className={`absolute w-1/3 p-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md rounded-lg border shadow-lg bg-[#555] bg-opacity-20 z-10 ${addnoteForm ? 'flex' : 'hidden'} justify-center items-center`}>
            <button className='absolute top-0 right-0 m-3 text-red-500 hover:drop-shadow-lg hover:text-red-700 transition-all' onClick={() => { setaddnoteForm(false) }}  ><X size={25} /></button>
            <form onSubmit={formik.handleSubmit} className="w-full max-w-sm mt-5">
                <div className="relative z-0 w-full group mb-4">
                    {/* Title Input */}
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
                    {/* Content Input */}
                    <input
                        type="text"
                        name="content"
                        id="content"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.content}
                        className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                        placeholder=" "
                    />
                    <label
                        htmlFor="content"
                        className="absolute text-sm text-gray-400 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                    >
                        Content
                    </label>
                    {formik.errors.content && formik.touched.content && (
                        <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                            {formik.errors.content}
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
                                <option key={folder.id} className='text-black' value={`${folder.id}`}>{folder.name}</option>
                            )
                        })}
                    </select>
                    <label
                        htmlFor="folder_id"
                        className="absolute text-sm text-gray-400 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                    >
                        folder
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
                    add note
                </button>
            </form>

        </div>


        <div className="flex flex-wrap border-s box-border text-sm">
            <div className="w-1/4 bg-darkblue h-[calc(100vh-48px)] overflow-y-scroll" style={{ scrollbarWidth: 'none' }}>
                {/* recents */}
                <RecentNotes />

                {/* new notes */}
                <button className="w-5/6 py-2 my-3 flex justify-center items-center gap-2 text-white m-auto bg-light rounded-lg" onClick={() => { setaddnoteForm(true) }}>
                    <Plus />
                    <div className="font-inter ">add note</div>
                </button>

                {/* folders */}
                <NotesFolders />

                {/* more */}
                <div className="mt-8 flex flex-col space-y-0 text-white">
                    <div className="ms-3 mb-1 opacity-50 capitalize">more</div>
                    <div className="px-3 flex items-center space-x-2 my-4 py-2 opacity-50">
                        <Star size={20} />
                        <p className='capitalize' >favorite</p>
                    </div>
                    <div className="px-3 flex items-center space-x-2 my-4 py-2 opacity-50">
                        <Trash size={20} />
                        <p className='capitalize' >trash</p>
                    </div>
                    <div className="px-3 flex items-center space-x-2 my-4 py-2 opacity-50">
                        <Archive size={20} />
                        <p className='capitalize' >archived notes</p>
                    </div>
                </div>
            </div>
            <div className="w-1/4 bg-notes h-[calc(100vh-48px)] overflow-y-scroll" style={{ scrollbarWidth: 'none' }}>
                {/* notes inside selected folder */}
                <FolderNotes />
            </div>
            {/* note details */}
            <NoteDetails />
        </div>
    </>
}