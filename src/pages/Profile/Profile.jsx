import React, { useState } from 'react';
import img from '../../assets/images/workspaces.png';
import { BadgeCheck, Cake, Laptop, Mail, Phone } from 'lucide-react';
import { faEarthAfrica, faMars, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion for animations
import { useFormik } from 'formik'; // Import Formik
import * as Yup from 'yup'; // Import Yup for validation


export default function Profile() {
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility

    // Function to open the popup
    const openPopup = () => {
        setIsPopupOpen(true);
    };

    // Function to close the popup
    const closePopup = () => {
        setIsPopupOpen(false);
        formik.resetForm(); // Reset the form when closing the popup
    };

    // Formik setup for the Change Password form
    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string()
                .required('Old Password is required'),
            newPassword: Yup.string()
                .min(8, 'New Password must be at least 8 characters long')
                .required('New Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                .required('Confirm Password is required'),
        }),
        onSubmit: (values) => {
            // Handle form submission
            console.log('Password changed!', values);
            closePopup(); // Close the popup after submission
        },
    });



    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.3 }}
            >

                <div className="flex flex-col gap-5 p-5 text-white">
                    {/* Profile Card */}
                    <div className="flex lg:flex-row flex-col gap-3">
                        <div className="flex md:flex-row flex-col justify-between gap-10 lg:w-[calc(90%-12px)] bg-darkblue rounded-3xl p-5 shadow-xl text-white">
                            <div className="flex md:flex-row flex-col md:gap-10 gap-2">
                                <div className="md:w-1/3 flex justify-center items-center md:p-3">
                                    <img src={img} alt="profile photo" className="w-full aspect-square object-cover rounded-full" />
                                </div>
                                <div className="py-5 flex flex-col gap-4 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="capitalize font-semibold text-2xl">
                                            Youssef Mohammed Shafek{" "}
                                            <BadgeCheck
                                                size={25}
                                                className="text-darkblue inline top-0 relative -translate-y-1/4"
                                                fill="white"
                                            />
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Laptop size={30} className="text-white" />
                                        <h2 className="capitalize">Software Engineer</h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail size={30} className="text-darkblue" fill="white" />
                                        <h2 className="break-words max-w-[80%]">youssefmsa616@gmail.com</h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={30} className="text-darkblue" fill="white" />
                                        <h2 className="break-words max-w-[80%]">01145528803</h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Cake size={30} className="text-white" fill="#133d57" />
                                        <h2 className="capitalize">9/12/2003</h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faMars} className="text-xl w-7" />
                                        <h2 className="capitalize">male</h2>
                                    </div>
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
                                    className="capitalize bg-highlight p-2 rounded-xl drop-shadow-md w-full text-center"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                        <div className="flex lg:flex-col flex-row gap-6 items-center justify-center text-3xl lg:w-[calc(10%-12px)] p-3 lg:p-0 bg-darkblue rounded-3xl shadow-xl flex-wrap">
                            <a href='https://www.facebook.com' target='_blank'>
                                <FontAwesomeIcon icon={faFacebook} className='drop-shadow-lg' />
                            </a>
                            <a href='https://www.facebook.com' target='_blank'>
                                <FontAwesomeIcon icon={faInstagram} className='drop-shadow-lg' />
                            </a>
                            <a href='https://www.facebook.com' target='_blank'>
                                <FontAwesomeIcon icon={faXTwitter} className='drop-shadow-lg' />
                            </a>
                            <a href='https://www.facebook.com' target='_blank'>
                                <FontAwesomeIcon icon={faLinkedin} className='drop-shadow-lg' />
                            </a>
                            <a href='https://www.facebook.com' target='_blank'>
                                <FontAwesomeIcon icon={faEarthAfrica} className='drop-shadow-lg' />
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col p-5 bg-base text-black rounded-3xl shadow-xl gap-2">
                        <h2 className='font-bold text-2xl capitalize'>bio</h2>
                        <p className='text-gray-800'>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium vel ipsam maiores? Labore, eius dolorem perferendis repudiandae neque saepe eaque nisi! Alias ullam natus adipisci quidem nobis aliquid sapiente suscipit minima corrupti laboriosam inventore illum doloribus aspernatur quis rem amet asperiores necessitatibus error tempore vero modi magnam quisquam, expedita aliquam!
                        </p>
                    </div>
                </div>

                {/* Change Password Popup */}
                <AnimatePresence>
                    {isPopupOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 1 }} // Initial animation state
                            animate={{ opacity: 1, scale: 1 }} // Animate to this state
                            exit={{ opacity: 0, scale: 1 }} // Animate when exiting
                            transition={{ duration: 0.2 }} // Animation duration
                            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-15 backdrop-blur-sm z-50"
                            onClick={closePopup} // Close popup when clicking outside
                        >
                            <motion.div
                                initial={{ y: -50, opacity: 0 }} // Initial animation state
                                animate={{ y: 0, opacity: 1 }} // Animate to this state
                                exit={{ y: -50, opacity: 0 }} // Animate when exiting
                                transition={{ duration: 0.2 }} // Animation duration
                                className="bg-white p-6 rounded-xl shadow-lg w-96"
                                onClick={(e) => e.stopPropagation()} // Prevent clicks inside the popup from closing it
                            >
                                <h2 className="text-xl font-bold mb-4">Change Password</h2>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="oldPassword" className="block text-sm font-medium mb-1">
                                            Old Password
                                        </label>
                                        <input
                                            type="password"
                                            id="oldPassword"
                                            name="oldPassword"
                                            value={formik.values.oldPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                        />
                                        {formik.touched.oldPassword && formik.errors.oldPassword && (
                                            <div className="text-sm text-red-600 mt-1">
                                                {formik.errors.oldPassword}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={formik.values.newPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                        />
                                        {formik.touched.newPassword && formik.errors.newPassword && (
                                            <div className="text-sm text-red-600 mt-1">
                                                {formik.errors.newPassword}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                        />
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                            <div className="text-sm text-red-600 mt-1">
                                                {formik.errors.confirmPassword}
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