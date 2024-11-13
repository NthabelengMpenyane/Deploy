import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './wings.css';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ products, soldProducts }) => {
    const chartData = {
        labels: products.map(product => product.name),
        datasets: [
            {
                label: 'Available Stock',
                data: products.map(product => product.quantity),
                backgroundColor: 'rgba(0, 255, 0, 0.6)', 
                borderColor: 'rgba(0, 128, 0, 1)', 
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Stock Quantity',
                },
            },
        },
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Available Products</h2>
            <div className='chart-container'>
                <Bar data={chartData} options={chartOptions} />
            </div>
            <h2>Pictures</h2>
            <div className='Food'>
                <img className='image1' src="/image/burger.jpg" alt="" />
                <img className='image2' src="/image/meat.jpg" alt="" />
                <img className='image3' src="/image/Rice.png" alt="" />
            </div>
            <h2>Sold Products</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity Sold</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {soldProducts.map((soldProduct, index) => (
                        <tr key={index}>
                            <td>{soldProduct.name}</td>
                            <td>{soldProduct.quantity}</td>
                            <td>{soldProduct.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Total Products Sold: {soldProducts.reduce((acc, soldProduct) => acc + soldProduct.quantity, 0)}</h3>
        </div>
    );
};

export default Dashboard;