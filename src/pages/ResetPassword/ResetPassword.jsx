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
import DarkmodeToggle from '../../components/DarkmodeToggle/DarkmodeToggle'
import toast from 'react-hot-toast'
import { ThreeDots } from 'react-loader-spinner'


export default function ResetPassword() {
    const [loading, setloading] = useState(false)
    let navigate = useNavigate()

    async function signup(values) {
        setloading(true)
        try {
            let { data } = await axios.post('https://brainmate-new.fly.dev/api/v1/password/reset/confirm', values)
            toast.success(data.message, {
                duration: 2000,
                position: 'bottom-right'
            })
            setloading(false)
            console.log(data);
            navigate('/login')

        } catch (error) {
            setloading(false)
            if (error.response.data.message.email) {
                toast.error(error.response.data.message.email, {
                    position: 'bottom-right'
                })
            } else {
                toast.error('Unexpected error, Please try again', {
                    position: 'bottom-right'
                })
            }
            console.log(error);
        }
    }
    let validationSchema = object({
        password: string().min(6, 'password must be at least 6 length').required('password is required'),
        password_confirmation: string().oneOf([ref('password')], "repassword doesn't match password").required('repassword is required')
    })

    const params = new URLSearchParams(window.location.search);

    let formik = useFormik({
        initialValues: {
            token: params.get('token') || '',
            email: params.get('email') || '',
            password: '',
            password_confirmation: ''
        }, validationSchema, onSubmit: signup
    })


    return <>
        <div className="h-screen bg-base dark:bg-[#0a0a0a] overflow-hidden relative transition-colors duration-300">
            <div className="fixed top-0 z-50 left-1/2 -translate-x-1/2"><DarkmodeToggle /></div>
            <div className="absolute top-0 left-0 bg-darkblue w-[210px] h-[196px] rounded-full -translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute top-0 right-0 bg-darkblue w-[210px] h-[196px] rounded-full translate-x-1/3 -translate-y-1/3 "></div>
            <div className="absolute bottom-0 left-0 bg-darkblue w-[210px] h-[196px] rounded-full -translate-x-1/3 translate-y-1/3 "></div>
            <div className="absolute bottom-0 right-0 bg-darkblue w-[210px] h-[196px] rounded-full translate-x-1/3 translate-y-1/3 "></div>

            <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-[90%] w-[90%] bg-[#ffffffc0] dark:bg-[#121212ac]  transition-colors duration-300 dark:text-white backdrop-blur-md rounded-lg shadow-xl " >
                <div className="container m-auto flex lg:flex-row flex-col items-center lg:items-stretch h-full">
                    <div className="hidden lg:block w-2/3 lg:w-1/2 h ">
                        <img src={image} className='w-full' alt="illustration for sand clock and man working on laptop" />
                    </div>
                    <div className="w-full p-5 overflow-y-scroll lg:w-1/2 flex flex-col items-center " style={{ scrollbarWidth: "none" }}>
                        <div className='w-1/4 lg:w-1/6 pt-10 dark:hidden' ><img src={logo} className='w-full max-w-full object-contain' alt="BrainMate" /></div>
                        <div className='w-1/4 lg:w-1/6 pt-10 hidden dark:block' ><img src={darklogo} className='w-full max-w-full object-contain' alt="BrainMate" /></div>
                        <h1 className='text-5xl font-bold text-center' >New Password</h1>
                        <h2 className='text-primary dark:text-base dark:opacity-80 dark:text-sm text-sm' >The everything app for work and workspaces</h2>
                        <form onSubmit={formik.handleSubmit} className="w-full max-w-sm space-y-3 my-5">
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
                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full h-12 rounded-xl bg-gradient-to-r from-darkblue dark:from-darkblue via-darkblue to-blueblack text-white text-xl font-bold hover:shadow-xl'
                                style={{ transition: 'background-position 0.4s ease', backgroundSize: '150%' }}
                                onMouseEnter={(e) => e.target.style.backgroundPosition = 'right'}
                                onMouseLeave={(e) => e.target.style.backgroundPosition = 'left'}
                            >
                                {loading ? (
                                    <ThreeDots
                                        visible={true}
                                        height="20"
                                        width="43"
                                        color="white"
                                        radius="9"
                                        ariaLabel="three-dots-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="w-fit m-auto"
                                    />
                                ) : "reset"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
}
