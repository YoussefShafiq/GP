import { ChartNoAxesCombined, CircleUserRound, ClipboardList, DoorOpen, Headset, House, LayoutDashboard, LibraryBig, NotebookPen, PanelLeft, Users } from 'lucide-react'
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { SidebarContext } from '../../context/SidebarContext'
import Logout from '../Logout/Logout'

export default function Sidebar() {

  let { sidebarOpen, setSidebarOpen } = useContext(SidebarContext)

  return <>
    <div className={`${!sidebarOpen ? "w-16" : "w-48"} shadow-xl transition-all h-screen fixed left-0 z-50 bg-darkTeal flex flex-col px-3 text-white mt-12 text-[13px]`}>
      <div className={`flex ${!sidebarOpen ? "flex-col-reverse items-center mt-3" : ""} justify-between relative after:absolute after:content-[""] after:h-[1px] after:w-full after:bg-gray-500 after:bottom-1 `} >
        <div className='text-darkTeal bg-white rounded-3xl w-fit my-5 '><CircleUserRound /></div>
        <button className='w-fit' onClick={() => { setSidebarOpen(!sidebarOpen) }} ><PanelLeft /></button>
      </div>
      <ul className={`space-y-1 `}>
        <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={""} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><House /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >Home</h2></div></NavLink></li>
        <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"dashboard"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><LayoutDashboard /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >Dashboard</h2></div></NavLink></li>
        <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"tasks"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><ClipboardList /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >Tasks</h2></div></NavLink></li>
        <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"teamspaces"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><Users /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >team spaces</h2></div></NavLink></li>
        <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"materials"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><LibraryBig /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >materials</h2></div></NavLink></li>
        <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"meetings"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><Headset /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >meetings</h2></div></NavLink></li>
        <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"workspaces"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><DoorOpen /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >workspaces</h2></div></NavLink></li>
        <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"notes"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><NotebookPen /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >notes</h2></div></NavLink></li>
        <li><NavLink className={`px-2 rounded-3xl ${!sidebarOpen ? "" : "pe-4 "} py-[6px] block`} to={"reports"} ><div className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} space-x-2 capitalize `} ><ChartNoAxesCombined /><h2 className={`${!sidebarOpen ? "hidden" : ""} `} >reports</h2></div></NavLink></li>
      </ul>

      <Logout />
    </div>
  </>
}
