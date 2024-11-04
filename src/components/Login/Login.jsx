import React, { useContext, useState } from 'react'
import image from '../../assets/images/Work time-pana (1).svg'
import logo from '../../assets/images/brainmate.png'
import darklogo from '../../assets/images/brainmate dark.png'
import googleLogo from '../../assets/images/google.png'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Formik, useFormik } from 'formik'
import { UserData } from './../../context/UserContext';
import axios from 'axios'
import { object, string } from 'yup'


export default function Login() {
    const { setToken } = useContext(UserData)
    const [error, setError] = useState('')
    let navigate = useNavigate()

    async function login(values) {
        try {
            setError('')
            let { data } = await axios.post('https://brainmate-production.up.railway.app/api/login', values)
            console.log(data);
            setToken(data.data.token)
            localStorage.setItem('userToken', data.data.token)
            navigate('/')

        } catch (error) {
            console.log(error.response.data.message);
            setError(error.response.data.message)
        }
    }

    let validationSchema = object({
        email: string().email('invalid mail').required('email is required'),
        password: string().min(6, 'password must be at least 6 length').required('password is required')
    })

    let formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        }, validationSchema, onSubmit: login
    })

    return <>
        <div className="h-screen bg-base dark:bg-[#0a0a0a] overflow-hidden relative transition-colors duration-300 ">
            <div className="absolute top-0 left-0 bg-darkTeal w-[210px] h-[196px] rounded-full -translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute top-0 right-0 bg-darkTeal w-[210px] h-[196px] rounded-full translate-x-1/3 -translate-y-1/3 "></div>
            <div className="absolute bottom-0 left-0 bg-darkTeal w-[210px] h-[196px] rounded-full -translate-x-1/3 translate-y-1/3 "></div>
            <div className="absolute bottom-0 right-0 bg-darkTeal w-[210px] h-[196px] rounded-full translate-x-1/3 translate-y-1/3 "></div>

            <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-[90%] w-[90%] bg-[#ffffffc0] dark:bg-[#121212ac]  transition-colors duration-300 dark:text-white backdrop-blur-md rounded-lg shadow-xl " >
                <div className="container m-auto flex lg:flex-row flex-col items-center lg:items-stretch h-full" style={{ scrollbarWidth: 'none' }}>
                    <div className="hidden lg:block w-2/3 lg:w-1/2 h ">
                        <img src={image} className='w-full' alt="illustration for sand clock and man working on laptop" />
                    </div>
                    <div className="w-full p-5 lg:p-0 lg:w-1/2 flex flex-col items-center justify-center overflow-y-scroll">
                        <div className='w-1/4 lg:w-1/6 pt-10 dark:hidden' ><img src={logo} className='w-full max-w-full object-contain' alt="BrainMate" /></div>
                        <div className='w-1/4 lg:w-1/6 pt-10 hidden dark:block' ><img src={darklogo} className='w-full max-w-full object-contain' alt="BrainMate" /></div>
                        <h1 className='text-5xl font-bold text-center' >Welcome Back!</h1>
                        <h2 className='text-primary dark:text-base dark:opacity-80 dark:text-sm text-sm' >The everything app for work and workspaces</h2>
                        <form onSubmit={formik.handleSubmit} className="w-full max-w-sm my-5">
                            <div className="relative z-0 w-full group mb-4">
                                <input type="email" name="email" id="email" onBlur={formik.handleBlur} onChange={formik.handleChange} className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer" placeholder=" " />
                                <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                                {formik.errors.email && formik.touched.email &&
                                    <div className=" text-sm text-red-800 rounded-lg bg-transparent dark:text-red-600 " role="alert">
                                        {formik.errors.email}
                                    </div>
                                }
                            </div>
                            <div className="relative z-0 w-full group">
                                <input type="password" name="password" id="password" onBlur={formik.handleBlur} onChange={formik.handleChange} className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer" placeholder=" " />
                                <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                                {formik.errors.password && formik.touched.password &&
                                    <div className=" text-sm text-red-800 rounded-lg bg-transparent dark:text-red-600" role="alert">
                                        {formik.errors.password}
                                    </div>
                                }
                            </div>
                            <div className='text-darkTeal text-end mb-5' ><Link to={'/forgetpassword'}>forget password?</Link></div>
                            {error && <div className='bg-red-50 dark:bg-[#e33a3a1a] text-red-800 dark:text-red-600 text-center py-3 mb-2'>
                                {error}
                            </div>}
                            <button
                                type="submit"
                                className='w-full h-12 rounded-xl bg-gradient-to-r from-primary dark:from-darkTeal via-darkTeal to-darkTeal text-white text-xl font-bold hover:shadow-md'
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
                            <button className='w-full h-12 rounded-xl text-primary dark:text-gray-500 text-opacity-80 border border-solid border-primary border-opacity-40 flex justify-center items-center space-x-3 ' > <img className='h-2/3 me-2' src={googleLogo} alt="google login" /> Login with google</button>
                        </div>
                        <div className='text-primary dark:text-gray-500' >Don't have an account? <NavLink to={'/signup'} className={'text-darkTeal'} >Sign up</NavLink></div>
                    </div>
                </div>
            </div>




        </div>
    </>
}
