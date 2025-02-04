import React from 'react'
import DarkmodeToggle from '../DarkmodeToggle/DarkmodeToggle'
import whitelogo from '../../assets/images/brainmate white.png'
import NavbarList from '../NavbarList/NavbarList'

export default function Navbar() {
  return <>
    <div className='fixed flex w-full bg-darkblue text-center h-12 z-[50] justify-between px-5' >
      <div className='flex items-center' >
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
