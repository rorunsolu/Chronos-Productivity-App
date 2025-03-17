import { Layers, Search } from "lucide-react";
import { ListTodo } from "lucide-react";
import { NotebookTabs } from "lucide-react";
import { LayoutList } from 'lucide-react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseNotes } from "@/features/Notes/context/NoteContext";
import { UseProjects } from "@/features/Projects/context/ProjectContext";
import { UseTasks } from "@/features/Tasks/context/TaskContext";
import "./DashboardPage.scss";
import "../../App.css";
import NoteCard from "@/features/Notes/Note Card/NoteCard";
import "@/components/Creation Modal/CreationModal.scss";
import ProjectCard from '@/features/Projects/Project Card/ProjectCard';
import TaskCard from "@/features/Tasks/Task Card/TaskCard";
import { UserAuth } from "@/contexts/authContext/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Timestamp } from 'firebase/firestore';


const Dashboard = () => {

   const navigate = useNavigate();

   const { projects, fetchProjects } = UseProjects();
   const { tasks, fetchTasks } = UseTasks();
   const { notes, fetchNotes } = UseNotes();
   const { user } = UserAuth();
   const [searchQuery, setSearchQuery] = useState("");

   interface Task {
      createdAt: Timestamp;
   }

   const uncompletedTasks = tasks.filter(task => !task.completion);

   const getTasksCreatedEachDay = (tasks: Task[]) => {
      const tasksByDay = tasks.reduce((acc, task) => {
         const taskDate = task.createdAt.toDate(); // Convert Timestamp to Date
         const day = taskDate.toLocaleDateString(); // Get date in 'MM/DD/YYYY' format

         if (!acc[day]) {
            acc[day] = 0;
         }
         acc[day]++;
         return acc;
      }, {} as Record<string, number>);

      return Object.entries(tasksByDay).map(([day, count]) => ({
         day,
         count,
      }));
   };

   const tasksCreatedEachDay = getTasksCreatedEachDay(tasks);

   const chartData = tasksCreatedEachDay.map(day => ({
      name: day.day,
      tasks: day.count,
   }));

   useEffect(() => {
      fetchProjects();
      fetchTasks();
      fetchNotes();
   }, [fetchProjects, fetchTasks, fetchNotes]);

   const summaryData = [
      { icon: <Layers />, title: 'Projects', value: projects.length },
      { icon: <NotebookTabs />, title: 'Notes created', value: notes.length },
      { icon: <ListTodo />, title: 'Tasks', value: tasks.length },
      { icon: <LayoutList />, title: 'Unfinished tasks', value: uncompletedTasks.length },
   ];

   return (
      <div className="flex w-full h-full justify-center items-center mt-16">
         <div className="dashboard">

            <div className="dashboard__header">

               <>
                  <h1 className="dashboard__title">Dashboard</h1>

                  { user ? (
                     <p className="dashboard__subtitle">Welcome back, { user.displayName }</p>
                  ) : "" }
               </>

               <form className="dashboard__form">
                  <Search />
                  <input className="dashboard__form-input" type="text" placeholder="Search for an item"
                     value={ searchQuery }
                     onChange={ (e) => setSearchQuery(e.target.value) } />
               </form>

            </div>

            <div className="dashboard__content">

               <div className="dashboard-summary div1">
                  { summaryData.map((item, index) => (
                     <div key={ index } className="dashboard-summary__item">
                        <div className="dashboard-summary__icon">{ item.icon }</div>
                        <div>
                           <p className="dashboard-summary__title">{ item.title }</p>
                           <p className="dashboard-summary__value">{ item.value }</p>
                        </div>

                     </div>
                  )) }
               </div>

               <div className="dashboard__projects div2 ">
                  <ul className="dashboard-projects__list">
                     <div className="dashboard-projects__list-header">
                        <div className="dashboard-projects__list-title">Projects</div>
                        <div className="dashboard-projects__list-count">{ projects.length }</div>
                     </div>
                     <div className="dashboard-projects__list-content">
                        { projects.map((project) => (
                           <ProjectCard project={ project } key={ project.id } />
                        )) }
                     </div>
                     <button className="dashboard-projects__list-button" onClick={ () => navigate(`/projects`) }>View all</button>
                  </ul>
               </div>

               <div className="dashboard-notes div3 ">
                  <ul className="dashboard-notes__list">
                     <div className="dashboard-notes__list-header">
                        <div className="dashboard-notes__list-title">Notes</div>
                        <div className="dashboard-notes__list-count">{ notes.length }</div>
                     </div>
                     <div className="dashboard-notes__list-content">
                        { notes.map((note) => (
                           <NoteCard note={ note } key={ note.id } />
                        )) }
                     </div>
                     <button className="dashboard-notes__list-button" onClick={ () => navigate(`/notes`) }>View all</button>
                  </ul>
               </div>

               <div className="dashboard-tasks div4 ">
                  <ul className="dashboard-tasks__list">
                     <div className="dashboard-tasks__list-header">
                        <div className="dashboard-tasks__list-title">Tasks</div>
                        <div className="dashboard-tasks__list-count">{ tasks.length }</div>
                     </div>
                     <div className="dashboard-tasks__list-content">
                        { tasks.map((task) => (
                           <TaskCard task={ task } key={ task.id } />
                        )) }
                     </div>

                     <button className="dashboard-tasks__list-button" onClick={ () => navigate(`/tasks`) }>View all</button>

                  </ul>
               </div>

               <div className="dashboard-chart div5">

                  <div className="dashboard-chart__header">
                     <h2 className="dashboard-chart__title">Tasks Overview</h2>
                  </div>

                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart
                        width={ 500 }
                        height={ 300 }
                        data={ chartData }
                        margin={ {
                           top: 25,
                           right: 30,
                           left: 20,
                           bottom: 5,
                        } }
                     >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="tasks" stroke="#47df95" activeDot={ { r: 8 } } />
                     </LineChart>
                  </ResponsiveContainer>

               </div>

            </div>

         </div>

      </div>


   );
};

export default Dashboard;