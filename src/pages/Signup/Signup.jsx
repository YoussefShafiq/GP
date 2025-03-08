import React, { useContext, useState } from 'react'
import image from '../../assets/images/Work time-pana (1).svg'
import logo from '../../assets/images/brainmate.png'
import darklogo from '../../assets/images/brainmate dark.png'
import googleLogo from '../../assets/images/google.png'
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { UserData } from '../../context/UserContext'
import axios from 'axios'
import { useFormik } from 'formik'
import { object, ref, string } from 'yup'
import DarkmodeToggle from '../../components/DarkmodeToggle/DarkmodeToggle'
import toast from 'react-hot-toast'
import { ThreeDots } from 'react-loader-spinner'


export default function Signup() {
    const { setToken, setUsername } = useContext(UserData)
    const [error, setError] = useState('')
    const [loading, setloading] = useState(false)
    const { invitation_token } = useParams(); // Extract the ID from the URL


    let navigate = useNavigate()

    async function signup(values) {
        const checkbox = document.getElementById('link-checkbox');

        if (!checkbox.checked) {
            toast.error('Please agree to the terms and conditions before submitting', {
                duration: 5000,
                position: 'bottom-right'
            })
        } else {
            setloading(true)
            try {
                setError('')
                let { data } = await axios.post('https://brainmate.fly.dev/api/v1/auth/register', values)
                setloading(false)
                setToken(data.data.token)
                localStorage.setItem('userToken', data.data.token)
                setUsername(data.data.setUsername)
                navigate('/')
                toast.success('signed up successfully', {
                    duration: 2000,
                    position: 'bottom-right'
                })
            } catch (error) {
                setloading(false)
                setError(error.response.data.message)
                toast.error(error.response.data.message, {
                    duration: 5000,
                    position: 'bottom-right'
                })
            }
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
        password: string().min(9, 'password must be at least 6 length').required('password is required'),
        password_confirmation: string().oneOf([ref('password')], "repassword doesn't match password").required('repassword is required'),
        phone: string()
            .matches(/^[0-9]+$/, "Phone number can only contain numbers")
            .min(10, "Phone number must be at least 10 digits long")
            .max(15, "Phone number must be at most 15 digits long")
            .required("Phone number is required"),
        position: string()
            .required("Position is required"),
        level: string()
            .required("Job level is required"),
    });

    let formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            phone: '',
            position: '',
            level: '',
            invitation_token: invitation_token
        },
        validationSchema,
        onSubmit: signup
    });



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
                                <label htmlFor="password_confirmation" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Repassword</label>
                                {formik.errors.password_confirmation && formik.touched.password_confirmation &&
                                    <div className=" text-sm text-red-800 rounded-lg bg-transparent dark:text-red-600 " role="alert">
                                        {formik.errors.password_confirmation}
                                    </div>
                                }
                            </div>
                            <div className="relative z-0 w-full group">
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                    placeholder=" "
                                />
                                <label htmlFor="phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone</label>
                                {formik.errors.phone && formik.touched.phone &&
                                    <div className="text-sm text-red-800 rounded-lg bg-transparent dark:text-red-600" role="alert">
                                        {formik.errors.phone}
                                    </div>
                                }
                            </div>

                            <div className="relative z-0 w-full group">
                                <input
                                    type="text"
                                    name="position"
                                    id="position"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                    placeholder=" "
                                />
                                <label htmlFor="position" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Position</label>
                                {formik.errors.position && formik.touched.position &&
                                    <div className="text-sm text-red-800 rounded-lg bg-transparent dark:text-red-600" role="alert">
                                        {formik.errors.position}
                                    </div>
                                }
                            </div>

                            <div className="relative z-0 w-full group">
                                <select
                                    name="level"
                                    id="level"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-500 focus:outline-none focus:ring-0 focus:border-darkTeal peer"
                                >
                                    <option value="">Select Job Level</option>
                                    <option value="fresh">Fresh</option>
                                    <option value="junior">Junior</option>
                                    <option value="mid">Mid Level</option>
                                    <option value="semi senior">Semi Senior</option>
                                    <option value="senior">Senior Level</option>
                                    <option value="executive">Executive Level</option>
                                </select>
                                <label htmlFor="level" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-darkTeal peer-focus:dark:text-darkTeal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Job Level</label>
                                {formik.errors.level && formik.touched.level &&
                                    <div className="text-sm text-red-800 rounded-lg bg-transparent dark:text-red-600" role="alert">
                                        {formik.errors.level}
                                    </div>
                                }
                            </div>
                            <div className="flex items-center">
                                <input id="link-checkbox" type="checkbox" defaultValue className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
                                <label htmlFor="link-checkbox" className="ms-2 text-xs font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">terms and conditions</a>.</label>
                            </div>
                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full h-12 rounded-xl bg-gradient-to-r from-darkblue via-blueblack to-blueblack text-white text-xl font-bold hover:shadow-xl'
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
                                ) : "sign up"}
                            </button>
                        </form>

                        <div className='relative opacity-70 '>
                            <p className='before:content-[""] before:absolute before:h-[1px] before:w-2 before:bg-primary before:-left-2 before:top-1/2 before:-translate-x-full after:content-[""] after:absolute after:h-[1px] after:w-2 after:bg-primary after:-right-2 after:top-1/2 after:translate-x-full '>OR</p>
                        </div>
                        <div className='w-full max-w-sm my-5'>
                            <button onClick={() => { window.location.href = 'https://brainmate.fly.dev/api/v1/auth/google' }} className='w-full h-12 rounded-xl text-primary dark:text-gray-500 text-opacity-80 border border-solid border-primary border-opacity-40 flex justify-center items-center space-x-3 ' > <img className='h-2/3 me-2' src={googleLogo} alt="google login" /> signup with google</button>
                        </div>
                        <div className='text-primary pb-5 dark:text-gray-500 ' >Already have an account? <NavLink to={'/login'} className='text-darkTeal'>Login</NavLink></div>

                    </div>
                </div>
            </div>

        </div>
    </>
}
