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
                                <option value="pending">pending</option>
                                <option value="in_progress">in progress</option>
                                <option value="completed">completed</option>
                                <option value="cancelled">cancelled</option>
                                <option value="on_hold">on hold</option>
                                <option value="in_review">in review</option>
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
    const [tasks, setTasks] = useState([
        {
            "name": "UI Design",
            "members": [
                { "name": "Layla Ahmed", "color": "#25D366" },
                { "name": "Omar Ali", "color": "#128C7E" },
            ],
            "deadline": "2025-02-03 00:00:00",
            "priority": "High",
            "status": 2, // Use numbers consistently
            "tags": "design, figma, UI"
        },
        {
            "name": "API Development",
            "members": [
                { "name": "Youssef Shafek", "color": "#FFB300" },
                { "name": "Mariam Saleh", "color": "#FF5722" },
            ],
            "deadline": "2025-02-03 00:00:00",
            "priority": "Normal",
            "status": 1, // Use numbers consistently
            "tags": "backend, node, API"
        },
        // Other tasks...
    ]);

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
                {['pending', 'in_progress', 'completed', 'cancelled', 'on_hold', 'in_review'].map((status, index) => (
                    <div key={status}>
                        <div className={`px-3 py-1 text-white my-3 bg-${status} w-fit rounded-lg`}>{status.replace('_', ' ')}</div>
                        <TasksTable tasks={filteredTasks.filter((task) => task.status === index + 1)} />
                    </div>
                ))}
            </div>
        </div>
    );
}