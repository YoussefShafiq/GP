import { BellDot, ChevronDown, MoveDownLeft, MoveUpRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import VerticalBarChart from '../../components/VerticalBarChart/VerticalBarChart';
import ProgressBarChart from '../../components/VerticalBarChart/ProgressBarChart/ProgressBarChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faAward, faListCheck, faPeopleGroup, faSquarePollVertical } from '@fortawesome/free-solid-svg-icons';
import DonutChart from '../../components/DonutChart/DonutChart';
import LineChart from '../../components/LineChart/LineChart';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';


export default function Dashboard() {
    const label = 'Task Progress';



    const linechartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dataPoints: [5, 9, 1, 5, 2, 4, 5, 2, 4, 5, 2, 4, 5],
    };


    return (
        <div className="flex flex-col h-full dark:bg-darkoverflow-hidden">


            {/* Dashboard Content */}
            <div className="flex gap-5">
                {/* First vertical data card */}
                <div className="flex flex-col justify-center w-1/12 bg-base shadow-xl text-black gap-2 py-4 rounded-xl">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-1/2">
                            <DonutChart
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={['10', '90']}
                                centerText={'10%'}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">54</h2>
                            <h3 className="text-sm">pending</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-1/2">
                            <DonutChart
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={['10', '90']}
                                centerText={'10%'}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">54</h2>
                            <h3 className="text-sm">pending</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-1/2">
                            <DonutChart
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={['10', '90']}
                                centerText={'10%'}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">54</h2>
                            <h3 className="text-sm">pending</h3>
                        </div>
                    </div>
                </div>

                {/* Second vertical data card */}
                <div className="flex flex-col justify-center w-1/12 bg-base shadow-xl text-black gap-2 py-4 rounded-xl">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-1/2">
                            <DonutChart
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={['10', '90']}
                                centerText={'10%'}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">54</h2>
                            <h3 className="text-sm">pending</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-1/2">
                            <DonutChart
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={['10', '90']}
                                centerText={'10%'}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">54</h2>
                            <h3 className="text-sm">pending</h3>
                        </div>
                    </div>
                    <div className="w-2/3 bg-white h-[1px] m-auto my-2"></div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="w-1/2">
                            <DonutChart
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={['10', '90']}
                                centerText={'10%'}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-semibold">54</h2>
                            <h3 className="text-sm">pending</h3>
                        </div>
                    </div>
                </div>

                {/* Project cards */}
                <div className="flex flex-col w-1/6 gap-5">
                    <div className="flex flex-col justify-center items-center text-center h-1/2 text-sm bg-base shadow-xl text-black gap-2 p-4 rounded-xl">
                        <FontAwesomeIcon icon={faListCheck} className="text-2xl" />
                        <h2 className="font-semibold capitalize">projects</h2>
                        <h2 className="text-3xl">95</h2>
                        <h3 className='flex items-center'><MoveDownLeft className='text-red-500' />10% decrease from last month</h3>
                    </div>
                    <div className="flex flex-col justify-center items-center text-center h-1/2 text-sm bg-base shadow-xl text-black gap-2 p-4 rounded-xl">
                        <FontAwesomeIcon icon={faPeopleGroup} className="text-2xl" />
                        <h2 className="font-semibold capitalize">teams</h2>
                        <h2 className="text-3xl">95</h2>
                        <h3 className='flex items-center'><MoveUpRight className='text-green-500' />10% increase from last month</h3>
                    </div>
                </div>

                {/* Main chart area */}
                <div className="w-4/6 flex flex-col">
                    <div className="outline outline-1 outline-gray-200 bg-base shadow-lg rounded-2xl">
                        <div className="flex justify-between items-center pt-4 px-6">
                            <h2 className="font-inter font-bold text-gray-900 dark:text-white">
                                {label}
                            </h2>
                        </div>
                        <div className="flex">
                            <div className="w-full p-5">
                                <LineChart
                                    labels={linechartData.labels}
                                    dataPoints={linechartData.dataPoints}
                                    label={linechartData.label}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom section */}
            <div className="flex mt-8 gap-3">
                <div className="flex flex-col space-y-4 outline outline-1 outline-gray-200 bg-base shadow-lg p-5 rounded-2xl">
                    <div className="py-4 px-4 flex flex-col items-center">
                        <DonutChart
                            labels={['frontend', 'backend', 'design']}
                            dataPoints={[500, 300, 500]}
                            centerText="75"
                            label="your interests"
                            fontSize={45}
                        />
                    </div>
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="outline outline-1 outline-gray-200 bg-base shadow-lg p-5 rounded-2xl">
                        <div className="flex justify-between items-center pt-4 px-6">
                            <h2 className="font-inter font-bold text-gray-900 dark:text-white">
                                {label}
                            </h2>
                        </div>
                        <div className="flex">
                            <div className="w-full p-5">
                                <ProgressBarChart
                                    labels={linechartData.labels}
                                    dataPoints={linechartData.dataPoints}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}