import { BringToFront, Calendar, ChevronDown } from 'lucide-react';
import React from 'react';

export default function TasksTable() {
    // Data array with tasks
    const tasks = [
        {
            taskName: "UI Design",
            assignedTo: ["Layla Ahmed", "Omar Ali", "Nour Youssef", "Sara Hassan"],
            deadline: "25/11",
            priority: "High",
            state: "started",
            tags: "design, figma, UI",
        },
        {
            taskName: "API Development",
            assignedTo: ["Youssef Shafek", "Mariam Saleh", "Tarek Khaled"],
            deadline: "28/11",
            priority: "Normal",
            state: "holding",
            tags: "backend, node, API",
        },
        {
            taskName: "Database Optimization",
            assignedTo: ["Ahmed Saeed", "Salma Gamal", "Hany Rady"],
            deadline: "29/11",
            priority: "Critical",
            state: "finished",
            tags: "database, SQL, optimization",
        },
        {
            taskName: "Testing & QA",
            assignedTo: ["Rania Tarek", "Mohamed Adel"],
            deadline: "30/11",
            priority: "Low",
            state: "started",
            tags: "testing, QA, manual",
        },
        {
            taskName: "Deployment",
            assignedTo: ["Noha Khaled", "Ibrahim Nader"],
            deadline: "01/12",
            priority: "High",
            state: "NA",
            tags: "deployment, AWS, CI/CD",
        },
        {
            taskName: "Frontend Development",
            assignedTo: ["Ali Mahmoud", "Kareem Farid", "Maha Said"],
            deadline: "27/11",
            priority: "Normal",
            state: "started",
            tags: "frontend, react, JavaScript",
        },
        {
            taskName: "Performance Monitoring",
            assignedTo: ["Samir Hassan", "Yara Sherif"],
            deadline: "03/12",
            priority: "High",
            state: "holding",
            tags: "performance, monitoring, tools",
        },
        {
            taskName: "Customer Feedback Integration",
            assignedTo: ["Ola Farouk", "Ziad Omar", "Khaled Samy"],
            deadline: "02/12",
            priority: "Normal",
            state: "finished",
            tags: "feedback, integration, CRM",
        },
    ];


    return (
        <>
            <div className="relative overflow-x-scroll shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {["Task Name", "Assigned to", "Deadline", "Priority", "State", "Tags"].map((header, index) => (
                                <th key={index} scope="col" className="px-6 py-3">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                <th
                                    scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                    {task.taskName}
                                </th>
                                <td className="px-6 py-4">
                                    <div className="flex -space-x-2 max-w-[200px] overflow-hidden">
                                        {task.assignedTo.map((person, personIndex) => (
                                            <div
                                                key={personIndex}
                                                className={`w-6 h-6 flex items-center justify-center text-white rounded-full uppercase bg-highlight cursor-default`}
                                                title={person}
                                            >
                                                {person.split('')[0]}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2" color="red" />
                                        {task.deadline}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <BringToFront className="mr-2" color="#19f" />
                                        {task.priority}
                                    </div>
                                </td>
                                <td className="px-6 py-4 ">
                                    <div className="flex items-center space-x-2">
                                        <span className={`uppercase py-1 px-2 ${task.state ? `bg-${task.state}` : 'bg-gray-400'} drop-shadow text-white rounded-md w-20 text-center`}>
                                            {task.state}
                                        </span>
                                        <div className="relative">
                                            <button
                                                id={`dropdownHoverButton${rowIndex}`}
                                                data-dropdown-toggle={`dropdownHover${rowIndex}`}

                                                className="text-gray-600 font-medium rounded-lg text-sm p-1 inline-flex items-center "
                                                type="button"
                                            >
                                                <ChevronDown />
                                            </button>
                                            {/* states menu */}
                                            <div
                                                id={`dropdownHover${rowIndex}`}
                                                className="absolute z-20 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700"
                                            >
                                                <ul
                                                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                                    aria-labelledby={`dropdownHoverButton${rowIndex}`}
                                                >
                                                    {["finished", "started", "NA", "holding"].map((item, itemIndex) => (
                                                        <li key={itemIndex}>
                                                            <a
                                                                href="#"
                                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                            >
                                                                {item}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{task.tags}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
