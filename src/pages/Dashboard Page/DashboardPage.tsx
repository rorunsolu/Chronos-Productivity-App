import { UserAuth } from "@/contexts/authContext/AuthContext";
import { UseNotes } from "@/features/Notes/context/NoteContext";
import { UseProjects } from "@/features/Projects/context/ProjectContext";
import { UseTasks } from "@/features/Tasks/context/TaskContext";
import { DatePickerInput } from "@mantine/dates";
import { Timestamp } from "firebase/firestore";
import { Layers, LayoutList, ListTodo, NotebookTabs } from "lucide-react";
import { useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import DashActivityCard from "@/components/Dash Activity Card/DashActivityCard";
import "@/pages/Dashboard Page/DashboardPage.scss";
import "@/components/Creation Modal/CreationModal.scss";
import "@/pages/Dashboard Page/DashboardTasks.scss";
import "@/pages/Dashboard Page/DashboardResults.scss";
import "@/pages/Dashboard Page/DashboardSummary.scss";
import TaskCard from "@/features/Tasks/Task Card/DashTaskCard";
import DashSubHeader from "@/components/Dash Sub Header/DashSubHeader";
import DashChartBlock from "@/components/Dash Chart Block/DashChartBlock";
import DashNoteBlock from "@/features/Notes/Dash Note Block/DashNoteBlock";
import DashProjectBlock from "@/features/Projects/Dash Project Block/DashProjectBlock";
import DashStatCard from "@/components/Dash Stat Card/DashStatCard";

type Activity = {
  id: string;
  title: string;
  creation: Timestamp;
  type: "Project" | "Task" | "Note";
};

const Dashboard = () => {
  const [selectedDateToFilterBy, setSelectedDateToFilterBy] = useState<
    string | null
  >(null);

  const { projects, fetchProjects } = UseProjects();
  const { tasks, fetchTasks } = UseTasks();
  const { notes, fetchNotes } = UseNotes();
  const { user } = UserAuth();

  const allActivity: Activity[] = [
    ...projects.map((project) => ({
      id: project.id,
      title: project.name,
      creation: project.createdAt,
      type: "Project" as const,
    })),
    ...tasks.map((task) => ({
      id: task.id,
      title: task.title,
      creation: task.createdAt,
      type: "Task" as const,
    })),
    ...notes.map((note) => ({
      id: note.id,
      title: note.title,
      creation: note.createdAt,
      type: "Note" as const,
    })),
  ];

  const uncompletedTasks = tasks.filter((task) => !task.completion);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchNotes();
    // eslint-disable-next-line
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

    const taskDueDate = task.dueDate;
    const taskDateStr = taskDueDate;
    const selectedDateStr = selectedDateToFilterBy;

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
                <DashSubHeader title="Activity" count={allActivity.length} />
              </div>

              <div className="dashboard-tasks__bottom">
                <ul className="dashboard-tasks__list">
                  {allActivity.map((activity) => (
                    <DashActivityCard activity={activity} key={activity.id} />
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="dashboard-grid__4">
            <div className="dashboard-results">
              <div className="dashboard-results__top">
                <DashSubHeader title="Tasks" />
                <DatePickerInput
                  placeholder="Pick a date"
                  value={selectedDateToFilterBy}
                  onChange={setSelectedDateToFilterBy}
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
