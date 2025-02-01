import React, { useEffect, useRef, useState } from 'react';
import TasksTable from '../../components/TasksTable/TasksTable';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ChevronUp, Search, Filter, ArrowUpDown } from 'lucide-react';

const FilterBar = ({ onSearch, onFilter, onSort, onStateFilter }) => {
    const [searchName, setSearchName] = useState('');
    const [searchTag, setSearchTag] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [sortPriority, setSortPriority] = useState('');
    const [sortDeadline, setSortDeadline] = useState('');
    const [filterState, setFilterState] = useState('');
    const [isExpanded, setIsExpanded] = useState(false); // State to manage expansion

    // Trigger search on typing
    useEffect(() => {
        onSearch(searchName, searchTag);
    }, [searchName, searchTag]);

    const handleFilter = (priority) => {
        setFilterPriority(priority);
        onFilter(priority);
    };

    const handleSort = (type, order) => {
        if (type === 'priority') {
            setSortPriority(order);
            setSortDeadline('');
        } else if (type === 'deadline') {
            setSortDeadline(order);
            setSortPriority('');
        }
        onSort(type, order);
    };

    const handleStateFilter = (state) => {
        setFilterState(state);
        onStateFilter(state);
    };

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="sticky top-12 z-40 bg-gray-100 rounded-2xl dark:bg-gray-800 shadow-lg p-4 mb-4">
            <div className="flex flex-col gap-4">
                {/* Search Inputs */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search by Task Name */}
                    <div className="flex items-center gap-2 flex-1">
                        <Search className="text-highlight" />
                        <input
                            type="text"
                            placeholder="Search by Task Name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg w-full"
                        />
                    </div>

                    {/* Search by Tag */}
                    <div className="flex items-center gap-2 flex-1">
                        <Search className="text-highlight" />
                        <input
                            type="text"
                            placeholder="Search by Tag"
                            value={searchTag}
                            onChange={(e) => setSearchTag(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg w-full"
                        />
                    </div>
                </div>

                {/* Toggle Button for Mobile */}
                <button
                    onClick={toggleExpansion}
                    className="md:hidden p-2 bg-gray-200 rounded-lg flex items-center justify-center"
                >
                    {isExpanded ? 'Hide Filters' : 'Show Filters'}
                </button>

                {/* Filters and Sorting */}
                {(isExpanded || window.innerWidth >= 768) && ( // Show filters if expanded or on desktop
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Filter by Priority */}
                        <div className="flex items-center gap-2 flex-1">
                            <Filter className="text-highlight" />
                            <select
                                value={filterPriority}
                                onChange={(e) => handleFilter(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg w-full"
                            >
                                <option value="">All Priorities</option>
                                <option value="High">High</option>
                                <option value="Normal">Normal</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        {/* Filter by State */}
                        <div className="flex items-center gap-2 flex-1">
                            <Filter className="text-highlight" />
                            <select
                                value={filterState}
                                onChange={(e) => handleStateFilter(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg w-full"
                            >
                                <option value="">All States</option>
                                <option value="in_progress">in_progress</option>
                                <option value="NA">NA</option>
                                <option value="completed">completed</option>
                                <option value="pending">pending</option>
                            </select>
                        </div>

                        {/* Sort by Priority */}
                        <div className="flex items-center gap-2 flex-1">
                            <ArrowUpDown className="text-highlight" />
                            <select
                                value={sortPriority}
                                onChange={(e) => handleSort('priority', e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg w-full"
                            >
                                <option value="">Sort by Priority</option>
                                <option value="asc">Priority: Low to High</option>
                                <option value="desc">Priority: High to Low</option>
                            </select>
                        </div>

                        {/* Sort by Deadline */}
                        <div className="flex items-center gap-2 flex-1">
                            <ArrowUpDown className="text-highlight" />
                            <select
                                value={sortDeadline}
                                onChange={(e) => handleSort('deadline', e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg w-full"
                            >
                                <option value="">Sort by Deadline</option>
                                <option value="asc">Deadline: Earliest to Latest</option>
                                <option value="desc">Deadline: Latest to Earliest</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Mytasks() {
    const [tasks, setTasks] = useState(
        [
            {
                "taskName": "UI Design",
                "assignedTo": [
                    {
                        "name": "Layla Ahmed",
                        "color": "#25D366"
                    }, // WhatsApp green
                    {
                        "name": "Omar Ali",
                        "color": "#128C7E"
                    }, // WhatsApp dark teal
                    {
                        "name": "Layla Ahmed",
                        "color": "#25D366"
                    }, // WhatsApp green
                    {
                        "name": "Omar Ali",
                        "color": "#128C7E"
                    }, // WhatsApp dark teal
                    {
                        "name": "Nour Youssef",
                        "color": "#075E54"
                    }, // WhatsApp dark green

                ],
                "deadline": "25/11",
                "priority": "High",
                "state": "in_progress",
                "tags": "design, figma, UI"
            },
            {
                "taskName": "API Development",
                "assignedTo": [
                    {
                        "name": "Youssef Shafek",
                        "color": "#FFB300"
                    }, // Yellow-orange
                    {
                        "name": "Mariam Saleh",
                        "color": "#FF5722"
                    }, // Bright orange
                    {
                        "name": "Tarek Khaled",
                        "color": "#D32F2F"
                    } // Red
                ],
                "deadline": "28/11",
                "priority": "Normal",
                "state": "pending",
                "tags": "backend, node, API"
            },
            {
                "taskName": "Testing & QA",
                "assignedTo": [
                    {
                        "name": "Ahmed Mohammed",
                        "color": "#4CAF50"
                    }, // Strong green
                    {
                        "name": "Alaa Wael",
                        "color": "#8BC34A"
                    } // Light green
                ],
                "deadline": "30/11",
                "priority": "Low",
                "state": "in_progress",
                "tags": "testing, QA, manual"
            },
            {
                "taskName": "Deployment",
                "assignedTo": [
                    {
                        "name": "Noha Khaled",
                        "color": "#FF9800"
                    }, // Bright amber
                    {
                        "name": "Ibrahim Nader",
                        "color": "#F44336"
                    } // Bold red
                ],
                "deadline": "01/12",
                "priority": "High",
                "state": "cancelled",
                "tags": "deployment, AWS, CI/CD"
            },
            {
                "taskName": "Database Setup",
                "assignedTo": [
                    {
                        "name": "Fatima Ali",
                        "color": "#8E24AA"
                    }, // Vibrant purple
                    {
                        "name": "Hassan Mohamed",
                        "color": "#F50057"
                    } // Deep pink
                ],
                "deadline": "05/12",
                "priority": "Normal",
                "state": "completed",
                "tags": "database, setup, SQL"
            },
            {
                "taskName": "Frontend Development",
                "assignedTo": [
                    {
                        "name": "Samira Ahmed",
                        "color": "#00BCD4"
                    }, // Cyan
                    {
                        "name": "Mohamed Fawzy",
                        "color": "#2196F3"
                    } // Blue
                ],
                "deadline": "10/12",
                "priority": "High",
                "state": "in_progress",
                "tags": "frontend, React, UI"
            },
            {
                "taskName": "User Research",
                "assignedTo": [
                    {
                        "name": "Laila Ibrahim",
                        "color": "#9C27B0"
                    }, // Purple
                    {
                        "name": "Tamer Elshamy",
                        "color": "#3F51B5"
                    } // Indigo
                ],
                "deadline": "12/12",
                "priority": "Low",
                "state": "pending",
                "tags": "research, user testing, feedback"
            },
            {
                "taskName": "Code Review",
                "assignedTo": [
                    {
                        "name": "Yasmin Salah",
                        "color": "#FF4081"
                    }, // Pink
                    {
                        "name": "Ahmed Elhady",
                        "color": "#F57C00"
                    } // Orange
                ],
                "deadline": "15/12",
                "priority": "Normal",
                "state": "completed",
                "tags": "code review, peer review"
            },
            {
                "taskName": "Marketing Campaign",
                "assignedTo": [
                    {
                        "name": "Ramy Elmasry",
                        "color": "#00E5FF"
                    }, // Light blue
                    {
                        "name": "Dalia Kassem",
                        "color": "#FF9800"
                    } // Amber
                ],
                "deadline": "20/12",
                "priority": "High",
                "state": "cancelled",
                "tags": "marketing, campaign, digital"
            },
            {
                "taskName": "Client Meeting",
                "assignedTo": [
                    {
                        "name": "Ahmed ElFayoumy",
                        "color": "#8BC34A"
                    }, // Green
                    {
                        "name": "Mona Gamal",
                        "color": "#9E9D24"
                    } // Olive green
                ],
                "deadline": "18/12",
                "priority": "Normal",
                "state": "in_progress",
                "tags": "client, meeting, discussion"
            }
        ]
    );

    const [filteredTasks, setFilteredTasks] = useState(tasks);

    const [searchName, setSearchName] = useState('');
    const [searchTag, setSearchTag] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [sortPriority, setSortPriority] = useState('');
    const [sortDeadline, setSortDeadline] = useState('');
    const [filterState, setFilterState] = useState('');

    const applyFiltersAndSorting = () => {
        let filtered = tasks;

        // Apply search by name and tag
        if (searchName || searchTag) {
            filtered = filtered.filter(task => {
                const matchesName = task.taskName.toLowerCase().includes(searchName.toLowerCase());
                const matchesTag = task.tags.toLowerCase().includes(searchTag.toLowerCase());
                return matchesName && matchesTag;
            });
        }

        // Apply filter by priority
        if (filterPriority) {
            filtered = filtered.filter(task => task.priority === filterPriority);
        }

        // Apply filter by state
        if (filterState) {
            filtered = filtered.filter(task => task.state === filterState);
        }

        // Apply sorting
        if (sortPriority) {
            const priorityOrder = { 'High': 3, 'Normal': 2, 'Low': 1 };
            filtered = [...filtered].sort((a, b) => {
                return sortPriority === 'asc' ? priorityOrder[a.priority] - priorityOrder[b.priority] : priorityOrder[b.priority] - priorityOrder[a.priority];
            });
        } else if (sortDeadline) {
            filtered = [...filtered].sort((a, b) => {
                const dateA = new Date(a.deadline.split('/').reverse().join('-'));
                const dateB = new Date(b.deadline.split('/').reverse().join('-'));
                return sortDeadline === 'asc' ? dateA - dateB : dateB - dateA;
            });
        }

        setFilteredTasks(filtered);
    };

    useEffect(() => {
        applyFiltersAndSorting();
    }, [searchName, searchTag, filterPriority, sortPriority, sortDeadline, filterState]);

    const handleSearch = (name, tag) => {
        setSearchName(name);
        setSearchTag(tag);
    };

    const handleFilter = (priority) => {
        setFilterPriority(priority);
    };

    const handleSort = (type, order) => {
        if (type === 'priority') {
            setSortPriority(order);
            setSortDeadline('');
        } else if (type === 'deadline') {
            setSortDeadline(order);
            setSortPriority('');
        }
    };

    const handleStateFilter = (state) => {
        setFilterState(state);
    };

    return (
        <div className="p-5 pb-32 dark:bg-dark min-h-[calc(100vh-40px)]">
            <FilterBar
                onSearch={handleSearch}
                onFilter={handleFilter}
                onSort={handleSort}
                onStateFilter={handleStateFilter}
            />

            {/* Task State Sections */}
            <div className="space-y-6">
                {['in_progress', 'cancelled', 'completed', 'pending'].map((state) => (
                    <div key={state}>
                        <div className={`px-3 py-1 text-white my-3 bg-${state} w-fit rounded-lg`}>{state}</div>
                        <TasksTable tasks={filteredTasks.filter((task) => task.state === state)} />
                    </div>
                ))}
            </div>
        </div>
    );
}