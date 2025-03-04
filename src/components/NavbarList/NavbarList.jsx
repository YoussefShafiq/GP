import { User2Icon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Logout from "../Logout/Logout";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { NavLink } from "react-router-dom";

export default function NavbarList() {
    const [dropped, setDropped] = useState(false);
    const dropdownRef = useRef(null);

    // Handle clicks outside the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropped(false);
            }
        };

        if (dropped) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropped]);

    return (
        <div className="relative">
            {/* Dropdown Toggle Button */}
            <button
                onClick={() => setDropped(!dropped)}
                className="text-white  hover:bg-blueblack font-medium rounded-full text-sm p-1 text-center inline-flex items-center transition-colors"
                type="button"
            >
                <User2Icon />
                <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>

            {/* Dropdown Menu with Animation */}
            <AnimatePresence>
                {dropped && (
                    <motion.div
                        ref={dropdownRef}
                        className="absolute top-full right-0 z-10 bg-white dark:bg-dark1 divide-y divide-gray-100 rounded-lg shadow p-3 "
                        initial={{ opacity: 0, y: -10 }} // Initial state (hidden and slightly above)
                        animate={{ opacity: 1, y: 0 }} // Animate to visible and in place
                        exit={{ opacity: 0, y: -10 }} // Exit animation (fade out and move up)
                        transition={{ duration: 0.2 }} // Animation duration
                    >
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 space-y-3">
                            <li >
                                <NavLink to={'profile'} onClick={() => setDropped(false)} ><User2Icon className="dark:text-white text-[#0b2534]" /></NavLink>
                            </li>
                            <li>
                                <Logout />
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}