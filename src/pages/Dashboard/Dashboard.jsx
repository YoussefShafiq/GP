import { BellDot, CalendarDays, ChevronDown } from 'lucide-react'
import React from 'react'
import VerticalBarChart from '../../components/VerticalBarChart/VerticalBarChart';
import ProgressBarChart from '../../components/VerticalBarChart/ProgressBarChart/ProgressBarChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faAward, faSquarePollVertical } from '@fortawesome/free-solid-svg-icons';
import DonutChart from '../../components/DonutChart/DonutChart';

export default function Dashboard() {
    const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const dataPoints = [5, 9, 1, 5, 2, 4, 5];
    const label = 'Task Progress';
    const backgroundColor = '#00adb5';
    const borderColor = '#fff';
    const barSpacing = 0.7; // Adjust this value to control the space between bars

    return <>
        <div className="flex h-full dark:bg-dark">
            <div className="w-2/3">
                <div className="flex justify-between items-center py-5 px-10">
                    <div className="text-darkblue dark:text-white font-semibold font-inter text-3xl">
                        Analytics
                    </div>
                    <div className="flex space-x-5 text-black dark:text-white">
                        <div className="flex items-center space-x-1">
                            <CalendarDays strokeWidth={1.3} />
                            <p className='font-inter font-medium text-sm '>Monday, 4th September</p>
                        </div>
                        <div className="bg-[#f1eef6] rounded-full aspect-square p-2">
                            <BellDot size={25} strokeWidth={2} absoluteStrokeWidth className='text-darkblue' />
                        </div>
                    </div>
                </div>
                <div className="flex p-8 space-x-5">
                    {/* leftside */}
                    <div className="w-1/3 flex flex-col space-y-4">
                        <div className="py-4 px-6 outline outline-1 outline-gray-200 rounded-2xl flex flex-col justify-center items-center">
                            <div className="flex justify-start space-x-4 items-center w-full">
                                <div className="w-14 bg-[#f1eef6] dark:bg-opacity-5 flex items-center justify-center text-blueblack dark:text-highlight rounded-xl aspect-square text-3xl">
                                    <FontAwesomeIcon icon={faClock} />
                                </div>
                                <div className="flex flex-col  ">
                                    <span className='capitalize text-gray-400 text-sm'>hours spent</span>
                                    <span className='font-semiBold text-2xl dark:text-white' >54 hours</span>
                                </div>
                            </div>
                            <div className="h-[1px] w-full bg-gray-200 my-5"></div>
                            <div className="flex justify-start space-x-4 items-center w-full">
                                <div className="w-14 bg-[#f1eef6] dark:bg-opacity-5 flex items-center justify-center text-blueblack dark:text-highlight rounded-xl aspect-square text-3xl">
                                    <FontAwesomeIcon icon={faAward} />
                                </div>
                                <div className="flex flex-col  ">
                                    <span className='capitalize text-gray-400 text-sm'>Achivements</span>
                                    <span className='font-semiBold text-2xl dark:text-white' >54</span>
                                </div>
                            </div>
                            <div className="h-[1px] w-full bg-gray-200 my-5"></div>
                            <div className="flex justify-start space-x-4 items-center w-full">
                                <div className="w-14 bg-[#f1eef6] dark:bg-opacity-5 flex items-center justify-center text-blueblack dark:text-highlight rounded-xl aspect-square text-3xl">
                                    <FontAwesomeIcon icon={faSquarePollVertical} />
                                </div>
                                <div className="flex flex-col  ">
                                    <span className='capitalize text-gray-400 text-sm'>team progress</span>
                                    <span className='font-semiBold text-2xl dark:text-white' >84%</span>
                                </div>
                            </div>
                        </div>
                        <div className="py-4 px-4 outline outline-1 outline-gray-200 rounded-2xl flex flex-col justify-center items-center">
                            <DonutChart
                                labels={['frontend', 'backend', 'design']}
                                dataPoints={[500, 300, 500]}
                                // backgroundColors={['#133d57', '#f25287', '#00adb5', '#777']}
                                // hoverColors={['#071924', '#bf406a', '#007c82','#999']}
                                centerText="75"
                                label="your interests"
                            />
                        </div>
                    </div>
                    {/* rightside */}
                    <div className="w-2/3 flex flex-col">
                        <div className="outline outline-1 outline-gray-200 rounded-2xl ">
                            <div className="flex justify-between items-center pt-4 px-6 ">
                                <h2 className='font-inter font-bold text-gray-900 dark:text-white '>{label}</h2>
                                <div className="relative py-2 px-3 rounded-lg outline outline-1 outline-gray-200 dark:outline-[#ffffff33] flex space-x-3 items-center group cursor-pointer">
                                    <div className="font-inter text-gray-600 dark:text-white text-sm">Weekly</div>
                                    <ChevronDown size={18} className="transition-transform duration-300 group-hover:rotate-180 dark:text-highlight group-hover:text-highlight" />
                                    <ul className='hidden z-10 hover:block py-2 group-hover:block absolute bg-white dark:bg-dark dark:text-white rounded-tl-none border border-r top-0 dark:border-[#ffffff33] right-0 translate-y-9 rounded-lg w-full text-gray-900'>
                                        <li className='hover:bg-[#f3f4f6] hover:text-highlight transition-all p-1 px-3 cursor-pointer ' >Daily</li>
                                        <li className='hover:bg-[#f3f4f6] hover:text-highlight transition-all p-1 px-3 cursor-pointer '>Weakly</li>
                                        <li className='hover:bg-[#f3f4f6] hover:text-highlight transition-all p-1 px-3 cursor-pointer '>Monthly</li>
                                        <li className='hover:bg-[#f3f4f6] hover:text-highlight transition-all p-1 px-3 cursor-pointer '>Yearly</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-4/5 p-5">
                                    <ProgressBarChart
                                        labels={labels}
                                        dataPoints={dataPoints}
                                        label={label}
                                        backgroundColor={backgroundColor}
                                        borderColor={borderColor}
                                        barSpacing={barSpacing}
                                    />
                                </div>
                                <div className="w-1/5 flex flex-col justify-center items-center space-y-4 pe-6">
                                    <div className="flex flex-col space-y-1 w-full">
                                        <p className="font-inter text-gray-400 text-xs text-start">Time spent</p>
                                        <div className="flex justify-between items-center">
                                            <span className='font-inter font-semibold text-sm uppercase dark:text-white' >18h</span>
                                            <div className="bg-light text-center py-1 text-xs px-2 rounded-xl">100%</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1 w-full">
                                        <p className="font-inter text-gray-400 text-xs text-start">Rework time</p>
                                        <div className="flex justify-between items-center">
                                            <span className='font-inter font-semibold text-sm uppercase dark:text-white' >3h</span>
                                            <div className="bg-light text-center py-1 text-xs px-2 rounded-xl">16%</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1 w-full">
                                        <p className="font-inter text-gray-400 text-xs text-start">Testing time</p>
                                        <div className="flex justify-between items-center">
                                            <span className='font-inter font-semibold text-sm uppercase dark:text-white ' >2H</span>
                                            <div className="bg-light text-center py-1 text-xs px-2 rounded-xl">9%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-1/3 rounded-tl-3xl rounded-bl-3xl bg-base shadow-lg">

            </div>
        </div>
    </>
}
