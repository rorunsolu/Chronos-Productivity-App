import "@/pages/Project Editing Page/ProjectEditingPage.scss";
import { useEffect, useState } from "react";
import { TaskStatus } from "@/features/Tasks/context/TaskContext";
import { UseProjects } from "@/features/Projects/context/ProjectContext";
import { useParams } from "react-router-dom";

const ProjectEditingPage = () => {

   const { id } = useParams<{ id: string; }>(); // Get the  id from the URL
   const [projectName, setProjectName] = useState<string>("");

   const TaskData = [
      { id: "1", title: "Task 1", status: "pending" as TaskStatus },
      { id: "2", title: "Task 2", status: "in-progress" as TaskStatus },
      { id: "3", title: "Task 3", status: "completed" as TaskStatus },
   ];

   const { projects, fetchProjects } = UseProjects();

   useEffect(() => {
      fetchProjects();
   }, [fetchProjects]);

   useEffect(() => {
      const project = projects.find(project => project.id === id);
      if (project) {
         setProjectName(project.name || ""); // Provide a default value
      }
   }, [id, projects]);

   const getTasksByStatus = (status: TaskStatus) =>
      TaskData.filter(task => task.status === status);

   return (
      <div className="section">
         <div className="project-editing-page">

            <header className="project-editing-page">
               <h1 className="project-editing-page__title">{ projectName }</h1>
            </header>

            <div className="project-editing-page__kanban">
               { ["pending", "in-progress", "completed"].map((status) => (
                  <div key={ status } className={ `kanban-column kanban-column--${status}` }>
                     <div className="kanban-column__header">
                        <h3 className="kanban-column__title">{ status }</h3>
                        <span className="kanban-column__count">{ getTasksByStatus(status as TaskStatus).length }</span>
                     </div>
                     <div className="kanban-column__list">
                        {/* { getTasksByStatus(status as TaskStatus).map(task => (
                           <TaskCard key={ task.id } task={ task } />
                        )) } */}
                     </div>
                  </div>
               )) }
            </div>

         </div>
      </div>
   );
};

export default ProjectEditingPage;
