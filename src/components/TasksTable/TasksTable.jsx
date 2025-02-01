import { BringToFront, Calendar, ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export default function TasksTable({ tasks = [] }) {
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);

    const toggleDropdown = (id) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative md:overflow-visible overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {["Task Name", "Assigned to", "Deadline", "Priority", "State", "Tags"].map((header, index) => (
                            <th key={index} scope="col" className="px-6 py-3 whitespace-nowrap">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="bg-white border-b dark:bg-white dark:bg-opacity-5 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            {/* Task Name Column */}
                            <th
                                scope="row"
                                className="min-w-40 flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                {task.taskName}
                            </th>
                            {/* Assigned To Column */}
                            <td className="px-6 py-4">
                                <div className="flex -space-x-2 max-w-[200px] overflow-hidden px-2">
                                    {task.assignedTo.slice(0, 5).map((person, personIndex) => (
                                        <div
                                            key={personIndex}
                                            className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                            style={{ backgroundColor: person.color }}
                                            title={person.name}
                                        >
                                            {person.name.split('')[0]}
                                        </div>
                                    ))}
                                    {task.assignedTo.length > 5 && (
                                        <div
                                            className="w-6 h-6 flex items-center justify-center text-white bg-gray-400 drop-shadow-xl rounded-full uppercase cursor-default"
                                            title={`+${task.assignedTo.length - 5} more`}
                                        >
                                            +{task.assignedTo.length - 5}
                                        </div>
                                    )}
                                </div>
                            </td>
                            {/* Deadline Column */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <Calendar className="mr-2" color="red" />
                                    {task.deadline}
                                </div>
                            </td>
                            {/* Priority Column */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <BringToFront className="mr-2" color="#19f" />
                                    {task.priority}
                                </div>
                            </td>
                            {/* State Column */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                    <span className={`py-1 px-2 ${task.state ? `bg-${task.state}` : 'bg-gray-400'} drop-shadow text-white rounded-lg w-fit text-center`}>
                                        {task.state.replace('_', ' ')}
                                    </span>
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            id={`button${rowIndex}`}
                                            onClick={() => toggleDropdown(rowIndex)}
                                            className="text-gray-600 font-medium rounded-lg text-sm p-1 inline-flex items-center"
                                            type="button"
                                        >
                                            <ChevronDown className={`${openDropdownId === rowIndex ? 'rotate-180 text-light' : ''} duration-[400ms]`} />
                                        </button>
                                        {/* Dropdown Menu */}
                                        <div
                                            id={`dropdown${rowIndex}`}
                                            className={`absolute z-50 left-7 bg-light divide-y divide-gray-100 rounded-3xl shadow-lg dark:bg-gray-700 transition-all duration-300 ease-in-out ${openDropdownId === rowIndex
                                                ? 'opacity-100 translate-y-0'
                                                : 'opacity-0 translate-y-2 pointer-events-none'
                                                } ${rowIndex >= tasks.length - 0 && rowIndex < tasks.length ? 'bottom-[70%] rounded-bl-none' : 'top-[70%] rounded-tl-none'}`}
                                        >
                                            <ul
                                                className="text-sm text-white dark:text-gray-200 flex flex-col"
                                                aria-labelledby={`dropdownHoverButton${rowIndex}`}
                                            >
                                                {['pending', 'in_progress', 'completed', 'cancelled', 'on_hold', 'in_review'].map((item, itemIndex) => (
                                                    <button key={itemIndex}>
                                                        <div
                                                            className={`block px-7 py-2 hover:bg-white hover:bg-opacity-20 dark:hover:bg-gray-600 dark:hover:text-white ${itemIndex < 5 ? 'border-b-[1px]' : ''} `}
                                                        >
                                                            {item.replace('_', ' ')}
                                                        </div>
                                                    </button>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            {/* Tags Column */}
                            <td className="px-6 py-4 max-w-52 overflow-hidden whitespace-nowrap">{task.tags}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}