import { UserAuth } from "@/contexts/authContext/AuthContext";
import { UseNotes } from "@/features/Notes/context/NoteContext";
import { UseProjects } from "@/features/Projects/context/ProjectContext";
import { UseTasks } from "@/features/Tasks/context/TaskContext";
import { Timestamp } from "firebase/firestore";
import { Layers, LayoutList, ListTodo, NotebookTabs } from "lucide-react";
import { useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import "@/pages/Dashboard Page/DashboardPage.scss";
import "@/components/Creation Modal/CreationModal.scss";
import "@/pages/Dashboard Page/DashboardTasks.scss";
import "@/pages/Dashboard Page/DashboardResults.scss";
import "@/pages/Dashboard Page/DashboardSummary.scss";
import TaskCard from "@/features/Tasks/Task Card/DashTaskCard";
import DashSubHeader from "@/components/Dash Sub Header/DashSubHeader";
import DashChartBlock from "@/components/Dash Chart Block/DashChartBlock";
import DateTimePickerCompo from "@/components/Date Time Picker Compo/DateTimePickerCompo";
import DashNoteBlock from "@/features/Notes/Dash Note Block/DashNoteBlock";
import DashProjectBlock from "@/features/Projects/Dash Project Block/DashProjectBlock";
import DashStatCard from "@/components/Dash Stat Card/DashStatCard";

const Dashboard = () => {
  const [selectedDateToFilterBy, setSelectedDateToFilterBy] =
    useState<Date | null>(null);

  const { projects, fetchProjects } = UseProjects();
  const { tasks, fetchTasks } = UseTasks();
  const { notes, fetchNotes } = UseNotes();
  const { user } = UserAuth();

  const uncompletedTasks = tasks.filter((task) => !task.completion);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchNotes();
  }, []);

  const summaryData = [
    { icon: <Layers />, title: "Projects", value: projects.length },
    { icon: <NotebookTabs />, title: "Notes created", value: notes.length },
    { icon: <ListTodo />, title: "Tasks", value: tasks.length },
    {
      icon: <LayoutList />,
      title: "Unfinished tasks",
      value: uncompletedTasks.length,
    },
  ];

  const tasksDueOnDate = tasks.filter((task) => {
    if (!selectedDateToFilterBy || !task.dueDate) return false;

    const taskDueDate =
      task.dueDate instanceof Timestamp ? task.dueDate.toDate() : task.dueDate;

    const taskDateStr = taskDueDate.toLocaleDateString("en-GB");
    const selectedDateStr = selectedDateToFilterBy.toLocaleDateString("en-GB");

    return taskDateStr === selectedDateStr;
  });

  return (
    <div className="page-wrapper--dashboard">
      <div className="dashboard">
        <div className="dashboard-grid">
          <section className="dashboard-grid__1">
            <div className="dashboard__header">
              <h1 className="dashboard__title">Dashboard</h1>
              {user?.displayName && (
                <p className="dashboard__subtitle">
                  Welcome back, {user.displayName}
                </p>
              )}
            </div>

            <div className="dashboard-summary">
              {summaryData.map((card, index) => (
                <DashStatCard card={card} key={index} />
              ))}
            </div>
          </section>

          <section className="dashboard-grid__2">
            <DashProjectBlock />

            <DashNoteBlock />
          </section>

          <section className="dashboard-grid__3">
            <div className="dashboard-tasks">
              <div className="dashboard-tasks__top">
                <DashSubHeader title="Activity" count={tasks.length} />
              </div>

              <div className="dashboard-tasks__bottom">
                <ul className="dashboard-tasks__list">
                  {tasks.map((task) => (
                    <TaskCard task={task} key={task.id} />
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="dashboard-grid__4">
            <div className="dashboard-results">
              <div className="dashboard-results__top">
                <DashSubHeader title="Tasks" />
                <DateTimePickerCompo
                  selected={selectedDateToFilterBy}
                  onChange={(date) => setSelectedDateToFilterBy(date)}
                />
              </div>

              <ul className="dashboard-results__list">
                {(selectedDateToFilterBy ? tasksDueOnDate : tasks).map(
                  (task) => (
                    <TaskCard task={task} key={task.id} />
                  )
                )}
              </ul>
            </div>

            <DashChartBlock />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
