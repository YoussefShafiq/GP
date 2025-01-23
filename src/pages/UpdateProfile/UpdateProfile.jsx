import React from 'react';
import img from '../../assets/images/workspaces.png';
import { useFormik } from 'formik';
import { object, string, date } from 'yup';
import { Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function UpdateProfile() {

    const navigate = useNavigate();

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
            .oneOf(['male', 'female', 'other'], "Invalid gender"),
        facebook: string()
            .url("Invalid Facebook URL"),
        instagram: string()
            .url("Invalid Instagram URL"),
        website: string()
            .url("Invalid website URL"),
        linkedin: string()
            .url("Invalid LinkedIn URL"),
        position: string()
            .required("Position is required")
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            bio: '',
            birthdate: '',
            email: '',
            phone: '',
            gender: '',
            facebook: '',
            instagram: '',
            website: '',
            linkedin: '',
            position: ''
        },
        validationSchema,
        onSubmit: (values) => {
            // Handle form submission
            console.log(values);
        }
    });

    const handlePhoneInput = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        formik.setFieldValue('phone', value);
    };

    return <>
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.3 }}
        >
            <div className="p-5 flex flex-col md:flex-row items-start gap-10">
                <form className='w-full flex md:flex-row flex-col items-start gap-10 ' onSubmit={formik.handleSubmit}>
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
                                className="w-full p-2 bg-base rounded-xl border border-gray-300"
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
                                className="w-full p-2 bg-base rounded-xl border border-gray-300"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {formik.errors.gender && formik.touched.gender &&
                                <div className="text-sm text-red-600 mt-1">
                                    {formik.errors.gender}
                                </div>
                            }
                        </div>
                        <div className="mb-4">
                            <label htmlFor="facebook" className="block text-sm font-medium mb-1">Facebook</label>
                            <input
                                type="url"
                                name="facebook"
                                id="facebook"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full p-2 bg-base rounded-xl border border-gray-300"
                            />
                            {formik.errors.facebook && formik.touched.facebook &&
                                <div className="text-sm text-red-600 mt-1">
                                    {formik.errors.facebook}
                                </div>
                            }
                        </div>
                        <div className="mb-4">
                            <label htmlFor="instagram" className="block text-sm font-medium mb-1">Instagram</label>
                            <input
                                type="url"
                                name="instagram"
                                id="instagram"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full p-2 bg-base rounded-xl border border-gray-300"
                            />
                            {formik.errors.instagram && formik.touched.instagram &&
                                <div className="text-sm text-red-600 mt-1">
                                    {formik.errors.instagram}
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
                                className="w-full p-2 bg-base rounded-xl border border-gray-300"
                            />
                            {formik.errors.linkedin && formik.touched.linkedin &&
                                <div className="text-sm text-red-600 mt-1">
                                    {formik.errors.linkedin}
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
                                className="w-full p-2 bg-base rounded-xl border border-gray-300"
                            />
                            {formik.errors.position && formik.touched.position &&
                                <div className="text-sm text-red-600 mt-1">
                                    {formik.errors.position}
                                </div>
                            }
                        </div>
                        <div className="flex justify-end gap-3">
                            {/* Cancel Button */}
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="mt-4 bg-white text-light outline-light outline outline-1 px-10 py-2 rounded-xl capitalize"
                            >
                                Cancel
                            </button>

                            {/* Update Button */}
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

    </>;
}