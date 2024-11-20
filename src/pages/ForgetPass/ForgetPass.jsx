import React, { useContext, useState } from 'react'
import image from '../../assets/images/Work time-pana (1).svg'
import logo from '../../assets/images/brainmate.svg'
import darklogo from '../../assets/images/brainmate dark.svg'
import googleLogo from '../../assets/images/google.png'
import { NavLink, useNavigate } from 'react-router-dom';
import { UserData } from '../../context/UserContext'
import axios from 'axios'
import { useFormik } from 'formik'
import DarkmodeToggle from '../../components/DarkmodeToggle/DarkmodeToggle'
import toast from 'react-hot-toast'
import { MailCheckIcon } from 'lucide-react'
import { ThreeDots } from 'react-loader-spinner'


export default function ForgetPass() {

    const [loading, setloading] = useState(false)

    async function resetpassword(values) {
        setloading(true)
        try {
            let { data } = await axios.post('https://brainmate-production.up.railway.app/api/password/reset-link', values)
            setloading(false)
            toast.success(data.message, {
                duration: 6000,
                icon: <MailCheckIcon color='#009900' />,
                position: 'bottom-right'
            })
        } catch (error) {
            setloading(false)
            toast.error(error.response.data.message.email, {
                position: 'bottom-right'
            })
            console.log(error);
        }
    }

    let formik = useFormik({
        initialValues: {
            email: '',
        }, onSubmit: resetpassword
    })


    return <>
        <div className="h-screen bg-base dark:bg-[#0a0a0a] overflow-hidden relative transition-colors duration-300">
            <div className="fixed top-0 z-50 left-1/2 -translate-x-1/2"><DarkmodeToggle /></div>
            <div className="absolute top-0 left-0 bg-darkblue w-[210px] h-[196px] rounded-full -translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute top-0 right-0 bg-darkblue w-[210px] h-[196px] rounded-full translate-x-1/3 -translate-y-1/3 "></div>
            <div className="absolute bottom-0 left-0 bg-darkblue w-[210px] h-[196px] rounded-full -translate-x-1/3 translate-y-1/3 "></div>
            <div className="absolute bottom-0 right-0 bg-darkblue w-[210px] h-[196px] rounded-full translate-x-1/3 translate-y-1/3 "></div>

            <div className=" overflow-y-scroll relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-[90%] w-[90%] bg-[#ffffffc0] dark:bg-[#121212ac]  transition-colors duration-300 dark:text-white backdrop-blur-md rounded-lg shadow-xl " style={{ scrollbarWidth: "none" }}>
                <div className="container m-auto flex lg:flex-row flex-col items-center lg:items-stretch h-full">
                    <div className="w-2/3 lg:w-1/2 ">
                        <img src={image} alt="illustration for sand clock and man working on laptop" />
                    </div>
                    <div className="w-full p-5 lg:p-0 lg:w-1/2 flex flex-col items-center justify-center">
                        <div className='w-2/5 lg:w-1/5 scale-125 dark:hidden' ><img src={logo} alt="BrainMate" /></div>
                        <div className='w-1/5 scale-125 hidden dark:block' ><img src={darklogo} alt="BrainMate" /></div>
                        <h1 className='text-5xl font-bold text-center' >Reset Password</h1>
                        <h2 className='text-primary dark:text-base dark:opacity-80 dark:text-sm text-sm' >The everything app for work and workspaces</h2>
                        <form onSubmit={formik.handleSubmit} className="w-full max-w-sm space-y-3 my-5">

                            <div className="relative z-0 w-full group">
                                <input type="email" name="email" id="email" onChange={formik.handleChange} onBlur={formik.handleBlur} className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer" placeholder=" " />
                                <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                            </div>


                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full h-12 rounded-xl bg-gradient-to-r from-primary dark:from-darkTeal via-darkTeal to-darkTeal text-white text-xl font-bold hover:shadow-xl'
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
                                ) : "get resetting email"}
                            </button>
                        </form>

                        <div className='relative opacity-70 '>
                            <p className='before:content-[""] before:absolute before:h-[1px] before:w-2 before:bg-primary before:-left-2 before:top-1/2 before:-translate-x-full after:content-[""] after:absolute after:h-[1px] after:w-2 after:bg-primary after:-right-2 after:top-1/2 after:translate-x-full '>OR</p>
                        </div>

                        <div className='text-primary dark:text-gray-500 ' >Already have an account? <NavLink to={'/login'} className='text-darkTeal'>Login</NavLink></div>

                    </div>
                </div>
            </div>




        </div>
    </>
}
