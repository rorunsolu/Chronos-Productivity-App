import Dropdown from "@/components/Dropdown/Dropdown";
import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import { UseProjects } from "@/features/Projects/context/ProjectContext";
import "@/pages/Project List Page/ProjectListPage.scss";
import ProjectListCard from "@/features/Projects/Project List Card/ProjectListCard";
import {
   ArrowDownUp,
   EllipsisVertical,
   ListFilter,
   Plus,
   Search,
} from "lucide-react";


const ProjectPage = () => {
   const { projects, fetchProjects, createProject, deleteProject } = UseProjects();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const openModal = () => setIsModalOpen(true);
   const [projectTitle, setProjectTitle] = useState("");
   const [projectDescription, setProjectDescription] = useState("");
   const [projectLabel, setProjectLabel] = useState("");
   const [projectPriority, setProjectPriority] = useState("");
   const priorityOptions = ["Low", "Medium", "High"];
   const labelOptions = ["Work", "Personal", "Urgent"];

   const handleCreateProject = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      createProject(projectTitle, projectDescription, projectLabel, projectPriority);
      setProjectTitle("");
      setProjectDescription("");
      setProjectLabel("");
      setProjectPriority("");

      setIsModalOpen(false);
   };

   useEffect(() => {
      fetchProjects();
   }, [fetchProjects]);

   return (
      <div className="flex w-full h-full justify-center items-center mt-16">

         <div className="project-list-page">
            
            <div className="project-list-page__header">
               <h1 className="project-list-page__title">Projects</h1>
               <p className="project-list-page__subtitle">All your projects in one place</p>
            </div>

            <div className="project-list-page__actions">
               <form className="project-list-page__form">
                  <Search />
                  <input className="project-list-page__form-input" type="text" placeholder="Search projects" />
               </form>

               <button className="project-list-page__button" onClick={ () => console.log("Filter button clicked") }>
                  <ListFilter />
               </button>

               <button className="project-list-page__button" onClick={ openModal }>
                  <Plus />
               </button>

               <button className="project-list-page__button">
                  <EllipsisVertical />
               </button>

            </div>

            <div>
               <ul className="project-list-page__project-list">

                  { projects.map((project) => (
                     <ProjectListCard project={ project } key={ project.id } />
                  )) }

               </ul>
            </div>

            <Modal
               isOpen={ isModalOpen }
               onRequestClose={ () => setIsModalOpen(false) }
               contentLabel="Create a new project"
               className="modal"
               overlayClassName="modal-overlay"
               appElement={ document.getElementById('root') || undefined }>

               <p className="modal__title">Create a new project</p>
               <form className="modal__form" onSubmit={ handleCreateProject }>

                  <input
                     className="modal__input"
                     onChange={ (e) => setProjectTitle(e.target.value) }
                     value={ projectTitle }
                     type="text"
                     placeholder="Title"
                  />
                  <textarea
                     className="modal__textarea"
                     onChange={ (e) => setProjectDescription(e.target.value) }
                     value={ projectDescription }
                     placeholder="Description"
                  />

                  <Dropdown value={ projectLabel } onChange={ setProjectLabel } options={ labelOptions } placeholder="Select a label" />

                  <Dropdown value={ projectPriority } onChange={ setProjectPriority } options={ priorityOptions } placeholder="Select a priority" />

                  <div className="modal__button-wrapper">
                     <button className="modal__button" disabled={ !projectTitle || !projectDescription } type="submit">
                        Create project
                     </button>

                     <button
                        className="modal__button"
                        onClick={ () => setIsModalOpen(false) }
                        type="button"
                     >
                        Cancel
                     </button>
                  </div>

               </form>
            </Modal>

         </div>
      </div>
   );
};

export default ProjectPage;