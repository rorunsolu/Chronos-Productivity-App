import Dropdown from "@/components/Dropdown/Dropdown";
import { UserAuth } from "@/contexts/authContext/AuthContext";
import { UseProjects } from "@/features/Projects/context/ProjectContext";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "@/pages/Project List Page/ProjectListPage.scss";
import ProjectListCard from "@/features/Projects/Project List Card/ProjectListCard";
import { ArrowDownUp, ArrowUpDown, Search, Plus } from "lucide-react";

const ProjectPage = () => {
   const { user } = UserAuth();
   const { projects, fetchProjects, createProject, deleteProject } = UseProjects();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const openModal = () => setIsModalOpen(true);
   const [projectTitle, setProjectTitle] = useState("");
   const [projectDescription, setProjectDescription] = useState("");
   const [projectLabel, setProjectLabel] = useState("");
   const labelOptions = ["Work", "Personal", "Urgent"];
   const [isNewestFirst, setIsNewestFirst] = useState(true);
   const [searchQuery, setSearchQuery] = useState("");

   const handleCreateProject = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!user) {
         console.error("User is not authenticated.");
         return;
      }

      createProject(projectTitle, projectDescription, projectLabel, user.uid);
      setProjectTitle("");
      setProjectDescription("");
      setProjectLabel("");

      setIsModalOpen(false);
   };

   useEffect(() => {
      fetchProjects();
   }, [fetchProjects]);

   const filteredProjects = projects
      .filter(project => {
         const searchLower = searchQuery.toLowerCase();
         return (
            project.name.toLowerCase().includes(searchLower) ||
            project.status?.toLowerCase().includes(searchLower) ||
            project.label?.toLowerCase().includes(searchLower)
         );
      })
      .sort((a, b) => {
         const dateA = a.createdAt.toDate();
         const dateB = b.createdAt.toDate();
         return isNewestFirst
            ? dateB.getTime() - dateA.getTime()
            : dateA.getTime() - dateB.getTime();
      });

   return (
      <div className="page-wrapper">

         <div className="project-list-page">

            <div className="project-list-page__header">
               <h1 className="project-list-page__title">Projects</h1>
               <p className="project-list-page__subtitle">All your projects in one place</p>
            </div>

            <div className="project-list-page__actions">
               <form className="project-list-page__form">
                  <Search />
                  <input className="project-list-page__form-input" type="text" placeholder="Search projects" onChange={ (e) => setSearchQuery(e.target.value) } />
               </form>

               <button className="project-list-page__button" onClick={ openModal }>
                  <Plus />
               </button>

               <button
                  className="project-list-page__button"
                  onClick={ () => setIsNewestFirst(!isNewestFirst) }
               >
                  { isNewestFirst ? (<ArrowDownUp />) : (<ArrowUpDown />) }
               </button>

            </div>

            <div>
               <ul className="project-list-page__project-list">

                  { filteredProjects.map((project) => (
                     <ProjectListCard project={ project } key={ project.id } deleteProject={ deleteProject } />
                  )) }

               </ul>
            </div>

            <Modal
               isOpen={ isModalOpen }
               onRequestClose={ () => setIsModalOpen(false) }
               contentLabel="Create a new project"
               className={ `modal ${isModalOpen ? "modal--open" : ""}` }
               overlayClassName="modal-overlay"
               appElement={ document.getElementById('root') || undefined }
            >

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

                  <div className="modal__button-wrapper">
                     <button className="modal__button modal__button--create" disabled={ !projectTitle || !projectDescription } type="submit">
                        Create project
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
      </div>
   );
};

export default ProjectPage;