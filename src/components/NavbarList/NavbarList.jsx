import { User2Icon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Logout from "../Logout/Logout";

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
                className="text-white dark:text-darkblue hover:bg-blueblack font-medium rounded-full text-sm p-1 text-center inline-flex items-center dark:bg-white transition-colors"
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

            {/* Dropdown Menu */}
            {dropped && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full right-0 z-10 bg-white divide-y divide-gray-100 rounded-full shadow p-3 dark:bg-white"
                >
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 space-y-3">
                        <li>
                            <User2Icon color="#0b2534" />
                        </li>
                        <li>
                            <Logout />
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}