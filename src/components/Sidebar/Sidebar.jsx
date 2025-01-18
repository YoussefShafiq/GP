import { ChartNoAxesCombined, ChevronDown, ChevronUp, CirclePlus, CircleUserRound, ClipboardList, DoorOpen, Headset, House, LayoutDashboard, LayoutGrid, LibraryBig, ListCollapse, NotebookPen, PanelLeft, Users } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { SidebarContext } from '../../context/SidebarContext'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'


export default function Sidebar() {
  let { sidebarOpen, setSidebarOpen } = useContext(SidebarContext)
  const [teamspacesDropdown, setTeamspacesDropdown] = useState(true)
  const token = localStorage.getItem('userToken')
  function getProjects() {
    return axios.get('https://brainmate.fly.dev/api/v1/projects/assigned', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data, isLoading, isFetching } = useQuery({
    queryKey: ['allprojects'],
    queryFn: getProjects,
    keepPreviousData: true,
  })



  return <>
    <div className={`${!sidebarOpen ? "w-16" : "w-48"} transition-all h-[calc(100vh-48px)] fixed left-0 z-50 bg-darkblue flex flex-col px-0 text-white mt-12 text-[13px]`}>
      <div className="px-3 pb-3 border-b">
        <div className={`flex ${!sidebarOpen ? "flex-col-reverse items-center mt-3" : ""} justify-between relative after:absolute after:content-[""] after:h-[1px] after:w-full after:bg-gray-500 after:bottom-1 `} >
          <div className='text-darkTeal bg-white rounded-3xl w-fit my-5 '><CircleUserRound color='#0b2534' /></div>
          <button className='w-fit' onClick={() => { setSidebarOpen(!sidebarOpen) }} ><PanelLeft /></button>
        </div>
        <ul className={`space-y-1 `}>
          <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={""} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><House /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >Home</h2></div></NavLink></li>
          <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"dashboard"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><LayoutDashboard /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >Dashboard</h2></div></NavLink></li>
          <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"tasks"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><ClipboardList /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >my Tasks</h2></div></NavLink></li>
          <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"teamspaces"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><Users /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >my teams</h2></div></NavLink></li>
          <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"materials"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><LibraryBig /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >materials</h2></div></NavLink></li>
          <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"meetings"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><Headset /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >meetings</h2></div></NavLink></li>
          <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"workspaces"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><DoorOpen /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >workspaces</h2></div></NavLink></li>
          <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"notes"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><NotebookPen /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >notes</h2></div></NavLink></li>
          <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"reports"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><ChartNoAxesCombined /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >reports</h2></div></NavLink></li>
        </ul>
      </div>
      <div className="bg-blueblack h-full overflow-y-scroll p-3" style={{ scrollbarWidth: 'none' }}>
        {/* team spaces list */}
        {sidebarOpen ? <>
          <div>
            <button onClick={() => { setTeamspacesDropdown(!teamspacesDropdown) }} className='flex items-center justify-between w-full'><div className="flex items-center space-x-2"><Users /> <h2>Projects list</h2></div> {teamspacesDropdown ? <ChevronUp /> : <ChevronDown />}    </button>
            <div className={`flex flex-col space-y-1 mt-2 ms-2 bg-white text-blueblack p-2 rounded-lg rounded-tl-none ${teamspacesDropdown ? 'block' : 'hidden'}`}>
              <button className='flex items-center space-x-2 '><CirclePlus /><h3 className='capitalize'>add project</h3> </button>
              {isLoading ? <>
                <div className="w-2/3 h-2 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.0s" }} ></div>
                <div className="w-1/3 h-2 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.15s" }} ></div>
                <div className="w-1/2 h-2 bg-slate-400 opacity-20 rounded animate-pulse" style={{ animationDelay: "0.3s" }} ></div>
              </> : <>
                {data?.data.data.projects.map((project) => (
                  <button key={project.id} className='flex items-center space-x-2 border-t'><ListCollapse /> <h3 className='capitalize'>{project.name}</h3> </button>
                ))}
              </>}
            </div>
          </div>
        </> : <>
          <div className="flex justify-center">
            <button onClick={() => { setSidebarOpen(!sidebarOpen); setTeamspacesDropdown(true) }}><LayoutGrid /></button>
          </div>
        </>}

      </div>

    </div>
  </>
}
