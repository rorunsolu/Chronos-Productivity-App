import { TaskData, UseTasks } from "@/features/Tasks/context/TaskContext";
import { AreaChart } from "@mantine/charts";
import { useEffect } from "react";
import { SizeMe } from "react-sizeme";
import "@/components/Dash Chart Block/DashChartBlock.scss";

const DashChart = () => {
  const { tasks, fetchTasks } = UseTasks();

  const getTasksCompletedEachMonth = (tasks: TaskData[]) => {
    const completedTasks = tasks.filter((task) => task.completion);
    const currentDate = new Date();

    const months = Array.from({ length: 8 }, (_, i) => {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleDateString("en-UK", {
          month: "short",
          year: "2-digit",
        }),
      };
    }).reverse();

    const monthCounts: Record<string, number> = {};
    months.forEach((m) => (monthCounts[m.label] = 0));

    completedTasks.forEach((task) => {
      const taskDate = task.createdAt.toDate();
      const taskLabel = taskDate.toLocaleDateString("en-UK", {
        month: "short",
        year: "2-digit",
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
    Tasks: month.count,
  }));

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="dashboard-chart">
      <div className="dashboard-chart__header">
        <h2 className="dashboard-chart__title">Completed tasks</h2>
      </div>

      <div className="flex justify-center items-center">
        <SizeMe>
          {({ size }) => (
            <AreaChart
              h={size.height || 325}
              data={chartData}
              dataKey="name"
              series={[{ name: "Tasks", color: "teal.6" }]}
              curveType="linear"
              tickLine="xy"
              gridAxis="xy"
              ml={20}
              mt={25}
              mr={20}
              withYAxis={false}
            />
          )}
        </SizeMe>
      </div>
    </div>
  );
};

export default DashChart;
