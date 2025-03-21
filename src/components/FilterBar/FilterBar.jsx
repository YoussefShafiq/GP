import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

const FilterBar = ({
    onSearch,
    onFilter,
    onProjectFilter,
    onTeamFilter,
    onSort,
    onStateFilter,
    projects,
    teams,
    isTeamsLoading,
}) => {
    const [searchName, setSearchName] = useState('');
    const [searchTag, setSearchTag] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [sortPriority, setSortPriority] = useState('');
    const [sortDeadline, setSortDeadline] = useState('');
    const [filterState, setFilterState] = useState('');
    const [filterProjectId, setFilterProjectId] = useState(''); // State for project ID
    const [filterTeamId, setFilterTeamId] = useState(''); // State for team ID
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        onSearch(searchName, searchTag);
    }, [searchName, searchTag]);

    const handleFilter = (priority) => {
        setFilterPriority(priority);
        onFilter(priority);
    };

    const handleProjectFilter = (projectId) => {
        setFilterProjectId(projectId);
        setFilterTeamId(''); // Reset team filter when project changes
        onProjectFilter(projectId); // Call onProjectFilter
    };

    const handleTeamFilter = (teamId) => {
        setFilterTeamId(teamId);
        onTeamFilter(teamId); // Call onTeamFilter
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
        <div className="sticky top-28 z-40 bg-gray-100 rounded-2xl dark:bg-dark1 shadow-lg p-4 mb-4">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-2 flex-1">
                        <Search className="text-highlight" />
                        <input
                            type="text"
                            placeholder="Search by Task Name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="p-2 border border-gray-300 dark:bg-dark2 text-white focus:border-light focus:ring-0 transition-all rounded-lg w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                        <Search className="text-highlight" />
                        <input
                            type="text"
                            placeholder="Search by Tag"
                            value={searchTag}
                            onChange={(e) => setSearchTag(e.target.value)}
                            className="p-2 border border-gray-300 dark:bg-dark2 text-white focus:border-light focus:ring-0 transition-all rounded-lg w-full"
                        />
                    </div>
                </div>
                <button
                    onClick={toggleExpansion}
                    className="md:hidden p-2 bg-gray-200 dark:bg-dark2 dark:text-white rounded-lg flex items-center justify-center"
                >
                    {isExpanded ? 'Hide Filters' : 'Show Filters'}
                </button>
                <AnimatePresence>
                    {(isExpanded || window.innerWidth >= 768) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }} // Initial state (hidden)
                            animate={{ opacity: 1, height: 'auto' }} // Animate to visible state
                            exit={{ opacity: 0, height: 0 }} // Animate to hidden state
                            transition={{ duration: 0.3 }} // Animation duration
                            className="overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex items-center gap-2 flex-1">
                                    <Filter className="text-highlight" />
                                    <select
                                        value={filterPriority}
                                        onChange={(e) => handleFilter(e.target.value)}
                                        className="p-2 border border-gray-300 dark:bg-dark2 dark:text-white focus:border-light focus:ring-0 transition-all rounded-lg w-full"
                                    >
                                        <option value="">All Priorities</option>
                                        <option value="high">high</option>
                                        <option value="medium">medium</option>
                                        <option value="low">low</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 flex-1">
                                    <Filter className="text-highlight" />
                                    <select
                                        value={filterState}
                                        onChange={(e) => handleStateFilter(e.target.value)}
                                        className="p-2 border border-gray-300 dark:bg-dark2 dark:text-white focus:border-light focus:ring-0 transition-all rounded-lg w-full"
                                    >
                                        <option value="">All States</option>
                                        <option value="1">pending</option>
                                        <option value="2">in progress</option>
                                        <option value="3">completed</option>
                                        <option value="4">cancelled</option>
                                        <option value="5">on hold</option>
                                        <option value="6">in review</option>
                                    </select>
                                </div>
                                {projects && (
                                    <div className="flex items-center gap-2 flex-1">
                                        <Filter className="text-highlight" />
                                        <select
                                            value={filterProjectId}
                                            onChange={(e) => handleProjectFilter(e.target.value)}
                                            className="p-2 border border-gray-300 dark:bg-dark2 dark:text-white focus:border-light focus:ring-0 transition-all rounded-lg w-full"
                                        >
                                            <option value="">Select Project</option>
                                            {projects.map((project) => (
                                                <option key={project.id} value={project.id}>
                                                    {project.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {projects && <>
                                    <div className="flex items-center gap-2 flex-1">
                                        <Filter className="text-highlight" />
                                        <select
                                            value={filterTeamId}
                                            onChange={(e) => handleTeamFilter(e.target.value)}
                                            className="p-2 border border-gray-300 dark:bg-dark2 dark:text-white focus:border-light focus:ring-0 transition-all rounded-lg w-full"
                                            disabled={!filterProjectId} // Disable if no project is selected
                                        >
                                            <option value="">Select Team</option>
                                            {teams?.map((team) => (
                                                <option key={team.id} value={team.id}>
                                                    {team.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>}

                                <div className="flex items-center gap-2 flex-1">
                                    <ArrowUpDown className="text-highlight" />
                                    <select
                                        value={sortPriority}
                                        onChange={(e) => handleSort('priority', e.target.value)}
                                        className="p-2 border border-gray-300 dark:bg-dark2 dark:text-white focus:border-light focus:ring-0 transition-all rounded-lg w-full"
                                    >
                                        <option value="">Sort by Priority</option>
                                        <option value="asc">Priority: Low to High</option>
                                        <option value="desc">Priority: High to Low</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 flex-1">
                                    <ArrowUpDown className="text-highlight" />
                                    <select
                                        value={sortDeadline}
                                        onChange={(e) => handleSort('deadline', e.target.value)}
                                        className="p-2 border border-gray-300 dark:bg-dark2 dark:text-white focus:border-light focus:ring-0 transition-all rounded-lg w-full"
                                    >
                                        <option value="">Sort by Deadline</option>
                                        <option value="asc">Deadline: Earliest to Latest</option>
                                        <option value="desc">Deadline: Latest to Earliest</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FilterBar;