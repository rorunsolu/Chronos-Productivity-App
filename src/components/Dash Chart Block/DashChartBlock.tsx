import { TaskData, UseTasks } from "@/features/Tasks/context/TaskContext";
import { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "@/components/Dash Chart Block/DashChartBlock.scss";

const DashChart = () => {
  const { tasks, fetchTasks } = UseTasks();

  const getTasksCompletedEachMonth = (tasks: TaskData[]) => {
    const completedTasks = tasks.filter((task) => task.completion);
    const currentDate = new Date();

    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
      };
    }).reverse();

    const monthCounts: Record<string, number> = {};
    months.forEach((m) => (monthCounts[m.label] = 0));

    completedTasks.forEach((task) => {
      const taskDate = task.createdAt.toDate();
      const taskLabel = taskDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (monthCounts[taskLabel] !== undefined) {
        monthCounts[taskLabel]++;
      }
    });

    return months.map((m) => ({
      label: m.label,
      count: monthCounts[m.label],
    }));
  };

  const tasksCompletedEachMonth = getTasksCompletedEachMonth(tasks);

  const chartData = tasksCompletedEachMonth.map((month) => ({
    name: month.label,
    tasks: month.count,
  }));

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="dashboard-chart">
      <div className="dashboard-chart__header">
        <h2 className="dashboard-chart__title">Task completed</h2>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 35, right: 60, left: 0, bottom: 75 }}
        >
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="tasks"
            stroke="#47df95"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
          <CartesianGrid stroke="#eee" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashChart;
