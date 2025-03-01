import React, { useEffect, useState } from 'react';
import img from '../../assets/images/userImage.jpg';
import { BadgeCheck, Cake, Copy, IdCard, Laptop, Mail, Phone } from 'lucide-react';
import { faEarthAfrica, faMars, faVenus, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGithub, faInstagram, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';


export default function Profile() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const token = localStorage.getItem('userToken')

    // Function to open the popup
    const openPopup = () => {
        setIsPopupOpen(true);
    };

    // Function to close the popup
    const closePopup = () => {
        setIsPopupOpen(false);
        formik.resetForm();
    };

    async function changepassword(values) {
        try {
            let response = await axios.put('https://brainmate.fly.dev/api/v1/profile/password', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            toast.success('password changed successfully', {
                position: 'bottom-right',
                duration: 3000
            })
            formik.resetForm()
            setIsPopupOpen(false)

        } catch (error) {
            console.log(error);

            toast.error(error.response.data.message.new_password ? error.response.data.message.new_password[0] : (error.response.data.message.current_password ? error.response.data.message.current_password[0] : 'unexpected error, please try again'), {
                position: 'bottom-right',
                duration: 3000
            })
        }
    }

    // Formik setup for the Change Password form
    const formik = useFormik({
        initialValues: {
            current_password: '',
            new_password: '',
            new_password_confirmation: '',
        },
        validationSchema: Yup.object({
            current_password: Yup.string()
                .required('Old Password is required'),
            new_password: Yup.string()
                .min(9, 'New Password must be at least 9 characters long')
                .required('New Password is required'),
            new_password_confirmation: Yup.string()
                .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
                .required('Confirm Password is required'),
        }),
        onSubmit: changepassword
    });

    function getProfileData() {
        return axios.get('https://brainmate.fly.dev/api/v1/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    }

    let { data, isLoading, isError } = useQuery({
        queryKey: 'ProfileData',
        queryFn: getProfileData
    })

    useEffect(() => {
        console.log(data);
    }, [data])




    return (
        <>

            {/* <motion.div
                initial={{ opacity: 0, y: -100 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.3 }}
            >

            </motion.div > */}

            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.3 }}
            >

                <div className="flex flex-col gap-5 p-5 text-white">
                    {/* Profile Card */}
                    <div className="flex lg:flex-row flex-col gap-3">
                        <div className="flex md:flex-row flex-col justify-between gap-10 lg:w-[calc(90%-12px)] bg-darkblue rounded-3xl p-5 shadow-xl text-white">
                            <div className="flex md:flex-row flex-col md:gap-10 gap-2">
                                <div className="w-2/3 m-auto md:w-1/3 flex justify-center items-center md:p-3">
                                    <img src={img} alt="profile photo" className="w-full aspect-square object-cover rounded-full" />
                                </div>
                                <div className="py-5 flex flex-col gap-4 flex-1">
                                    <div className="flex items-center gap-2">
                                        {isLoading ? <div className="w-full h-5 rounded bg-white bg-opacity-30 animate-pulse"></div> : <h2 className="capitalize font-semibold text-2xl">
                                            {data?.data?.data.user.name}{" "}
                                            <BadgeCheck
                                                size={25}
                                                className="text-darkblue inline top-0 relative -translate-y-1/4"
                                                fill="white"
                                            />
                                            <div
                                                className="p-2  rounded-lg cursor-pointer "
                                                onClick={() => {
                                                    navigator.clipboard.writeText('bearer ' + localStorage.getItem('userToken'));
                                                    toast.success('added to clipboard', {
                                                        duration: 2000,
                                                        position: 'bottom-right',
                                                    });
                                                }}
                                            >
                                                <Copy size={18} className="text-gray-50" />
                                            </div>
                                        </h2>}
                                        {/* {isLoading ? <div className="w-2/3 h-5 rounded bg-white bg-opacity-30 animate-pulse"></div> :} */}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <IdCard size={30} className="text-white" />
                                        {isLoading ? <div className="w-1/2 h-5 rounded bg-white bg-opacity-30 animate-pulse"></div> : <h2 className="capitalize">{data?.data?.data.user.id}</h2>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Laptop size={30} className="text-white" />
                                        {isLoading ? <div className="w-1/2 h-5 rounded bg-white bg-opacity-30 animate-pulse"></div> : <h2 className="capitalize">{data?.data?.data.user.level} {data?.data?.data.user.position}</h2>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail size={30} className="text-darkblue" fill="white" />
                                        {isLoading ? <div className="w-2/3 h-5 rounded bg-white bg-opacity-30 animate-pulse"></div> : <h2 className="break-words max-w-[80%]">{data?.data?.data.user.email}</h2>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={30} className="text-darkblue" fill="white" />
                                        {isLoading ? <div className="w-1/2 h-5 rounded bg-white bg-opacity-30 animate-pulse"></div> : <h2 className="break-words max-w-[80%]">{data?.data?.data.user.phone}</h2>}

                                    </div>
                                    {data?.data?.data.user.birthdate ? <div className="flex items-center gap-2">
                                        <Cake size={30} className="text-white" fill="#133d57" />
                                        {isLoading ? <div className="w-1/3 h-5 rounded bg-white bg-opacity-30 animate-pulse"></div> : <h2 className="capitalize">{data?.data?.data.user.birthdate?.substring(0, 10)}</h2>}
                                    </div> : ''}
                                    {data?.data.data.user.gender ? <div className="flex items-center gap-2">
                                        {isLoading ? (
                                            <div className="w-1/5 h-5 rounded bg-white bg-opacity-30 animate-pulse"></div>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon
                                                    icon={data?.data.data.user.gender === "Female" ? faVenus : faMars}
                                                    className="text-xl w-7"
                                                />
                                                <h2 className="capitalize">{data?.data.data.user.gender}</h2>
                                            </>
                                        )}
                                    </div> : ''}
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-end gap-3 right-0">
                                <Link
                                    to={"updateprofile"}
                                    className="capitalize bg-light p-2 rounded-xl drop-shadow-md w-full text-center"
                                >
                                    Update Profile
                                </Link>
                                <button
                                    onClick={openPopup}
                                    className="capitalize bg-highlight p-2 rounded-xl drop-shadow-md w-full md:w-max text-center"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                        <div className="flex lg:flex-col flex-row gap-6 items-center justify-center text-3xl lg:w-[calc(10%-12px)] p-3 lg:p-0 bg-darkblue rounded-3xl shadow-xl flex-wrap">
                            <a href={data?.data?.data.user.social.facebook} target='_blank'>
                                <FontAwesomeIcon icon={faFacebook} className={` ${!data?.data?.data.user.social.facebook && 'opacity-20'} drop-shadow-lg`} />
                            </a>
                            <a href={data?.data?.data.user.social.github} target='_blank'>
                                <FontAwesomeIcon icon={faGithub} className={` ${!data?.data?.data.user.social.github && 'opacity-20'} drop-shadow-lg`} />
                            </a>
                            <a href={data?.data?.data.user.social.linkedin} target='_blank'>
                                <FontAwesomeIcon icon={faLinkedin} className={` ${!data?.data?.data.user.social.linkedin && 'opacity-20'} drop-shadow-lg`} />
                            </a>
                            <a href={data?.data?.data.user.social.website} target='_blank'>
                                <FontAwesomeIcon icon={faEarthAfrica} className={` ${!data?.data?.data.user.social.website && 'opacity-20'} drop-shadow-lg`} />
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col p-5 bg-base text-black rounded-3xl shadow-xl gap-2">
                        <h2 className='font-bold text-2xl capitalize'>skills</h2>

                        <div className="flex flex-wrap gap-3">
                            {data?.data?.data?.user?.skills?.map((skill) => (
                                <div className='bg-darkblue bg-opacity-5 shadow-inner rounded-3xl py-1 px-3' >{skill}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col p-5 bg-base text-black rounded-3xl shadow-xl gap-2">
                        <h2 className='font-bold text-2xl capitalize'>bio</h2>
                        <p className='text-gray-800'>{data?.data?.data.user.bio}</p>
                    </div>
                </div>

                {/* Change Password Popup */}
                <AnimatePresence>
                    {isPopupOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-15 backdrop-blur-sm z-50"
                            onClick={closePopup}
                        >
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white p-6 rounded-xl shadow-lg w-96"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="text-xl font-bold mb-4">Change Password</h2>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="current_password" className="block text-sm font-medium mb-1">
                                            Old Password
                                        </label>
                                        <input
                                            type="password"
                                            id="current_password"
                                            name="current_password"
                                            value={formik.values.current_password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                        />
                                        {formik.touched.current_password && formik.errors.current_password && (
                                            <div className="text-sm text-red-600 mt-1">
                                                {formik.errors.current_password}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="new_password" className="block text-sm font-medium mb-1">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="new_password"
                                            name="new_password"
                                            value={formik.values.new_password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                        />
                                        {formik.touched.new_password && formik.errors.new_password && (
                                            <div className="text-sm text-red-600 mt-1">
                                                {formik.errors.new_password}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="new_password_confirmation" className="block text-sm font-medium mb-1">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="new_password_confirmation"
                                            name="new_password_confirmation"
                                            value={formik.values.new_password_confirmation}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                        />
                                        {formik.touched.new_password_confirmation && formik.errors.new_password_confirmation && (
                                            <div className="text-sm text-red-600 mt-1">
                                                {formik.errors.new_password_confirmation}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={closePopup}
                                            className="bg-gray-300 text-black px-4 py-2 rounded-xl"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-4 py-2 rounded-xl"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

        </>
    );
}