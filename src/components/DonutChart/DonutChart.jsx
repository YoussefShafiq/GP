import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({
    labels = ['#133d57', '#f25287', '#00adb5'],
    dataPoints = [300, 50, 100],
    backgroundColors = [
        '#00ADB5', // Teal
        '#133D57', // Dark Teal-Blue
        '#F25287', // Pink-Red
        '#A1E8D9', // Light Mint Teal
        '#FF5733', // Vibrant Coral
        '#4B6587', // Slate Blue
        '#F7B801', // Golden Yellow
        '#303841', // Charcoal
        '#2D98DA', // Bright Sky Blue
        '#D7263D'  // Bold Crimson
    ],

    hoverColors = [
        '#00C5C9', // Brighter Teal
        '#1A4E6B', // Slightly Brighter Dark Teal-Blue
        '#FF668E', // Brighter Pink-Red
        '#B8F2E6', // Brighter Light Mint Teal
        '#FF7041', // Brighter Coral
        '#5A7694', // Brighter Slate Blue
        '#F9C846', // Brighter Golden Yellow
        '#3E4A50', // Brighter Charcoal
        '#3DA8F0', // Brighter Bright Sky Blue
        '#E23E52'  // Brighter Bold Crimson
    ],
    // borderColor = '#000',
    borderWidth = 0,
    cutout = '75%',
    centerText = '',
    label = '',
    fontSize = 16
}) {
    // Define chart data based on the props received
    const data = {
        labels: labels,
        datasets: [
            {
                label: label,
                data: dataPoints,
                backgroundColor: backgroundColors,
                hoverBackgroundColor: hoverColors,
                // borderColor: borderColor, 
                borderWidth: borderWidth,
                borderRadius: 50,
            },
        ],
    };

    // Define chart options
    const options = {
        responsive: true,
        maintainAspectRatio: true, // Ensure the chart size is not affected
        plugins: {
            legend: {
                display: false,
                position: 'bottom', // Position labels below the chart
                labels: {
                    boxWidth: 10, // Set the width of the color circle
                    padding: 10, // Add space between the legend text and the circle
                    font: {
                        size: 12, // Font size for legend labels
                    },
                    // Ensure the items are displayed on separate lines
                    usePointStyle: true, // Make legend labels circles instead of squares
                    pointStyle: 'circle', // Ensure the point style is a circle
                    pointRadius: 8, // Size of the circles
                    align: 'start'

                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        // Custom tooltip showing percentage
                        const dataset = tooltipItem.dataset;
                        const total = dataset.data.reduce((acc, curr) => acc + curr, 0);
                        const currentValue = dataset.data[tooltipItem.dataIndex];
                        const percentage = ((currentValue / total) * 100).toFixed(2);
                        return `${tooltipItem.label}: ${currentValue} (${percentage}%)`;
                    },
                },
            },
        },
        cutout: cutout, // Controls the size of the donut hole
    };

    // Add a plugin to draw the text in the center of the donut
    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw(chart) {
            const { width, height } = chart; // Get chart dimensions
            const ctx = chart.ctx; // Get the canvas context
            ctx.save();

            // Calculate the center position
            const centerX = width / 2;
            const centerY = height / 2; // Use height/2 for perfect vertical centering

            // Set font and text style
            ctx.font = `bold  ${fontSize}px  Arial`; // Customize the font size and style
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle'; // Ensures text is centered vertically
            ctx.fillStyle = '#666'; // Text color

            // Draw the text
            ctx.fillText(centerText, centerX, centerY);

            ctx.restore();
        },
    };


    return (
        <div className='relative w-full'>
            {/* Render the Doughnut chart with plugins */}
            <h2 className='font-inter font-bold text-gray-900 dark:text-gray-50 mb-5 capitalize'>{label}</h2>

            <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
            {/* Custom Labels */}
            <div className="flex flex-col items-start mt-3 p-2">
                {labels.map((label, index) => (
                    <div
                        key={index}
                        className="flex items-center my-1"
                    >
                        {/* Color Indicator */}
                        <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: backgroundColors[index] }} // Background color still dynamically set
                        ></div>
                        {/* Label Text */}
                        <span className="text-[10px] w-max md:text-sm text-gray-800 dark:text-gray-50 capitalize">{label}</span>
                    </div>
                ))}
            </div>

        </div>
    );
}
