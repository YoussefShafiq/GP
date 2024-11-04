import React from 'react'
import DarkmodeToggle from '../DarkmodeToggle/DarkmodeToggle'
import whitelogo from '../../assets/images/brainmate white.png'

export default function Navbar() {
  return <>
  <div className='fixed flex w-full bg-darkTeal text-center h-12 z-50 justify-between px-5' >
    <div className='flex items-center' >
      <img className='h-full scale-100' src={whitelogo} alt="" />
      <h1 className='text-base font-semibold'>BrainMate</h1>
    </div>
    <div className='flex items-center'>
      <DarkmodeToggle/>
    </div>
  </div>
  </>
}
