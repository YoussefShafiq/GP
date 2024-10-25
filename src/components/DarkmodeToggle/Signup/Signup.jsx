import React, { useState } from 'react'
import image from '../../../assets/images/Work time-pana (1).svg'
import logo from '../../../assets/images/brainmate.svg'
import darklogo from '../../../assets/images/brainmate dark.svg'
import googleLogo from '../../../assets/images/google.png'
import { NavLink } from 'react-router-dom';


export default function Signup() {

    const [isFlipped, setIsFlipped] = useState(false);

    // Toggle flip state on click
    const handleCardClick = () => {
      setIsFlipped(!isFlipped);
    };
  return <>
    <div className="h-screen bg-base dark:bg-[#0a0a0a] overflow-hidden relative transition-colors duration-300">
        <div className="absolute top-0 left-0 bg-darkTeal w-[210px] h-[196px] rounded-full -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute top-0 right-0 bg-darkTeal w-[210px] h-[196px] rounded-full translate-x-1/3 -translate-y-1/3 "></div>
        <div className="absolute bottom-0 left-0 bg-darkTeal w-[210px] h-[196px] rounded-full -translate-x-1/3 translate-y-1/3 "></div>
        <div className="absolute bottom-0 right-0 bg-darkTeal w-[210px] h-[196px] rounded-full translate-x-1/3 translate-y-1/3 "></div>
 
        <div className=" overflow-y-scroll relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-[90%] w-[90%] bg-[#ffffffc0] dark:bg-[#121212ac]  transition-colors duration-300 dark:text-white backdrop-blur-md rounded-lg shadow-xl " style={{scrollbarWidth: "none" }}>
            <div className="container m-auto flex lg:flex-row flex-col items-center lg:items-stretch h-full">
                <div className="w-2/3 lg:w-1/2 ">
                    <img src={image} alt="illustration for sand clock and man working on laptop" />
                </div>
                <div className="w-full p-5 lg:p-0 lg:w-1/2 flex flex-col items-center justify-center">
                    <div className='w-2/5 lg:w-1/5 scale-125 dark:hidden' ><img src={logo} alt="BrainMate" /></div>
                    <div className='w-1/5 scale-125 hidden dark:block' ><img src={darklogo} alt="BrainMate" /></div>
                    <h1 className='text-5xl font-bold text-center' >Let's Start!</h1>
                    <h2 className='text-primary dark:text-base dark:opacity-80 dark:text-sm text-sm' >The everything app for work and workspaces</h2>
                    <form className="w-full max-w-sm space-y-3 my-5">
                        <div className="relative z-0 w-full group">
                            <input type="text" name="name"  id="name" className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer" placeholder=" " />
                            <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
                        </div>
                        <div className="relative z-0 w-full group">
                            <input type="email" name="email"  id="email" className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer" placeholder=" " />
                            <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                        </div>
                        <div className="relative z-0 w-full group">
                            <input type="password" name="password"  id="password" className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer" placeholder=" " />
                            <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                        </div>
                        <div className="flex items-center">
                            <input id="link-checkbox" type="checkbox" defaultValue className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor="link-checkbox" className="ms-2 text-xs font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">terms and conditions</a>.</label>
                        </div>
                        <button 
                            className='w-full h-12 rounded-xl bg-gradient-to-r from-primary dark:from-darkTeal via-darkTeal to-darkTeal text-white text-xl font-bold hover:shadow-xl'
                            style={{ transition: 'background-position 0.4s ease', backgroundSize: '150%' }}
                            onMouseEnter={(e) => e.target.style.backgroundPosition = 'right'}
                            onMouseLeave={(e) => e.target.style.backgroundPosition = 'left'}
                            >
                            Sign up
                        </button>
                    </form>

                    <div className='relative opacity-70 '>
                        <p className='before:content-[""] before:absolute before:h-[1px] before:w-2 before:bg-primary before:-left-2 before:top-1/2 before:-translate-x-full after:content-[""] after:absolute after:h-[1px] after:w-2 after:bg-primary after:-right-2 after:top-1/2 after:translate-x-full '>OR</p>
                    </div>
                    <div className='w-full max-w-sm my-5'>
                        <button className='w-full h-12 rounded-xl text-primary dark:text-gray-500 text-opacity-80 border border-solid border-primary border-opacity-40 flex justify-center items-center space-x-3 ' > <img className='h-2/3 me-2' src={googleLogo} alt="google login" /> Login with google</button>
                    </div>
                    <div className='text-primary dark:text-gray-500 ' >Already have an account? <NavLink to={'/login'} className='text-darkTeal'>Login</NavLink></div>

                </div>
            </div>
        </div>


    

    </div>
  </>
}
