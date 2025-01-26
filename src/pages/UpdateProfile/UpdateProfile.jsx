import React, { useEffect } from 'react';
import img from '../../assets/images/avatar.jpg';
import { useFormik } from 'formik';
import { object, string, date, array } from 'yup';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Chips } from 'primereact/chips'; // Import PrimeReact Chips

export default function UpdateProfile() {
    const navigate = useNavigate();
    const token = localStorage.getItem('userToken'); // Assuming you store the token in localStorage

    const handleCancel = () => {
        navigate('/profile');
    };

    const validationSchema = object({
        name: string()
            .matches(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces")
            .trim()
            .min(3, "Full name must be at least 3 characters long")
            .required("Full name is required"),
        bio: string()
            .max(500, "Bio must be at most 500 characters long"),
        birthdate: date(),
        email: string()
            .email('Invalid email')
            .required('Email is required'),
        phone: string()
            .matches(/^[0-9]+$/, "Phone number can only contain numbers")
            .min(10, "Phone number must be at least 10 digits long")
            .max(15, "Phone number must be at most 15 digits long")
            .required("Phone number is required"),
        gender: string()
            .oneOf(['Male', 'Female'], "Invalid gender"),
        facebook: string()
            .url("Invalid Facebook URL"),
        github: string()
            .url("Invalid github URL"),
        website: string()
            .url("Invalid website URL"),
        linkedin: string()
            .url("Invalid LinkedIn URL"),
        position: string()
            .required("Position is required"),
        level: string()
            .required("Job level is required"),
        skills: array()
            .of(string().min(1, "Skill must be at least 1 character long"))
            .min(1, "At least one skill is required")
    });

    function getProfileData() {
        return axios.get('https://brainmate.fly.dev/api/v1/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    }

    let { data, isLoading, isError } = useQuery({
        queryKey: 'ProfileData',
        queryFn: getProfileData
    });

    useEffect(() => {
        console.log(data);
    }, [data]);

    async function updateProfile(values) {
        try {
            let response = await axios.put('https://brainmate.fly.dev/api/v1/profile', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            toast.success('Updated successfully', {
                position: 'bottom-right',
                duration: 3000
            });
            formik.resetForm();
            navigate('/profile');
        } catch (error) {
            toast.error('Unexpected error, please try again', {
                position: 'bottom-right',
                duration: 3000
            });
        }
    }

    const formik = useFormik({
        initialValues: {
            name: data?.data?.data.user.name || '',
            email: data?.data?.data.user.email || '',
            phone: data?.data?.data.user.phone || '',
            gender: data?.data?.data.user.gender || '',
            birthdate: data?.data?.data.user.birthdate ? data.data.data.user.birthdate.split('T')[0] : '',
            bio: data?.data?.data.user.bio || '',
            position: data?.data?.data.user.position || '',
            facebook: data?.data?.data.user.social.facebook || '',
            github: data?.data?.data.user.social.github || '',
            linkedin: data?.data?.data.user.social.linkedin || '',
            website: data?.data?.data.user.social.website || '',
            level: data?.data?.data.user.level || '',
            skills: data?.data?.data.user.skills || []
        },
        validationSchema,
        onSubmit: updateProfile,
        enableReinitialize: true,
    });

    const handlePhoneInput = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        formik.setFieldValue('phone', value);
    };

    const handleSkillsChange = (e) => {
        formik.setFieldValue('skills', e.value); // Update skills array when chips change
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className='pt-5 px-5 text-xl capitalize font-bold'>update profile</h2>
                <div className="p-5 flex flex-col md:flex-row items-start gap-10">
                    <form className='w-full flex md:flex-row flex-col items-start gap-10' onSubmit={formik.handleSubmit}>
                        <div className="md:w-1/4 flex justify-center items-center md:p-3">
                            <img src={img} alt="profile photo" className="w-full aspect-square object-cover rounded-full" />
                        </div>
                        <div className="lg:flex-1 w-full">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                />
                                {formik.errors.name && formik.touched.name &&
                                    <div className="text-sm text-red-600 mt-1">
                                        {formik.errors.name}
                                    </div>
                                }
                            </div>
                            <div className="mb-4">
                                <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    id="bio"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.bio}
                                    className="w-full p-2 bg-base rounded-xl border border-gray-300 min-h-52"
                                />
                                {formik.errors.bio && formik.touched.bio &&
                                    <div className="text-sm text-red-600 mt-1">
                                        {formik.errors.bio}
                                    </div>
                                }
                            </div>
                            <div className="mb-4">
                                <label htmlFor="birthdate" className="block text-sm font-medium mb-1">Birthdate</label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    id="birthdate"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.birthdate}
                                    className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                />
                                {formik.errors.birthdate && formik.touched.birthdate &&
                                    <div className="text-sm text-red-600 mt-1">
                                        {formik.errors.birthdate}
                                    </div>
                                }
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                />
                                {formik.errors.email && formik.touched.email &&
                                    <div className="text-sm text-red-600 mt-1">
                                        {formik.errors.email}
                                    </div>
                                }
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    value={formik.values.phone}
                                    onChange={handlePhoneInput}
                                    onBlur={formik.handleBlur}
                                    className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                    pattern="[0-9]*"
                                />
                                {formik.errors.phone && formik.touched.phone &&
                                    <div className="text-sm text-red-600 mt-1">
                                        {formik.errors.phone}
                                    </div>
                                }
                            </div>
                            <div className="mb-4">
                                <label htmlFor="gender" className="block text-sm font-medium mb-1">Gender</label>
                                <select
                                    name="gender"
                                    id="gender"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.gender}
                                    className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                {formik.errors.gender && formik.touched.gender &&
                                    <div className="text-sm text-red-600 mt-1">
                                        {formik.errors.gender}
                                    </div>
                                }
                            </div>
                            <div className="mb-4">
                                <label htmlFor="position" className="block text-sm font-medium mb-1">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    id="position"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.position}
                                    className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                />
                                {formik.errors.position && formik.touched.position &&
                                    <div className="text-sm text-red-600 mt-1">
                                        {formik.errors.position}
                                    </div>
                                }
                            </div>
                            <div className="mb-4">
                                <label htmlFor="level" className="block text-sm font-medium mb-1">Job Level</label>
                                <select
                                    name="level"
                                    id="level"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.level}
                                    className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                >
                                    <option value="">Select Job Level</option>
                                    <option value="fresh">fresh</option>
                                    <option value="junior">junior</option>
                                    <option value="mid">Mid Level</option>
                                    <option value="semi senior">semi senior</option>
                                    <option value="senior">Senior Level</option>
                                    <option value="executive">Executive Level</option>
                                </select>
                                {formik.errors.level && formik.touched.level &&
                                    <div className="text-sm text-red-600 mt-1">
                                        {formik.errors.level}
                                    </div>
                                }
                            </div>
                            <div className="mb-4">
                                <label htmlFor="skills" className="block text-sm font-medium mb-1">Skills</label>
                                <Chips
                                    id="skills"
                                    name="skills"
                                    value={formik.values.skills}
                                    onChange={handleSkillsChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter skills"
                                    className="w-full p-chips"
                                    itemTemplate={(skill) => (
                                        <div className="bg-gray-200 rounded-full px-3 py-1 text-sm">
                                            {skill}
                                        </div>
                                    )}
                                />
                                {formik.errors.skills && formik.touched.skills && (
                                    <div className="text-sm text-red-600 mt-1">
                                        {formik.errors.skills}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="facebook" className="block text-sm font-medium mb-1">Facebook</label>
                                <input
                                    type="url"
                                    name="facebook"
                                    id="facebook"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.facebook}
                                    className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                />
                                {formik.errors.facebook && formik.touched.facebook &&
                                    <div className="text-sm text-red-600 mt-1">
                                        {formik.errors.facebook}
                                    </div>
                                }
                            </div>
                            <div className="mb-4">
                                <label htmlFor="github" className="block text-sm font-medium mb-1">github</label>
                                <input
                                    type="url"
                                    name="github"
                                    id="github"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.github}
                                    className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                />
                                {formik.errors.github && formik.touched.github &&
                                    <div className="text-sm text-red-600 mt-1">
                                        {formik.errors.github}
                                    </div>
                                }
                            </div>
                            <div className="mb-4">
                                <label htmlFor="website" className="block text-sm font-medium mb-1">Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    id="website"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.website}
                                    className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                />
                                {formik.errors.website && formik.touched.website &&
                                    <div className="text-sm text-red-600 mt-1">
                                        {formik.errors.website}
                                    </div>
                                }
                            </div>
                            <div className="mb-4">
                                <label htmlFor="linkedin" className="block text-sm font-medium mb-1">LinkedIn</label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    id="linkedin"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.linkedin}
                                    className="w-full p-2 bg-base rounded-xl border border-gray-300"
                                />
                                {formik.errors.linkedin && formik.touched.linkedin &&
                                    <div className="text-sm text-red-600 mt-1">
                                        {formik.errors.linkedin}
                                    </div>
                                }
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="mt-4 bg-white text-light outline-light outline outline-1 px-10 py-2 rounded-xl capitalize"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="mt-4 bg-light text-white px-10 py-2 rounded-xl capitalize"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>
        </>
    );
}