import { ChevronDown, ChevronUp, CirclePlus, CircleUserRound, ClipboardList, DoorOpen, Headset, House, LayoutDashboard, LayoutGrid, LibraryBig, ListCollapse, NotebookPen, PanelLeft, Users, X } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { SidebarContext } from '../../context/SidebarContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { projectContext } from '../../context/ProjectsContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import toast from 'react-hot-toast';

export default function Sidebar() {
  let { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  let { setselectedProject, selectedProject } = useContext(projectContext);
  const navigate = useNavigate();
  const [teamspacesDropdown, setTeamspacesDropdown] = useState(true);
  const [addProjectForm, setAddProjectForm] = useState(false);
  const token = localStorage.getItem('userToken');

  // Fetch projects
  function getProjects() {
    return axios.get('https://brainmate.fly.dev/api/v1/projects/assigned', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['allprojects'],
    queryFn: getProjects,
    keepPreviousData: true,
  });

  // Add a new project
  async function addProject(values, { resetForm }) {
    try {
      const response = await axios.post(
        'https://brainmate.fly.dev/api/v1/projects/create',
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Project added successfully', {
        duration: 1000,
        position: 'bottom-right',
      });
      resetForm();
      setAddProjectForm(false);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding project', {
        duration: 3000,
        position: 'bottom-right',
      });
    }
  }

  // Form validation schema
  const validationSchema = object({
    name: string().required('Project name is required'),
    description: string().required('Project description is required'),
  });

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      addProject(values, formikHelpers);
    },
  });

  return (
    <>
      {/* Add Project Form with Framer Motion Animation */}
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
              className="bg-white rounded-lg shadow-lg border p-6 w-1/3 relative max-h-[95vh] overflow-y-auto"
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setAddProjectForm(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>

              {/* Add Project Form */}
              <form onSubmit={formik.handleSubmit} className="w-full mt-5">
                {/* Project Name Input */}
                <div className="relative z-0 w-full group mb-4">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="name"
                    className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                  >
                    Project Name
                  </label>
                  {formik.errors.name && formik.touched.name && (
                    <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                      {formik.errors.name}
                    </div>
                  )}
                </div>

                {/* Project Description Input */}
                <div className="relative z-0 w-full group mb-4">
                  <textarea
                    name="description"
                    id="description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    className="block py-2 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="description"
                    className="absolute text-sm text-gray-700 transition-transform duration-300 transform scale-75 -translate-y-6 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-darkTeal"
                  >
                    Project Description
                  </label>
                  {formik.errors.description && formik.touched.description && (
                    <div className="text-sm text-red-500 rounded-lg bg-transparent" role="alert">
                      {formik.errors.description}
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
                  Add Project
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`${!sidebarOpen ? "w-16" : "w-48"} transition-all h-[calc(100vh-48px)] fixed left-0 z-50 bg-darkblue flex flex-col px-0 text-white mt-12 text-[13px]`}>
        <div className="px-3 pb-3 border-b">
          <div className={`flex ${!sidebarOpen ? "flex-col-reverse items-center mt-3" : ""} justify-between relative after:absolute after:content-[""] after:h-[1px] after:w-full after:bg-gray-500 after:bottom-1 `} >
            <Link to={'profile'} className='text-darkTeal bg-white rounded-3xl w-fit my-5 '><CircleUserRound color='#0b2534' /></Link>
            <button className='w-fit' onClick={() => { setSidebarOpen(!sidebarOpen) }} ><PanelLeft /></button>
          </div>
          <ul className={`space-y-1 `}>
            <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={""} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><House /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >Home</h2></div></NavLink></li>
            <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"dashboard"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><LayoutDashboard /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >Dashboard</h2></div></NavLink></li>
            <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"mytasks"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><ClipboardList /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >my Tasks</h2></div></NavLink></li>
            <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"teamspaces"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><Users /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >my teams</h2></div></NavLink></li>
            <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"materials"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><LibraryBig /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >materials</h2></div></NavLink></li>
            <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"meetings"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><Headset /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >meetings</h2></div></NavLink></li>
            <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"workspaces"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><DoorOpen /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >workspaces</h2></div></NavLink></li>
            <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"notes"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><NotebookPen /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >notes</h2></div></NavLink></li>
          </ul>
        </div>
        <div className="bg-blueblack h-full overflow-y-scroll p-3" style={{ scrollbarWidth: 'none' }}>
          {/* Team Spaces List */}
          {sidebarOpen ? (
            <>
              <div>
                <button onClick={() => { setTeamspacesDropdown(!teamspacesDropdown) }} className='flex items-center justify-between w-full'>
                  <div className="flex items-center space-x-2"><Users /> <h2>Projects list</h2></div>
                  {teamspacesDropdown ? <ChevronUp /> : <ChevronDown />}
                </button>
                <div className={`flex flex-col space-y-1 mt-2 ms-2 bg-white text-blueblack p-2 rounded-lg rounded-tl-none ${teamspacesDropdown ? 'block' : 'hidden'}`}>
                  <button onClick={() => setAddProjectForm(true)} className='flex items-center space-x-2 '><CirclePlus /><h3 className='capitalize'>add project</h3></button>
                  {isLoading ? (
                    <>
                      <div className="w-2/3 h-2 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.0s" }} ></div>
                      <div className="w-1/3 h-2 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.15s" }} ></div>
                      <div className="w-1/2 h-2 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.3s" }} ></div>
                    </>
                  ) : (
                    <>
                      {data?.data.data.projects.map((project) => (
                        <button key={project.id} onClick={() => { setselectedProject(project); navigate('projectTeams') }} className={`flex items-center space-x-2 border-t `}><ListCollapse /> <h3>{project.name}</h3></button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <button onClick={() => { setSidebarOpen(!sidebarOpen); setTeamspacesDropdown(true) }}><LayoutGrid /></button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}