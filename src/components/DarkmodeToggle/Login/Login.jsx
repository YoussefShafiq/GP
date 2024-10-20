import React, { useState } from 'react'
import image from '../../../assets/images/Work time-pana (1).svg'
import logo from '../../../assets/images/brainmate.svg'
import googleLogo from '../../../assets/images/google.png'
import { NavLink } from 'react-router-dom';


export default function Login() {

    const [isFlipped, setIsFlipped] = useState(false);

    // Toggle flip state on click
    const handleCardClick = () => {
      setIsFlipped(!isFlipped);
    };
  return <>
    <div className="lg:h-screen h-fit bg-base overflow-hidden relative">
        <div className="absolute top-0 left-0 bg-darkTeal w-[210px] h-[196px] rounded-full -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute top-0 right-0 bg-darkTeal w-[210px] h-[196px] rounded-full translate-x-1/3 -translate-y-1/3 "></div>
        <div className="absolute bottom-0 left-0 bg-darkTeal w-[210px] h-[196px] rounded-full -translate-x-1/3 translate-y-1/3 "></div>
        <div className="absolute bottom-0 right-0 bg-darkTeal w-[210px] h-[196px] rounded-full translate-x-1/3 translate-y-1/3 "></div>
 
        <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-[90%] w-[90%] bg-[#ffffffc0] backdrop-blur-md rounded-lg shadow-xl ">
            <div className="container m-auto flex h-full">
                <div className="w-1/2">
                    <img src={image} alt="illustration for sand clock and man working on laptop" />
                </div>
                <div className="w-1/2 flex flex-col items-center justify-center">
                    <div className='w-1/5 scale-125' ><img src={logo} alt="BrainMate" /></div>
                    <h1 className='text-5xl font-bold' >Welcome Back!</h1>
                    <h2 className='text-primary text-sm' >The everything app for work and workspaces</h2>
                    <form className="w-full max-w-sm my-5">
                        <div className="relative z-0 w-full group mb-5">
                            <input type="email" name="email"  id="email" className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer" placeholder=" " />
                            <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                        </div>
                        <div className="relative z-0 w-full group">
                            <input type="password" name="password"  id="password" className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer" placeholder=" " />
                            <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                        </div>
                        <div className='text-darkTeal text-end mb-5' ><button>forget password?</button></div>
                        <button
                            className='w-full h-12 rounded-xl bg-gradient-to-r from-primary via-darkTeal to-darkTeal text-white text-xl font-bold hover:shadow-md'
                            style={{ transition: 'background-position 0.4s ease', backgroundSize: '150%' }}
                            onMouseEnter={(e) => e.target.style.backgroundPosition = 'right'}
                            onMouseLeave={(e) => e.target.style.backgroundPosition = 'left'}
                            >
                            Login
                        </button>
                    </form>

                    <div className='relative opacity-70 '>
                        <p className='before:content-[""] before:absolute before:h-[1px] before:w-2 before:bg-primary before:-left-2 before:top-1/2 before:-translate-x-full after:content-[""] after:absolute after:h-[1px] after:w-2 after:bg-primary after:-right-2 after:top-1/2 after:translate-x-full '>OR</p>
                    </div>
                    <div className='w-full max-w-sm my-5'>
                        <button className='w-full h-12 rounded-xl text-primary text-opacity-80 border border-solid border-primary border-opacity-40 flex justify-center items-center space-x-3 ' > <img className='h-2/3 me-2' src={googleLogo} alt="google login" /> Login with google</button>
                    </div>
                    <div className='text-primary' >Don't have an account? <NavLink to={'/signup'} className={'text-darkTeal'} >Sign up</NavLink></div>
                </div>
            </div>
        </div>


    

    </div>
  </>
}