import React, { useContext } from 'react'
import DarkmodeToggle from '../DarkmodeToggle/DarkmodeToggle'
import whitelogo from '../../assets/images/brainmate white.png'
import NavbarList from '../NavbarList/NavbarList'
import { PanelLeft } from 'lucide-react'
import { SidebarContext } from '../../context/SidebarContext'
import Notifications from '../Notifications/Notifications'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  let { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const navigate = useNavigate()

  return <>
    <div className='fixed flex w-full bg-darkblue dark:bg-darklayout text-center h-12 z-[50] justify-between px-5' >
      <div className='flex items-center' >
        <button className='w-fit md:hidden text-white' onClick={() => { setSidebarOpen(!sidebarOpen) }} ><PanelLeft /></button>
        <div onClick={() => navigate('/')} className='h-full flex items-center cursor-pointer'>
          <img className='h-full py-[2px]' src={whitelogo} alt="" />
          <h1 className='text-base font-semibold'>BrainMate</h1>
        </div>
      </div>
      <div className='flex lg:flex-row-reverse items-center'>
        <DarkmodeToggle />
        <NavbarList />
        <Notifications />
      </div>
    </div>
  </>
}
