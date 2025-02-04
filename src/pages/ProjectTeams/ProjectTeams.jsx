import React, { useContext, useEffect, useRef, useState } from 'react';
import { projectContext } from '../../context/ProjectsContext';
import { MousePointerClick, Plus, X, Trash, Edit, FolderMinus, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { TeamsContext } from '../../context/TeamsContext';

export default function ProjectTeams() {
    let { selectedProject, setselectedProject } = useContext(projectContext);
    let { selectedTeam, setselectedTeam } = useContext(TeamsContext);
    const [addProjectForm, setAddProjectForm] = useState(false);
    const [deleteProjectForm, setDeleteProjectForm] = useState(false);
    const [updateProjectForm, setUpdateProjectForm] = useState(false);
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

    let { data, isLoading, refetch } = useQuery({
        queryKey: ['projectTeams', selectedProject?.id], // Add selectedProject.id to queryKey
        queryFn: getProjectTeams,
        keepPreviousData: true,
        enabled: !!selectedProject, // Only fetch if selectedProject is defined
    });

    console.log(data);

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
        console.log("Adding team with values:", values); // Debugging
        console.log("Selected Project ID:", selectedProject.id); // Debugging
        setAddProjectForm(false);
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
            resetForm();
            refetch(); // Refetch teams after adding a new team
        } catch (error) {
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
            resetForm();
            setDeleteProjectForm(false);
            setselectedProject(null);
            sidebarProjects.refetch();
        } catch (error) {
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
            resetForm();
            setUpdateProjectForm(false);
            setselectedProject(response.data.data.project); // Update selectedProject with the new data
            // console.log("response:");

            console.log(response);

            sidebarProjects.refetch();
            refetch();
        } catch (error) {
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
                                className="bg-white rounded-lg shadow-lg border p-6 w-5/6 md:w-1/3 relative max-h-[95vh] overflow-y-auto"
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
                                            className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="name"
                                            className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
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
                                className="bg-white rounded-lg shadow-lg border p-6 w-5/6 md:w-1/3 relative max-h-[95vh] overflow-y-auto"
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
                                            className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="projectName"
                                            className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
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
                                className="bg-white rounded-lg shadow-lg border p-6 w-5/6 md:w-1/3 relative max-h-[95vh] overflow-y-auto"
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
                                            className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="name"
                                            className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
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
                                            className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="description"
                                            className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
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
                <div className="flex justify-between items-center mb-5 h-16 ps-5">
                    {/* Path */}
                    <div className='text-light font-semibold flex items-center' >
                        <div onClick={() => navigate('/project')} className="pe-1 cursor-pointer">{selectedProject?.name}</div> /
                    </div>
                    {/* <div className='text-light font-semibold' >{selectedProject?.name} /</div> */}
                    {data?.data.data.is_manager && <div className="flex gap-2">
                        <button onClick={() => setAddProjectForm(true)} className="rounded-full bg-light text-white p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Plus size={25} /></button>
                        <button onClick={() => setUpdateProjectForm(true)} className="rounded-full bg-white text-yellow-400 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Edit size={25} /></button>
                        <button onClick={() => setDeleteProjectForm(true)} className="rounded-full bg-white text-red-600 p-1 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Trash2 size={25} /></button>
                    </div>}
                </div>

                {/* Accessible teams */}
                <h2 className='text-xl capitalize font-semibold text-highlight mb-3'>My teams</h2>
                <div className="flex justify-between">

                    <div className="w-full md:w-[70%] flex flex-wrap h-fit gap-3">
                        {isLoading ? <>
                            <div className="py-3 px-4 rounded-3xl bg-base text-xl h-fit animate-pulse w-24"></div>
                            <div className="py-3 px-4 rounded-3xl bg-base text-xl h-fit animate-pulse w-24"></div>
                            <div className="py-3 px-4 rounded-3xl bg-base text-xl h-fit animate-pulse w-24"></div>
                        </>
                            : <>
                                {data?.data.data.teams?.filter(team => team.hasAccess).length > 0 ? (
                                    <>
                                        {data?.data.data.teams
                                            .filter(team => team.hasAccess) // Filter teams with access
                                            .map((team) => (
                                                <div
                                                    key={team.id}
                                                    onClick={() => { setselectedTeam(team); navigate('team') }}
                                                    className="cursor-pointer py-3 px-4 rounded-3xl bg-base shadow-inner bg-opacity-40 text-lg h-fit"
                                                >
                                                    {team.name}
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
                    <div className="hidden md:flex flex-col md:w-[30%] h-full bg-base p-5 rounded-2xl max-h-[50vh] overflow-y-scroll">
                        <h2 className='capitalize text-2xl font-semibold text-darkblue' >materials</h2>

                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-1.5 text-gray-600 py-3"><FolderMinus strokeWidth={1.5} /><h2>folders</h2></div>
                            <Link to={'/materials'} className='text-light' >see more</Link>
                        </div>

                        <div className="flex flex-col flex-wrap justify-center items-center gap-7">
                            {data?.data.data.teams?.length > 0 ? (
                                <>
                                    {data?.data.data.teams.map((team) => (
                                        // materials folders
                                        <div key={team.id} className="relative bg-white rounded-lg shadow-lg p-6 w-full">
                                            <div className="absolute w-1/2 -top-4 left-0 bg-white h-6 text-white text-sm font-semibold px-4 py-1 rounded-tl-lg rounded-tr-3xl"></div>
                                            <div className="">
                                                <h2 className="text-lg font-bold text-gray-800">{team.name}</h2>
                                                <p className="text-sm text-gray-500 mt-2">Apr 2, 2023</p>
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
                {/* Non-accessible teams */}
                <div>
                    <div className="w-[95%] mx-auto my-8 h-[1px] bg-gray-300"></div>
                    <h2 className='text-xl capitalize font-semibold text-highlight mb-3'>Other teams</h2>
                    <div className="w-full flex flex-wrap h-fit gap-3">
                        {isLoading ? <>
                            <div className="py-3 px-4 rounded-3xl bg-base text-xl h-fit animate-pulse w-24"></div>
                            <div className="py-3 px-4 rounded-3xl bg-base text-xl h-fit animate-pulse w-24"></div>
                            <div className="py-3 px-4 rounded-3xl bg-base text-xl h-fit animate-pulse w-24"></div>
                        </>
                            : <>
                                {data?.data.data.teams?.filter(team => team.hasAccess === false).length > 0 ? (
                                    <>
                                        {data?.data.data.teams
                                            .filter(team => team.hasAccess === false) // Explicitly check for false
                                            .map((team) => (
                                                <div
                                                    key={team.id}
                                                    className="cursor-not-allowed py-3 px-4 rounded-3xl bg-base opacity-50 shadow-inner bg-opacity-40 text-lg h-fit"
                                                >
                                                    {team.name} {team.id}
                                                </div>
                                            ))
                                        }
                                    </>
                                ) : (
                                    <div className="capitalize text-gray-400 text-center w-full">No teams without access to show</div>
                                )}
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}