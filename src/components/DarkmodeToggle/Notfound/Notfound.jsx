import React from 'react'
import notFoundAnimation from '../../../assets/images/404 Error Page not Found with people connecting a plug.gif'

export default function Notfound() {
  return <>
    <div className="grid w-screen h-screen">

            <img src={notFoundAnimation} className='w-1/3 m-auto' alt="page not found" />

    </div>
  </>
}
