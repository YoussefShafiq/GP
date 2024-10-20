import React from 'react'
import DarkmodeToggle from '../DarkmodeToggle/DarkmodeToggle'

export default function Navbar() {
  return <>
  <div className='fixed w-full text-center z-50' >
    <DarkmodeToggle/>
  </div>
  </>
}
