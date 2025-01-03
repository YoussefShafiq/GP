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
    <div className={`${!sidebarOpen ? "ms-16" : "ms-48"} pt-12 transition-all`}>
      <Outlet></Outlet>
    </div>
  </>
}
