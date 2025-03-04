import React, { useContext, useEffect, useRef, useState } from 'react';
import { projectContext } from '../../context/ProjectsContext';
import { MousePointerClick, Plus, X, Trash, Edit, FolderMinus, Trash2, Loader2Icon, Lock, Unlock, Square, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { TeamsContext } from '../../context/TeamsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faL } from '@fortawesome/free-solid-svg-icons';
import { MaterialsContext } from '../../context/MaterialsContext';
import { Tooltip } from '@heroui/tooltip';

export default function ProjectTeams() {
    const { selectedProjectFolder, setselectedProjectFolder, selectedTeamFolder, setselectedTeamFolder } = useContext(MaterialsContext)
    let { selectedProject, setselectedProject } = useContext(projectContext);
    let { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const [addProjectForm, setAddProjectForm] = useState(false);
    const [deleteProjectForm, setDeleteProjectForm] = useState(false);
    const [updateProjectForm, setUpdateProjectForm] = useState(false);
    const [sendingRequest, setsendingRequest] = useState(false)
    const token = localStorage.getItem('userToken');
    const projectFormRef = useRef(null);
    const navigate = useNavigate();

    // Close the form when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (projectFormRef.current && !projectFormRef.current.contains(event.target)) {
                setAddProjectForm(false); // Close the add team form
                setDeleteProjectForm(false); // Close the delete project form
                setUpdateProjectForm(false); // Close the update project form
            }
        }

        // Attach the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up the event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function getProjectTeams() {
        return axios.get(`https://brainmate.fly.dev/api/v1/projects/${selectedProject.id}/teams`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    let { data, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['projectTeams', selectedProject?.id], // Add selectedProject.id to queryKey
        queryFn: getProjectTeams,
        keepPreviousData: true,
        enabled: !!selectedProject, // Only fetch if selectedProject is defined
    });


    let sidebarProjects = useQuery({
        queryKey: ['allprojects'],
        keepPreviousData: true,
    });

    // Refetch data when selectedProject changes
    useEffect(() => {
        if (selectedProject) {
            refetch();
        }
    }, [selectedProject, refetch]);

    // Add a new team
    async function addTeam(values, { resetForm }) {
        setsendingRequest(true)
        try {
            let response = await axios.post(
                `https://brainmate.fly.dev/api/v1/projects/${selectedProject.id}/teams/create`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Team added successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            setAddProjectForm(false);
            setsendingRequest(false)
            resetForm();
            refetch(); // Refetch teams after adding a new team
        } catch (error) {
            setAddProjectForm(false);
            setsendingRequest(false)
            toast.error(error.response?.data?.message || 'Error adding team', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }

    // Form validation schema for add team
    const addTeamValidationSchema = object({
        name: string().required('Team name is required'),
    });

    // Formik form handling for add team
    const addTeamFormik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: addTeamValidationSchema,
        onSubmit: (values, formikHelpers) => {
            addTeam(values, formikHelpers);
        },
    });

    // Delete a project
    async function deleteProject(values, { resetForm }) {
        if (values.projectName !== selectedProject.name) {
            toast.error('Project name does not match', {
                duration: 3000,
                position: 'bottom-right',
            });
            return;
        }

        setsendingRequest(true)
        try {
            await axios.delete(
                `https://brainmate.fly.dev/api/v1/projects/${selectedProject.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Project deleted successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            setsendingRequest(false)
            resetForm();
            setDeleteProjectForm(false);
            setselectedProject(null);
            sidebarProjects.refetch();
        } catch (error) {
            setsendingRequest(false)
            toast.error(error.response?.data?.message || 'Error deleting project', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }

    // Form validation schema for delete project
    const deleteValidationSchema = object({
        projectName: string()
            .required('Project name is required')
            .oneOf([selectedProject?.name], 'Project name does not match'),
    });

    // Formik form handling for delete project
    const deleteFormik = useFormik({
        initialValues: {
            projectName: '',
        },
        validationSchema: deleteValidationSchema,
        onSubmit: (values, formikHelpers) => {
            deleteProject(values, formikHelpers);
        },
    });

    // Update a project
    async function updateProject(values, { resetForm }) {
        setsendingRequest(true)
        try {
            const response = await axios.put(
                `https://brainmate.fly.dev/api/v1/projects/${selectedProject.id}`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Project updated successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            setsendingRequest(false)
            resetForm();
            setUpdateProjectForm(false);
            setselectedProject(response.data.data.project); // Update selectedProject with the new data
            sidebarProjects.refetch();
            refetch();
        } catch (error) {
            setsendingRequest(false)
            toast.error(error.response?.data?.message || 'Error updating project', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    }

    // Form validation schema for update project
    const updateValidationSchema = object({
        name: string().required('Project name is required'),
        description: string().required('Project description is required'),
    });

    // Formik form handling for update project
    const updateFormik = useFormik({
        initialValues: {
            name: selectedProject?.name || '',
            description: selectedProject?.description || '',
        },
        validationSchema: updateValidationSchema,
        onSubmit: (values, formikHelpers) => {
            updateProject(values, formikHelpers);
        },
    });

    // Reset form values when the update form is opened
    useEffect(() => {
        if (updateProjectForm) {
            updateFormik.setValues({
                name: selectedProject?.name || '',
                description: selectedProject?.description || '',
            });
        }
    }, [updateProjectForm, selectedProject]);

    if (!selectedProject) {
        return (
            <div className="h-[calc(100vh-48px)] flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                    <MousePointerClick size={35} className='text-light' />
                    <h2 className='capitalize'>please select project first</h2>
                </div>
            </div>
        );
    }

    return (
        <>
            {!isLoading && <>
                {/* Add team form */}
                <AnimatePresence>
                    {addProjectForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-15 z-50"
                            onClick={() => setAddProjectForm(false)}
                        >
                            <motion.div
                                className="bg-white dark:bg-dark1 rounded-lg shadow-lg border p-6 w-5/6 md:w-1/3 relative max-h-[95vh] overflow-y-auto"
                                initial={{ y: 0, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={(e) => e.stopPropagation()}
                                ref={projectFormRef}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setAddProjectForm(false)}
                                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>

                                {/* Add team Form */}
                                <form
                                    onSubmit={addTeamFormik.handleSubmit}
                                    className="w-full mt-5"
                                >
                                    <div className="relative z-0 w-full group mb-4">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            onBlur={addTeamFormik.handleBlur}
                                            onChange={addTeamFormik.handleChange}
                                            value={addTeamFormik.values.name}
                                            className="block py-2 w-full text-sm text-black dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="name"
                                            className="absolute text-sm text-gray-700 dark:text-gray-500 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                        >
                                            Team name
                                        </label>
                                        {addTeamFormik.errors.name && addTeamFormik.touched.name && (
                                            <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                                {addTeamFormik.errors.name}
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
                                        disabled={sendingRequest}
                                    >
                                        Add team
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete project form */}
                <AnimatePresence>
                    {deleteProjectForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-15 z-50"
                            onClick={() => setDeleteProjectForm(false)}
                        >
                            <motion.div
                                className="bg-white dark:bg-dark1 rounded-lg shadow-lg border p-6 w-5/6 md:w-1/3 relative max-h-[95vh] overflow-y-auto"
                                initial={{ y: 0, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={(e) => e.stopPropagation()}
                                ref={projectFormRef}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setDeleteProjectForm(false)}
                                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>

                                {/* Delete Project Form */}
                                <form
                                    onSubmit={deleteFormik.handleSubmit}
                                    className="w-full mt-5"
                                >
                                    <div className="relative z-0 w-full group mb-4">
                                        <input
                                            type="text"
                                            name="projectName"
                                            id="projectName"
                                            onBlur={deleteFormik.handleBlur}
                                            onChange={deleteFormik.handleChange}
                                            value={deleteFormik.values.projectName}
                                            className="block py-2 w-full text-sm text-black dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="projectName"
                                            className="absolute text-sm text-gray-700 dark:text-gray-500 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                        >
                                            To confirm, type "{selectedProject.name}"
                                        </label>
                                        {deleteFormik.errors.projectName && deleteFormik.touched.projectName && (
                                            <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                                {deleteFormik.errors.projectName}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white text-lg font-bold hover:shadow-md"
                                        style={{ transition: 'background-position 0.4s ease', backgroundSize: '150%' }}
                                        onMouseEnter={(e) => (e.target.style.backgroundPosition = 'right')}
                                        onMouseLeave={(e) => (e.target.style.backgroundPosition = 'left')}
                                        disabled={sendingRequest}
                                    >
                                        Delete Project
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Update project form */}
                <AnimatePresence>
                    {updateProjectForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-15 z-50"
                            onClick={() => setUpdateProjectForm(false)}
                        >
                            <motion.div
                                className="bg-white dark:bg-dark1 rounded-lg shadow-lg border p-6 w-5/6 md:w-1/3 relative max-h-[95vh] overflow-y-auto"
                                initial={{ y: 0, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={(e) => e.stopPropagation()}
                                ref={projectFormRef}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setUpdateProjectForm(false)}
                                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>

                                {/* Update Project Form */}
                                <form
                                    onSubmit={updateFormik.handleSubmit}
                                    className="w-full mt-5"
                                >
                                    {/* Project Name Input */}
                                    <div className="relative z-0 w-full group mb-4">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            onBlur={updateFormik.handleBlur}
                                            onChange={updateFormik.handleChange}
                                            value={updateFormik.values.name}
                                            className="block py-2 w-full text-sm text-black dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="name"
                                            className="absolute text-sm text-gray-700 dark:text-gray-500 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                        >
                                            Project Name
                                        </label>
                                        {updateFormik.errors.name && updateFormik.touched.name && (
                                            <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                                {updateFormik.errors.name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Project Description Input */}
                                    <div className="relative z-0 w-full group mb-4">
                                        <textarea
                                            name="description"
                                            id="description"
                                            onBlur={updateFormik.handleBlur}
                                            onChange={updateFormik.handleChange}
                                            value={updateFormik.values.description}
                                            className="block py-2 w-full text-sm text-black dark:text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="description"
                                            className="absolute text-sm text-gray-700 dark:text-gray-500 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                                        >
                                            Project Description
                                        </label>
                                        {updateFormik.errors.description && updateFormik.touched.description && (
                                            <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                                                {updateFormik.errors.description}
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
                                        disabled={sendingRequest}
                                    >
                                        Update Project
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>}

            <div className="p-5">
                <div className="flex md:flex-row flex-col justify-between items-center mb-0 border-b gap-3 md:gap-0 md:h-16 ps-5 p-5 ">
                    {/* Path */}
                    <div className='text-black flex items-center  dark:text-white' >
                        <div onClick={() => navigate('/project')} className="pe-1 cursor-pointer">{selectedProject?.name}</div> <ChevronRight strokeWidth={0.7} />
                        {isRefetching && <div className="md:hidden flex items-center text-blue-500"><Loader2Icon className='animate-spin' /></div>}
                    </div>
                    <div className="flex gap-2">
                        {isRefetching && <div className="md:flex hidden items-center text-blue-500"><Loader2Icon className='animate-spin' /></div>}
                        {/* <div className='text-light font-semibold' >{selectedProject?.name} /</div> */}
                        {data?.data.data.is_manager && <div className="flex gap-2">
                            <Tooltip delay={350} closeDelay={0} content='add team'>
                                <button onClick={() => setAddProjectForm(true)} className="rounded-full bg-light text-white p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Plus size={25} /></button>
                            </Tooltip>
                            <Tooltip delay={350} closeDelay={0} content='update project'>
                                <button onClick={() => setUpdateProjectForm(true)} className="rounded-full  text-yellow-400 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Edit size={25} /></button>
                            </Tooltip>
                            <Tooltip delay={350} closeDelay={0} content='delete project'>
                                <button onClick={() => setDeleteProjectForm(true)} className="rounded-full  text-red-600 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Trash2 size={25} /></button>
                            </Tooltip>
                        </div>}
                    </div>
                </div>

                <div className="mt-3">
                    <h2 className='text-xl capitalize font-semibold text-darkblue dark:text-white mb-3'>All teams</h2>
                    <div className="flex justify-between">

                        <div className="w-full md:w-[70%] flex flex-wrap h-fit gap-3">
                            {isLoading ? <>
                                <div className="py-3 px-4 rounded-lg bg-base dark:bg-dark2 shadow-inner w-full h-10 lg:w-[calc(33.33333%-12px)] bg-opacity-40 animate-pulse"></div>
                                <div className="py-3 px-4 rounded-lg bg-base dark:bg-dark2 shadow-inner w-full h-10 lg:w-[calc(33.33333%-12px)] bg-opacity-40 animate-pulse"></div>
                                <div className="py-3 px-4 rounded-lg bg-base dark:bg-dark2 shadow-inner w-full h-10 lg:w-[calc(33.33333%-12px)] bg-opacity-40 animate-pulse"></div>
                                <div className="py-3 px-4 rounded-lg bg-base dark:bg-dark2 shadow-inner w-full h-10 lg:w-[calc(33.33333%-12px)] bg-opacity-40 animate-pulse"></div>
                                <div className="py-3 px-4 rounded-lg bg-base dark:bg-dark2 shadow-inner w-full h-10 lg:w-[calc(33.33333%-12px)] bg-opacity-40 animate-pulse"></div>
                            </>
                                : <>

                                    {/* Accessible teams */}
                                    {data?.data.data.teams?.filter(team => team.hasAccess).length > 0 ? (
                                        <>
                                            {data?.data.data.teams
                                                .filter(team => team.hasAccess) // Filter teams with access
                                                .map((team) => (
                                                    <div
                                                        key={team.id}
                                                        onClick={() => { setselectedTeam(team); navigate('team') }}
                                                        className="flex justify-between items-center cursor-pointer py-3 px-4 rounded-lg bg-base dark:bg-dark2 shadow-inner w-full lg:w-[calc(33.33333%-12px)] bg-opacity-40 text-lg h-fit"
                                                    >
                                                        {team.name}
                                                        <Unlock size={20} className='opacity-80 text-gray-500' />
                                                    </div>
                                                ))
                                            }
                                            {/* Non-Accessible teams */}
                                            {data?.data.data.teams
                                                .filter(team => team.hasAccess === false) // Explicitly check for false
                                                .map((team) => (
                                                    <div
                                                        key={team.id}
                                                        className="flex justify-between items-center cursor-not-allowed py-3 px-4  rounded-lg bg-base shadow-inner w-full lg:w-[calc(33.33333%-12px)] opacity-50  bg-opacity-40 text-lg h-fit"
                                                    >
                                                        {team.name}
                                                        <Lock size={20} className='text-highlight' />
                                                    </div>
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <div className="capitalize text-gray-400 text-center w-full">No teams with access to show</div>
                                    )}
                                </>
                            }
                        </div>

                        {/* materials */}
                        <div className="hidden md:flex flex-col md:w-[30%] h-full bg-base dark:bg-dark1 p-5 rounded-2xl max-h-[70vh] overflow-y-auto scrollbar-hide">
                            <h2 className='capitalize text-2xl font-semibold text-darkblue dark:text-white' >materials</h2>

                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-1.5 text-gray-600 py-3"><FolderMinus strokeWidth={1.5} /><h2>folders</h2></div>
                                <Link to={'/materials/project'} onClick={() => {
                                    setselectedProjectFolder(selectedProject)
                                }} className='text-light' >see more</Link>
                            </div>

                            <div className="flex flex-col flex-wrap justify-center items-center gap-7">
                                {data?.data.data.teams?.length > 0 ? (
                                    <>
                                        {data?.data.data.teams.filter(team => team.hasAccess).map((team) => (
                                            // materials folders
                                            <div key={team.id} onClick={() => {
                                                setselectedProjectFolder(selectedProject);
                                                setselectedTeamFolder(team)
                                                navigate('/materials/project/team')
                                            }} className="relative bg-white dark:bg-dark2 rounded-lg shadow-lg p-6 w-full rounded-tl-none mt-5 cursor-pointer ">
                                                <div className="absolute w-1/2 -top-6 left-0 bg-white dark:bg-dark2 h-6 text-sm font-semibold px-4 py-1 rounded-tl-lg rounded-tr-3xl "></div>
                                                <div className="">
                                                    <div className="flex items-center gap-2">
                                                        <div className="aspect-square p-1.5 rounded-lg bg-highlight"><Square fill='#eee' color='#eee' size={8} /></div>
                                                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">{team.name}</h2>
                                                    </div>
                                                    <div className="flex justify-between items-center w-full">
                                                        <p className="text-sm text-gray-500 mt-2">{team?.created_at?.substring(0, 10)}</p>
                                                        <FontAwesomeIcon icon={faEllipsisVertical} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="capitalize text-gray-400 text-center w-full">add teams to show</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
