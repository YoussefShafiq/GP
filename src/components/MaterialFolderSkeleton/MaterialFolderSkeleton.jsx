import React from 'react';

const MaterialFolderSkeleton = () => {
    return (
        <div className="relative bg-base dark:bg-dark2 rounded-lg shadow-lg p-6 w-full lg:w-[calc(25%-10px)] rounded-tl-none mt-5 cursor-pointer animate-pulse">
            {/* Placeholder for the top bar */}
            <div className="absolute w-1/2 -top-6 left-0 bg-gray-200 dark:bg-dark2 h-6 rounded-tl-lg rounded-tr-3xl"></div>

            {/* Placeholder for the content */}
            <div className="space-y-4">
                {/* Placeholder for the icon and title */}
                <div className="flex items-center gap-2">
                    <div className="aspect-square p-1.5 rounded-lg bg-gray-300">
                        <div className="w-6 h-6 bg-gray-400 rounded"></div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                </div>

                {/* Placeholder for the date and ellipsis icon */}
                <div className="flex justify-between items-center w-full">
                    <div className="h-4 bg-gray-500 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-4"></div>
                </div>
            </div>
        </div>
    );
};

export default MaterialFolderSkeleton;