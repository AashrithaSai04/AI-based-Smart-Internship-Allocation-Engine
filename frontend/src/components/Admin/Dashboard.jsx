import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { getAdminDashboardStats } from '../../api/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await getAdminDashboardStats();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
        }
    };

    if (!stats) return <div>Loading...</div>;

    const chartData = {
        labels: ['Total Internships', 'Filled Positions'],
        datasets: [{
            label: 'Internship Capacity',
            data: [stats.totalInternships, stats.filledPositions],
            backgroundColor: ['#42A5F5', '#66BB6A']
        }]
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Total Students: {stats.totalStudents}</p>
            <div style={{ width: '500px' }}>
                <Bar data={chartData} />
            </div>
            {/* Other stats and progress bars can be added here */}
        </div>
    );
};

export default AdminDashboard;
