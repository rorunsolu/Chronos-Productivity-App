import { UseProjects } from "@/features/Projects/context/ProjectContext";
import { TaskStatus } from "@/features/Tasks/context/TaskContext";
import { UseTasks } from "@/features/Tasks/context/TaskContext";
import { UserAuth } from "@/contexts/authContext/AuthContext";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useParams } from "react-router-dom";
import "@/pages/Project Editing Page/ProjectEditingPage.scss";
import ProjectTaskCard from "@/features/Projects/Project Task Card/ProjectTaskCard";
import "@/components/Kanban Column/KanbanColumn.scss";
import DateTimePickerCompo from "@/components/Date Time Picker Compo/DateTimePickerCompo";

const ProjectEditingPage = () => {

   const { user } = UserAuth();

   const [isModalOpen, setIsModalOpen] = useState(false);
   const { id } = useParams<{ id: string; }>();
   const [projectName, setProjectName] = useState<string>("");

   const { projects, fetchProjects } = UseProjects();
   const { tasks, fetchTasks, createTask } = UseTasks();

   const [taskTitle, setTaskTitle] = useState("");
   const [taskContent, setTaskContent] = useState("");
   const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
   const [taskLabel, setTaskLabel] = useState("");
   const [taskStatus, setTaskStatus] = useState<TaskStatus>();
   const [taskProjectAssignment, setTaskProjectAssignment] = useState<string>(projectName);

   useEffect(() => {
      fetchProjects();
      fetchTasks();
   }, [fetchProjects, fetchTasks]);

   const currentProject = projects.find(project => project.id === id);

   useEffect(() => {
      if (currentProject) {
         setProjectName(currentProject.name || "");
         setTaskProjectAssignment(currentProject.id || "");
      }
   }, [currentProject]);

   const getTasksByStatus = (status: TaskStatus) => {
      if (!currentProject) return [];
      return tasks.filter(task =>
         currentProject.tasks.includes(task.id) &&
         task.status === status,
      );
   };

   const handlecreateTask = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!user) {
         console.error("User is not authenticated.");
         return;
      }

      createTask(taskTitle, taskContent, taskDueDate, taskLabel, taskStatus, taskProjectAssignment, user.uid);
      setTaskTitle("");
      setTaskContent("");
      setTaskDueDate(null);
      setTaskLabel("");
      setIsModalOpen(false);
   };

   const openModal = (status: TaskStatus) => {
      setTaskStatus(status);
      setIsModalOpen(true);
   };

   return (
      <div className="page-wrapper">
         <div className="project-editing-page">
            <header className="project-editing-page__header">
               <h1 className="project-editing-page__title">{ projectName }</h1>
            </header>

            <div className="project-editing-page__kanban">

               { (["pending", "ongoing", "completed"] as TaskStatus[]).map((status) => (

                  <div key={ status } className={ `kanban-column kanban-column--${status}` }>

                     <div className="kanban-column__header">

                        <h3 className="kanban-column__title">{ status }</h3>

                        <span className="kanban-column__count">
                           { getTasksByStatus(status).length }
                        </span>

                     </div>

                     <button className="kanban-column__add-task"
                        onClick={ () => openModal(status) }
                        type="button"
                     >
                        <Plus /> Add task</button>

                     <div className="kanban-column__list">
                        { getTasksByStatus(status).map((task) => (
                           <ProjectTaskCard key={ task.id } task={ task } />
                        )) }
                     </div>

                  </div>
               )) }
            </div>
         </div>

         <Modal
            isOpen={ isModalOpen }
            onRequestClose={ () => setIsModalOpen(false) }
            contentLabel="Create a new note"
            className={ `modal ${isModalOpen ? "modal--open" : ""}` }
            overlayClassName="modal-overlay"
            appElement={ document.getElementById('root') || undefined }>

            <p className="modal__title">Create a task</p>

            <form className="modal__form" onSubmit={ handlecreateTask }>

               <div className="modal__input-group">
                  <input
                     className="modal__input"
                     onChange={ (e) => setTaskTitle(e.target.value) }
                     value={ taskTitle }
                     type="text"
                     placeholder="Title"
                  />
               </div>

               <div className="modal__input-group">
                  <textarea
                     className="modal__textarea"
                     onChange={ (e) => setTaskContent(e.target.value) }
                     value={ taskContent }
                     placeholder="Content"
                  />
               </div>

               <div className="modal__input-group">
                  <DateTimePickerCompo
                     value={ taskDueDate }
                     onChange={ (date) => setTaskDueDate(date) }
                  />
               </div>

               <div className="modal__input-group">
                  <input
                     className="modal__input"
                     onChange={ (e) => setTaskProjectAssignment(e.target.value) }
                     value={ currentProject?.id }
                     type="text"
                     placeholder="Title"
                  />
               </div>

               <div className="modal__button-wrapper">
                  <button className="modal__button modal__button--create" disabled={ !taskTitle } type="submit">
                     Create task
                  </button>
                  <button
                     className="modal__button modal__button--cancel"
                     onClick={ () => setIsModalOpen(false) }
                     type="button"
                  >
                     Cancel
                  </button>
               </div>


            </form>

         </Modal>

      </div>
   );
};

export default ProjectEditingPage;