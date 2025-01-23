import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BellOff, Coffee, Gamepad2, LocateIcon, MapPin, Phone, PhoneCall, Star, StarIcon, Wifi, Workflow, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion
import Slider from 'react-slick'; // Import React Slick
import 'slick-carousel/slick/slick.css'; // Import Slick CSS
import 'slick-carousel/slick/slick-theme.css'; // Import Slick Theme CSS

export default function Workspaces() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false); // State for filter dropdown visibility
    const [minPrice, setMinPrice] = useState(0); // State for minimum price
    const [maxPrice, setMaxPrice] = useState(500); // State for maximum price
    const [selectedStars, setSelectedStars] = useState(0); // State for selected star rating
    const [selectedWorkspace, setSelectedWorkspace] = useState(null); // State for selected workspace
    const token = localStorage.getItem('userToken');

    // Ref for the filter dropdown
    const filterRef = useRef(null);
    function getworkspaces() {
        return axios.get(`https://brainmate.fly.dev/api/v1/workspaces`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // React Query for fetching note details
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['getworkspaces'], // Include selectedNote in the queryKey
        queryFn: getworkspaces,
    });

    // Filter workspaces based on the search query, price, and star rating
    const filteredWorkspaces = data
        ? data?.data?.data?.workspaces.filter((workspace) => {
            const matchesSearch = workspace.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesPrice =
                workspace.price >= minPrice && workspace.price <= maxPrice;
            const matchesStars = workspace.rating >= selectedStars;
            return matchesSearch && matchesPrice && matchesStars;
        })
        : [];
    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Clear all filters
    const clearFilters = () => {
        setMinPrice(0);
        setMaxPrice(500);
        setSelectedStars(0);
    };

    // Close floating div when clicking outside
    useEffect(() => {
        const handleClickOutsideFloatingDiv = (event) => {
            const floatingDiv = document.getElementById('floating-div');
            if (floatingDiv && !floatingDiv.contains(event.target)) {
                setSelectedWorkspace(null); // Close the floating div
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutsideFloatingDiv);

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideFloatingDiv);
        };
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <>
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-center p-4">
                    <div className="text-xl">
                        <span className="font-light">Hi, where you </span>
                        <span className="font-bold">wanna work today?</span>
                    </div>
                    <div className="w-1/4">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                            </div>
                            <div className="block w-full p-4 ps-10 text-sm text-gray-900 border-0 rounded-lg bg-light bg-opacity-10 focus:ring-light focus:border-0 animate-pulse">
                                <div className="h-4 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Workspaces Skeleton */}
                <div className="flex flex-wrap gap-4 p-6">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="w-full md:w-[calc(33.333%-16px)] p-2">
                            {/* Image Skeleton */}
                            <div className="rounded-xl overflow-hidden flex items-center bg-gray-300 animate-pulse">
                                <div className="w-full h-40"></div>
                            </div>
                            {/* Workspace Name Skeleton */}
                            <div className="font-semiBold text capitalize my-3">
                                <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                            {/* Keys and Rate Skeleton */}
                            <div className="flex justify-between items-center">
                                <div className="opacity-50 text-sm capitalize">
                                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                                <div className="text-yellow-400 flex justify-center items-center gap-1 text-sm">
                                    <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
                                    <div className="h-4 w-8 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                            </div>
                            {/* Price Skeleton */}
                            <div className="text-light capitalize text-sm my-1">
                                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }




    // React Slick settings
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    return (
        <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center p-4 relative">
                <div className="text-xl">
                    <span className="font-light">Hi, where you </span>
                    <span className="font-bold">wanna work today?</span>
                </div>
                <div className="flex items-center gap-4">
                    {/* Search Bar */}
                    <form className="max-w-md mx-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="search"
                                className="block w-full p-4 ps-10 text-sm text-gray-900 border-0 rounded-lg bg-light bg-opacity-10 focus:ring-light focus:border-0"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                required
                            />
                        </div>
                    </form>

                    {/* Filter Button */}
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Filter
                        </button>

                        {/* Filter Dropdown with Animation */}
                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div
                                    className="absolute z-10 right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Price Range Filter */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">
                                            Price Range
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                                className="w-1/2 p-2 border border-gray-300 rounded-lg"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                                className="w-1/2 p-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* Star Rating Filter */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">
                                            Star Rating
                                        </label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setSelectedStars(star)}
                                                    className={`p-2 rounded-lg ${selectedStars >= star
                                                        ? 'bg-yellow-400'
                                                        : 'bg-gray-200'
                                                        } hover:bg-yellow-400 transition-colors`}
                                                >
                                                    <StarIcon />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Clear Filters Button */}
                                    <button
                                        onClick={clearFilters}
                                        className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Workspaces */}
            <div className="flex flex-wrap gap-4 p-6">
                {filteredWorkspaces.map((workspace) => (
                    <div
                        key={workspace.id}
                        className="w-full md:w-[calc(33.333%-16px)] p-2 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedWorkspace(workspace)}
                    >
                        {/* Image Container */}
                        <div className="rounded-xl overflow-hidden flex items-center">
                            <img src={'https://brainmate.fly.dev' + workspace.images[0]} alt={workspace.name + ' image'} className="w-full" />
                        </div>
                        {/* Workspace Name */}
                        <div className="font-semiBold text capitalize my-3">
                            {workspace.name}
                        </div>
                        {/* Keys and Rate */}
                        <div className="flex justify-between items-center">
                            <div className="opacity-50 text-sm capitalize">
                                {workspace.amenities}
                            </div>
                            <div className="text-yellow-400 flex justify-center items-center gap-1 text-sm">
                                <Star fill="#e3a008" size={20} />
                                <p>{workspace.rating}</p>
                            </div>
                        </div>
                        {/* Price */}
                        <div className="text-light capitalize text-sm my-1">
                            {workspace.price} LE
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Div for Selected Workspace */}
            <AnimatePresence>
                {selectedWorkspace && (
                    <motion.div
                        id="floating-div"
                        className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-15 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedWorkspace(null)}
                    >
                        <motion.div
                            className="bg-white rounded-lg shadow-lg border p-6 w-11/12 max-w-2xl relative max-h-[95vh] overflow-y-auto "
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedWorkspace(null)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>

                            {/* Workspace Details */}
                            <div className="flex flex-col gap-6">
                                <div className="text-center font-semibold text-lg">Space details</div>
                                {/* Image Slider */}
                                <div className="w-full rounded-lg overflow-hidden">
                                    <Slider {...sliderSettings}>
                                        {selectedWorkspace.images.map((image, index) => (
                                            <div key={index}>
                                                <img
                                                    src={'https://brainmate.fly.dev' + image}
                                                    alt={`workspace ${index + 1}`}
                                                    className="w-full h-64 object-cover"
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                </div>

                                {/* Details */}
                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-bold text-darkblue">
                                            {selectedWorkspace.name}
                                        </h2>
                                        <div className='flex items-center gap-1' > <a className='text-highlight' href={selectedWorkspace.map_url}> <MapPin /> </a> {selectedWorkspace.location}</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="opacity-50 text-sm capitalize">
                                            {selectedWorkspace.amenities}
                                        </div>
                                        <div className="text-yellow-400 flex justify-center items-center gap-1 text-sm">
                                            <Star fill="#e3a008" size={20} />
                                            <p>{selectedWorkspace.rating}</p>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="text-light capitalize text-sm my-1">
                                        {selectedWorkspace.price} LE
                                    </div>
                                    <div className="flex items-center gap-3 text-highlight">
                                        <Phone size={20} />
                                        <p>{selectedWorkspace.phone}</p>
                                    </div>


                                    <h2 className="text-2xl font-bold mb-2 mt-5 text-darkblue">
                                        Workspace Description
                                    </h2>
                                    <p>{selectedWorkspace.description}</p>

                                    <h2 className="text-2xl font-bold mb-2 mt-5 text-darkblue">
                                        Facilities
                                    </h2>
                                    <div className="flex flex-wrap gap-5 text-sm">
                                        {selectedWorkspace.wifi && (
                                            <div className="flex items-center gap-2">
                                                <Wifi color='#f25287 ' /> <p>Wi-Fi</p>
                                            </div>
                                        )}
                                        {selectedWorkspace.coffee && (
                                            <div className="flex items-center gap-2">
                                                <Coffee color='#f25287 ' /> <p>Coffee</p>
                                            </div>
                                        )}
                                        {selectedWorkspace.meetingroom && (
                                            <div className="flex items-center gap-2">
                                                <Workflow color='#f25287 ' /> <p>Meeting Room</p>
                                            </div>
                                        )}
                                        {selectedWorkspace.silentroom && (
                                            <div className="flex items-center gap-2">
                                                <BellOff color='#f25287 ' /> <p>Silent Room</p>
                                            </div>
                                        )}
                                        {selectedWorkspace.amusement && (
                                            <div className="flex items-center gap-2">
                                                <Gamepad2 color='#f25287 ' /> <p>Amusement</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}