import React from 'react'
import img from '../../assets/images/workspaces.png'
import { BadgeCheck, Cake, Laptop, Mail, Phone } from 'lucide-react'
import { faEarthAfrica, faMars, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'

export default function Profile() {
    return <>
        <div className="flex flex-col gap-5 p-5 text-white">
            {/* profile card */}
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
                        <button className="capitalize bg-highlight p-2 rounded-xl drop-shadow-md w-full text-center">
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
    </>
}
