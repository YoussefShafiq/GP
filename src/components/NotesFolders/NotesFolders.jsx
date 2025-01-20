import { Folder, FolderOpen, FolderPlus, Link, X } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { NotesContext } from '../../context/NotesContext'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useFormik } from 'formik'
import { object, ref, string } from 'yup'
import { ThreeDots } from 'react-loader-spinner'
import toast from 'react-hot-toast'

export default function NotesFolders() {
    const { selectedFolder, setSelectedFolder, setSelectedFolderName } = useContext(NotesContext)
    const token = localStorage.getItem('userToken')
    const [folderform, setFolderform] = useState(false)

    function getNotesFolders() {
        return axios.get('https://brainmate.fly.dev/api/v1/notes/folders', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }



    async function createFolder(values, { resetForm }) {
        setFolderform(false)
        try {
            let response = await axios.post('https://brainmate.fly.dev/api/v1/notes/folders', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(response);
            toast.success('folder created successfully', {
                duration: 1000,
                position: 'bottom-right'
            })
            resetForm()
            refetch()
        } catch (error) {
            toast.error(error.response.data.message, {
                duration: 3000,
                position: 'bottom-right'
            })
        }
    }

    let validationSchema = object({
        name: string().required('folder name is required'),
    })

    let formik = useFormik({
        initialValues: {
            name: ''
        }, validationSchema, onSubmit: (values, formikHelpers) => {
            createFolder(values, formikHelpers);
        },
    })

    let { data, isLoading, refetch } = useQuery({
        queryKey: ['notesFolders'],
        queryFn: getNotesFolders,
        keepPreviousData: true,
    })


    let foldernotes = useQuery({
        queryKey: ['folderNotes'],
        keepPreviousData: true,
    })

    return <>
        {/* create folder form */}
        <div className={`absolute w-1/3 p-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md rounded-lg border shadow-lg bg-[#555] bg-opacity-20 z-10 ${folderform ? 'flex' : 'hidden'} justify-center items-center`}>
            <button className='absolute top-0 right-0 m-3 text-red-500 hover:drop-shadow-lg hover:text-red-700 transition-all' onClick={() => { setFolderform(false) }} ><X size={25} /></button>
            <form onSubmit={formik.handleSubmit} className="w-full max-w-sm mt-5">
                <div className="relative z-0 w-full group mb-4">
                    <input type="text" name="name" id="name" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.name} className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer" placeholder='' />
                    <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Folder Name</label>
                    {formik.errors.name && formik.touched.name &&
                        <div className=" text-sm text-red-500 rounded-lg bg-transparent  " role="alert">
                            {formik.errors.name}
                        </div>
                    }
                </div>
                <button
                    type="submit"
                    className='w-full h-12 rounded-xl bg-gradient-to-r from-darkblue via-blueblack to-blueblack text-white text-lg font-bold hover:shadow-md'
                    style={{ transition: 'background-position 0.4s ease', backgroundSize: '150%' }}
                    onMouseEnter={(e) => e.target.style.backgroundPosition = 'right'}
                    onMouseLeave={(e) => e.target.style.backgroundPosition = 'left'}
                >
                    create folder
                </button>
            </form>
        </div>

        {/* folders */}
        <div className="mt-2 flex flex-col space-y-0 text-white">
            <div className="ms-3 pe-3 mb-1 opacity-50 flex justify-between items-center capitalize"><span>folders</span><button onClick={() => { setFolderform(true) }} ><FolderPlus size={20} /></button></div>
            {isLoading ? <>
                <div className="flex flex-col p-2 space-y-2">
                    <div className="h-6 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.0s" }} ></div>
                    <div className="h-6 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.15s" }} ></div>
                    <div className="h-6 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.3s" }} ></div>
                </div>
            </> :
                <>
                    {data?.data.data.folders.map((folder) => {
                        return (
                            <div key={folder.id} className={`px-3 flex items-center space-x-2 my-4 py-2 ${selectedFolder === folder.id ? 'bg-white bg-opacity-5' : 'opacity-50'}  cursor-pointer`} onClick={() => {
                                setSelectedFolder(folder.id); setSelectedFolderName(folder.name); setTimeout(() => {
                                    foldernotes.refetch()
                                }, 100);
                            }} >
                                {selectedFolder === folder.id ? <FolderOpen size={20} /> : <Folder size={20} />}
                                <p>{folder.name}</p>
                            </div>
                        )
                    })}
                </>}
        </div>
    </>
}
