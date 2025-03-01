import React, { useContext } from 'react'
import DarkmodeToggle from '../DarkmodeToggle/DarkmodeToggle'
import whitelogo from '../../assets/images/brainmate white.png'
import NavbarList from '../NavbarList/NavbarList'
import { PanelLeft } from 'lucide-react'
import { SidebarContext } from '../../context/SidebarContext'

export default function Navbar() {
  let { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);

  return <>
    <div className='fixed flex w-full bg-darkblue text-center h-12 z-[50] justify-between px-5' >
      <div className='flex items-center' >
        <button className='w-fit md:hidden text-white' onClick={() => { setSidebarOpen(!sidebarOpen) }} ><PanelLeft /></button>
        <img className='h-full py-[2px]' src={whitelogo} alt="" />
        <h1 className='text-base font-semibold'>BrainMate</h1>
      </div>
      <div className='flex items-center'>
        <NavbarList />
        <DarkmodeToggle />
      </div>
    </div>
  </>
}
