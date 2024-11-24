import { BringToFront, Calendar, ChevronDown } from 'lucide-react';
import React from 'react';

export default function TasksTable() {
    // Data array with tasks
    const tasks = [
        {
            taskName: "UI Design",
            assignedTo: [
                { name: 'Layla Ahmed', color: '#25D366' }, // WhatsApp green
                { name: 'Omar Ali', color: '#128C7E' },   // WhatsApp dark teal
                { name: 'Nour Youssef', color: '#075E54' }, // WhatsApp dark green
                { name: 'Sara Hassan', color: '#34B7F1' }  // WhatsApp blue
            ],
            deadline: "25/11",
            priority: "High",
            state: "started",
            tags: "design, figma, UI",
        },
        {
            taskName: "API Development",
            assignedTo: [
                { name: 'Youssef Shafek', color: '#FFB300' }, // Yellow-orange
                { name: 'Mariam Saleh', color: '#FF5722' },  // Bright orange
                { name: 'Tarek Khaled', color: '#D32F2F' }    // Red
            ],
            deadline: "28/11",
            priority: "Normal",
            state: "holding",
            tags: "backend, node, API",
        },
        {
            taskName: "Testing & QA",
            assignedTo: [
                { name: 'Ahmed Mohammed', color: '#4CAF50' }, // Strong green
                { name: 'Alaa Wael', color: '#8BC34A' }       // Light green
            ],
            deadline: "30/11",
            priority: "Low",
            state: "started",
            tags: "testing, QA, manual",
        },
        {
            taskName: "Deployment",
            assignedTo: [
                { name: 'Noha Khaled', color: '#FF9800' }, // Bright amber
                { name: 'Ibrahim Nader', color: '#F44336' }  // Bold red
            ],
            deadline: "01/12",
            priority: "High",
            state: "NA",
            tags: "deployment, AWS, CI/CD",
        },
        {
            taskName: "Database Setup",
            assignedTo: [
                { name: 'Fatima Ali', color: '#8E24AA' },  // Vibrant purple
                { name: 'Hassan Mohamed', color: '#F50057' } // Deep pink
            ],
            deadline: "05/12",
            priority: "Normal",
            state: "finished",
            tags: "database, setup, SQL",
        },
        {
            taskName: "Frontend Development",
            assignedTo: [
                { name: 'Samira Ahmed', color: '#00BCD4' }, // Cyan
                { name: 'Mohamed Fawzy', color: '#2196F3' } // Blue
            ],
            deadline: "10/12",
            priority: "High",
            state: "started",
            tags: "frontend, React, UI",
        },
        {
            taskName: "User Research",
            assignedTo: [
                { name: 'Laila Ibrahim', color: '#9C27B0' }, // Purple
                { name: 'Tamer Elshamy', color: '#3F51B5' }  // Indigo
            ],
            deadline: "12/12",
            priority: "Low",
            state: "holding",
            tags: "research, user testing, feedback",
        },
        {
            taskName: "Code Review",
            assignedTo: [
                { name: 'Yasmin Salah', color: '#FF4081' }, // Pink
                { name: 'Ahmed Elhady', color: '#F57C00' }  // Orange
            ],
            deadline: "15/12",
            priority: "Normal",
            state: "finished",
            tags: "code review, peer review",
        },
        {
            taskName: "Marketing Campaign",
            assignedTo: [
                { name: 'Ramy Elmasry', color: '#00E5FF' }, // Light blue
                { name: 'Dalia Kassem', color: '#FF9800' }  // Amber
            ],
            deadline: "20/12",
            priority: "High",
            state: "NA",
            tags: "marketing, campaign, digital",
        },
        {
            taskName: "Client Meeting",
            assignedTo: [
                { name: 'Ahmed ElFayoumy', color: '#8BC34A' }, // Green
                { name: 'Mona Gamal', color: '#9E9D24' }  // Olive green
            ],
            deadline: "18/12",
            priority: "Normal",
            state: "started",
            tags: "client, meeting, discussion",
        },
    ];




    function taskstateDropdown(id) {
        // Loop through all elements with the 'statesmenu' class
        document.querySelectorAll('.statesmenu').forEach((element) => {
            // Add the 'hidden' class to all elements except the selected one
            if (element.id !== `dropdown${id}`) {
                element.classList.add('hidden');
            }
        });

        // Find the specific dropdown by its ID and toggle the 'hidden' class
        const element = document.getElementById(`dropdown${id}`);
        if (element) {
            element.classList.toggle('hidden');
        }
    }


    return (
        <>
            <div className="relative overflow-x-scroll overflow-y-visible shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right overflow-y-visible text-gray-500 dark:text-gray-400">
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
                                {/* taskname column */}
                                <th
                                    scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                    {task.taskName}
                                </th>
                                {/* assigned to column */}
                                <td className="px-6 py-4">
                                    <div className="flex -space-x-2 max-w-[200px] overflow-hidden">
                                        {task.assignedTo.map((person, personIndex) => (
                                            <div
                                                key={personIndex}
                                                className={`w-6 h-6 flex items-center justify-center text-white drop-shadow-xl rounded-full uppercase cursor-default`}
                                                style={{ backgroundColor: person.color }}
                                                title={person.name}
                                            >
                                                {person.name.split('')[0]}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                {/* deadline column */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2" color="red" />
                                        {task.deadline}
                                    </div>
                                </td>
                                {/* priority column */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <BringToFront className="mr-2" color="#19f" />
                                        {task.priority}
                                    </div>
                                </td>
                                {/* states column */}
                                <td className="px-6 py-4 ">
                                    <div className="flex items-center space-x-2">
                                        <span className={`uppercase py-1 px-2 ${task.state ? `bg-${task.state}` : 'bg-gray-400'} drop-shadow text-white rounded-md w-20 text-center`}>
                                            {task.state}
                                        </span>
                                        <div className="relative">
                                            <button
                                                id={`button${rowIndex}`}
                                                onClick={() => { taskstateDropdown(rowIndex) }}
                                                className="text-gray-600 font-medium rounded-lg text-sm p-1 inline-flex items-center "
                                                type="button"
                                            >
                                                <ChevronDown />
                                            </button>
                                            {/* states menu */}
                                            <div
                                                id={`dropdown${rowIndex}`}
                                                className={`statesmenu absolute z-20 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 ${rowIndex >= tasks.length - 3 && rowIndex < tasks.length ? 'bottom-full' : ''}`}
                                            >
                                                <ul
                                                    className="py-2 text-sm text-gray-700 dark:text-gray-200 flex flex-col"
                                                    aria-labelledby={`dropdownHoverButton${rowIndex}`}
                                                >
                                                    {["finished", "started", "NA", "holding"].map((item, itemIndex) => (
                                                        <button key={itemIndex}>
                                                            <a
                                                                href="#"
                                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                            >
                                                                {item}
                                                            </a>
                                                        </button>
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
