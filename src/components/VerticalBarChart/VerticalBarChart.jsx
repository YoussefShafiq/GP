import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components from Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VerticalBarChart = ({ labels, dataPoints, label, backgroundColor, borderColor }) => {
    // Define chart data based on the props received
    const data = {
        labels: labels, // labels passed as props (x-axis)
        datasets: [
            {
                label: label || 'Dataset', // label passed as prop
                data: dataPoints, // data points passed as props (y-axis)
                backgroundColor: backgroundColor || 'rgba(75, 192, 192, 0.2)', // background color
                borderColor: borderColor || 'rgba(75, 192, 192, 1)', // border color
                borderWidth: 1,
                borderRadius: 10,

            },
        ],
    };

    // Define chart options
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                // text: 'Vertical Bar Chart',
            },
        },
        scales: {
            x: {
                beginAtZero: true, // x-axis starts at zero
            },
            y: {
                beginAtZero: true, // y-axis starts at zero
            },
        },
    };

    return (
        <div>
            <h2>{label}</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default VerticalBarChart;
