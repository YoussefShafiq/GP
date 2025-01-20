import React, { useContext } from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import { SidebarContext } from '../../context/SidebarContext'

export default function Layout() {

  let { sidebarOpen, setSidebarOpen } = useContext(SidebarContext)


  return <>
    <Navbar />
    <Sidebar />
    <div className={`${!sidebarOpen ? "ms-16" : "ms-48"} pt-12 transition-all relative`}>
      {/* <div className="fixed w-3 h-3 top-12 bg-darkblue">
        <div className="w-3 h-3 bg-white dark:bg-dark rounded-tl-full"></div>
      </div> */}
      <Outlet></Outlet>
    </div>
  </>
}
