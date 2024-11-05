import React, { useContext, useState } from 'react'
import image from '../../assets/images/Work time-pana (1).svg'
import logo from '../../assets/images/brainmate.png'
import darklogo from '../../assets/images/brainmate dark.png'
import googleLogo from '../../assets/images/google.png'
import { NavLink, useNavigate } from 'react-router-dom';
import { UserData } from '../../context/UserContext'
import axios from 'axios'
import { useFormik } from 'formik'
import { object, ref, string } from 'yup'


export default function Signup() {
    const { setToken } = useContext(UserData)
    const [error, setError] = useState('')
    let navigate = useNavigate()

    async function signup(values) {
        try {
            setError('')
            let { data } = await axios.post('https://brainmate-production.up.railway.app/api/register', values)
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
        name: string()
            .matches(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces")
            .trim()
            .min(3, "Full name must be at least 3 characters long")
            .test(
                "is-full-name",
                "Full name must include at least three words",
                (value) => value && value.trim().split(/\s+/).length >= 3
            )
            .required("Full name is required"),
        email: string().email('invalid mail').required('email is required'),
        password: string().min(6, 'password must be at least 6 length').required('password is required'),
        password_confirmation: string().oneOf([ref('password')], "repassword doesn't match password").required('repassword is required')
    })

    let formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: ''
        }, validationSchema, onSubmit: signup
    })


    return <>
        <div className="h-screen bg-base dark:bg-[#0a0a0a] overflow-hidden relative transition-colors duration-300">
            <div className="absolute top-0 left-0 bg-darkTeal w-[210px] h-[196px] rounded-full -translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute top-0 right-0 bg-darkTeal w-[210px] h-[196px] rounded-full translate-x-1/3 -translate-y-1/3 "></div>
            <div className="absolute bottom-0 left-0 bg-darkTeal w-[210px] h-[196px] rounded-full -translate-x-1/3 translate-y-1/3 "></div>
            <div className="absolute bottom-0 right-0 bg-darkTeal w-[210px] h-[196px] rounded-full translate-x-1/3 translate-y-1/3 "></div>

            <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-[90%] w-[90%] bg-[#ffffffc0] dark:bg-[#121212ac]  transition-colors duration-300 dark:text-white backdrop-blur-md rounded-lg shadow-xl " >
                <div className="container m-auto flex lg:flex-row flex-col items-center lg:items-stretch h-full">
                    <div className="hidden lg:block w-2/3 lg:w-1/2 h ">
                        <img src={image} className='w-full' alt="illustration for sand clock and man working on laptop" />
                    </div>
                    <div className="w-full p-5 overflow-y-scroll lg:w-1/2 flex flex-col items-center " style={{ scrollbarWidth: "none" }}>
                        <div className='w-1/4 lg:w-1/6 pt-10 dark:hidden' ><img src={logo} className='w-full max-w-full object-contain' alt="BrainMate" /></div>
                        <div className='w-1/4 lg:w-1/6 pt-10 hidden dark:block' ><img src={darklogo} className='w-full max-w-full object-contain' alt="BrainMate" /></div>
                        <h1 className='text-5xl font-bold text-center' >Let's Start!</h1>
                        <h2 className='text-primary dark:text-base dark:opacity-80 dark:text-sm text-sm' >The everything app for work and workspaces</h2>
                        <form onSubmit={formik.handleSubmit} className="w-full max-w-sm space-y-3 my-5">
                            <div className="relative z-0 w-full group">
                                <input type="text" name="name" id="name" onChange={formik.handleChange} onBlur={formik.handleBlur} className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer" placeholder=" " />
                                <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
                                {formik.errors.name && formik.touched.name &&
                                    <div className=" text-sm text-red-800 rounded-lg bg-transparent dark:text-red-600 " role="alert">
                                        {formik.errors.name}
                                    </div>
                                }
                            </div>
                            <div className="relative z-0 w-full group">
                                <input type="email" name="email" id="email" onChange={formik.handleChange} onBlur={formik.handleBlur} className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer" placeholder=" " />
                                <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                                {formik.errors.email && formik.touched.email &&
                                    <div className=" text-sm text-red-800 rounded-lg bg-transparent dark:text-red-600 " role="alert">
                                        {formik.errors.email}
                                    </div>
                                }
                            </div>
                            <div className="relative z-0 w-full group">
                                <input type="password" name="password" id="password" onChange={formik.handleChange} onBlur={formik.handleBlur} className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer" placeholder=" " />
                                <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                                {formik.errors.password && formik.touched.password &&
                                    <div className=" text-sm text-red-800 rounded-lg bg-transparent dark:text-red-600 " role="alert">
                                        {formik.errors.password}
                                    </div>
                                }
                            </div>
                            <div className="relative z-0 w-full group">
                                <input type="password" name="password_confirmation" id="password_confirmation" onChange={formik.handleChange} onBlur={formik.handleBlur} className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer" placeholder=" " />
                                <label htmlFor="password_confirmation" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">rePassword</label>
                                {formik.errors.password_confirmation && formik.touched.password_confirmation &&
                                    <div className=" text-sm text-red-800 rounded-lg bg-transparent dark:text-red-600 " role="alert">
                                        {formik.errors.password_confirmation}
                                    </div>
                                }
                            </div>
                            <div className="flex items-center">
                                <input id="link-checkbox" type="checkbox" defaultValue className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
                                <label htmlFor="link-checkbox" className="ms-2 text-xs font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">terms and conditions</a>.</label>
                            </div>
                            {error && <div className='bg-red-50 dark:bg-[#e33a3a1a] text-red-800 dark:text-red-600 text-center py-3 mb-2'>
                                {error.email}
                            </div>}
                            <button
                                type='submit'
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
                            <button className='w-full h-12 rounded-xl text-primary dark:text-gray-500 text-opacity-80 border border-solid border-primary border-opacity-40 flex justify-center items-center space-x-3 ' > <img className='h-2/3 me-2' src={googleLogo} alt="google login" /> signup with google</button>
                        </div>
                        <div className='text-primary pb-5 dark:text-gray-500 ' >Already have an account? <NavLink to={'/login'} className='text-darkTeal'>Login</NavLink></div>

                    </div>
                </div>
            </div>




        </div>
    </>
}
