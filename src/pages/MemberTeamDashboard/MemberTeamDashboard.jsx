import React from 'react'
import VerticalBarChart from '../../components/VerticalBarChart/VerticalBarChart';
import DonutChart from '../../components/DonutChart/DonutChart';
import LineChart from '../../components/LineChart/LineChart';

export default function MemberTeamDashboard() {
    const label = 'Task Progress';



    const linechartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dataPoints: [5, 9, 1, 5, 2, 4, 5, 2, 4, 5, 2, 4, 5],
    };

    return <>
        <div className="flex flex-col gap-5">
            <div className="flex gap-5">
                <div className="flex flex-col items-center gap-5 w-1/5 ">
                    <div className="w-full flex flex-col justify-center items-center text-center h-1/2 text-sm bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 p-4 rounded-xl">
                        <div className="w-2/3">
                            <DonutChart
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={['10', '90']}
                                centerText={'10%'}
                                fontSize={26}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-sm">Overdue tasks</h3>
                        </div>
                    </div>
                    <div className="w-full flex flex-col justify-center items-center text-center h-1/2 text-sm bg-base dark:bg-dark1 shadow-xl text-black dark:text-white gap-2 p-4 rounded-xl">
                        <div className="w-2/3">
                            <DonutChart
                                backgroundColors={['#00c5c9', '#ffffff33']}
                                dataPoints={['10', '90']}
                                centerText={'10%'}
                                fontSize={26}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-sm">At risk tasks</h3>
                        </div>
                    </div>
                </div>
                <div className="w-4/5 flex flex-col">
                    <div className="bg-base dark:bg-dark1 shadow-lg rounded-2xl">
                        <div className="flex justify-between items-center pt-4 px-6">
                            <h2 className="font-inter font-bold text-gray-900 dark:text-white">
                                Total tasks duration per month
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
            <div className="flex gap-5">
                <div className="flex flex-col space-y-4 bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl">
                    <div className="w-full">
                        <DonutChart
                            dataPoints={[500]}
                            centerText="54h"
                            label="AVG time to complete tasks"
                            fontSize={45}
                            backgroundColors={['#F25287']}
                            hoverColors={['#FF668E']}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center w-full bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl overflow-hidden h-full">
                    <div className="w-full flex flex-col justify-center items-center text-center h-1/2 text-sm  text-black dark:text-white gap-2 p-4 rounded-xl">

                        <div className="flex items-center w-full text-start">
                            <h2 className="text-lg font-semibold w-1/4">Team Name</h2>
                            <h3 className="text-base w-3/4 text-start">Development Team</h3>
                        </div>
                        <div className="w-full bg-white opacity-20 h-[1px] m-auto my-2"></div>
                        <div className="flex items-center w-full text-start">
                            <h2 className="text-lg font-semibold w-1/4">Role</h2>
                            <h3 className="text-base w-3/4 text-start">Leader</h3>
                        </div>
                        <div className="w-full bg-white opacity-20 h-[1px] m-auto my-2"></div>
                    </div>
                    <div className="flex items-center overflow-hidden w-full">
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                labels={['frontend']}
                                dataPoints={[500, 300]}
                                centerText="75"
                                label="Pending"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                labels={['frontend']}
                                dataPoints={[500, 300]}
                                centerText="75"
                                label="in progress"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                labels={['frontend']}
                                dataPoints={[500, 300]}
                                centerText="75"
                                label="Completed"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                labels={['frontend']}
                                dataPoints={[500, 300]}
                                centerText="75"
                                label="in review"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                labels={['frontend']}
                                dataPoints={[500, 300]}
                                centerText="75"
                                label="cancelled"
                                fontSize={20}
                            />
                        </div>
                        <div className="py-4 px-4 w-1/6">
                            <DonutChart
                                labels={['frontend']}
                                dataPoints={[500, 300]}
                                centerText="75"
                                label="on hold"
                                fontSize={20}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-5">
                <div className=" bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl">
                    <div className="h-[300px]">
                        <DonutChart
                            labels={['low', 'medium', 'high']}
                            dataPoints={[500, 300, 500]}
                            centerText="75"
                            label="Task breakdown by priority"
                            fontSize={45}
                        />
                    </div>
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="bg-base dark:bg-dark1 shadow-lg p-5 rounded-2xl">
                        <div className="flex justify-between items-center pt-4 px-6">
                            <h2 className="font-inter font-bold text-gray-900 dark:text-white">
                                Task completion rate over Year
                            </h2>
                        </div>
                        <div className="flex">
                            <div className="w-full p-5">
                                <VerticalBarChart
                                    labels={linechartData.labels}
                                    dataPoints={linechartData.dataPoints}
                                    backgroundColors={['#00c5c9']}
                                    hoverColors={['#1A4E6B']}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
