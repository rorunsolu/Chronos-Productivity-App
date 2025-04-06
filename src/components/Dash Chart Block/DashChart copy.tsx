import { UseTasks } from "@/features/Tasks/context/TaskContext";
import { Timestamp } from "firebase/firestore";
import { useEffect } from "react";
//import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "@/pages/Dashboard Page/DashboardChart.scss";

const DashChart = () => {
    const { tasks, fetchTasks } = UseTasks();

    const getTasksCreatedEachDay = (tasks: Task[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6); // 7 days range (inclusive)

        // Initialize date range with zeros
        const dateRange: Record<string, number> = {};
        const currentDate = new Date(sevenDaysAgo);
        while (currentDate <= today) {
            const dayKey = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
            dateRange[dayKey] = 0;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Count tasks within the date range
        tasks.forEach(task => {
            const taskDate = task.createdAt.toDate();
            const taskDay = taskDate.toISOString().split('T')[0];
            if (Object.prototype.hasOwnProperty.call(dateRange, taskDay)) {
                dateRange[taskDay]++;
            }
        });

        // Convert to array and sort by date
        return Object.entries(dateRange)
            .map(([day, count]) => ({ day, count }))
            .sort((a, b) => a.day.localeCompare(b.day));
    };

    const tasksCreatedEachDay = getTasksCreatedEachDay(tasks);

    const chartData = tasksCreatedEachDay.map(day => ({
        name: day.day,
        tasks: day.count,
    }));

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return (

        <div className="dashboard-chart">

            <div className="dashboard-chart__header">
                <h2 className="dashboard-chart__title">Tasks Overview</h2>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={ 200 }
                    height={ 200 }
                    data={ chartData }
                    margin={ { top: 25, right: 30, left: 20, bottom: 5 } }
                >

                    <XAxis
                        dataKey="name"
                        tickFormatter={ (dateStr) => {
                            const date = new Date(dateStr);
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        } }
                    />
                    <YAxis />
                    <Tooltip
                        labelFormatter={ (dateStr) => {
                            const date = new Date(dateStr);
                            return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                        } }
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="tasks"
                        stroke="#47df95"
                        strokeWidth={ 2.5 }
                        activeDot={ { r: 6 } }
                    />
                    <CartesianGrid stroke="#ccc" />
                </LineChart>
            </ResponsiveContainer>

        </div>





    );
};

export default DashChart;

interface Task {
    createdAt: Timestamp;
}