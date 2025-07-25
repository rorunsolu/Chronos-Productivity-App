import { UserAuth } from "@/contexts/authContext/AuthContext";
import { UseProjects } from "@/features/Projects/context/ProjectContext";
import { Stack, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "@/pages/Project List Page/ProjectListPage.scss";
import ProjectListCard from "@/features/Projects/Project List Card/ProjectListCard";
import SearchBar from "@/components/Search Bar/SearchBar";
import AddButton from "@/components/Add Button/AddButton";
import SortToggleButton from "@/components/Sort Toggle Button/SortToggleButton";
import InputHeader from "@/components/Input Header/InputHeader";

const ProjectPage = () => {
  const { user } = UserAuth();
  const openModal = () => setIsModalOpen(true);
  const { projects, fetchProjects, createProject, deleteProject } =
    UseProjects();

  const [projectTitle, setProjectTitle] = useState("");
  const [projectLabel, setProjectLabel] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [isNewestFirst, setIsNewestFirst] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  const handleCreateProject = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    createProject(projectTitle, projectDescription, projectLabel);
    setProjectTitle("");
    setProjectDescription("");
    setProjectLabel("");

    setIsModalOpen(false);
  };

  const filteredProjects = projects
    .filter((project) => {
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
          <p className="project-list-page__subtitle">
            All your projects in one place
          </p>
        </div>

        <div className="project-list-page__actions">
          <SearchBar
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="project-list-page__actions-buttons">
            <SortToggleButton
              isNewestFirst={isNewestFirst}
              onToggle={() => setIsNewestFirst(!isNewestFirst)}
            />

            <AddButton onClick={openModal} />
          </div>
        </div>

        <ul className="project-list-page__list">
          {filteredProjects.map((project) => (
            <ProjectListCard
              project={project}
              key={project.id}
              deleteProject={deleteProject}
            />
          ))}
        </ul>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Create a new project"
          className={`modal ${isModalOpen ? "modal--open" : ""}`}
          overlayClassName="modal-overlay"
          appElement={document.getElementById("root") || undefined}
        >
          <p className="modal__title">Create a project</p>

          <form className="modal__form" onSubmit={handleCreateProject}>
            <div className="modal__info-wrapper">
              <Stack gap="sm">
                <Stack gap={2}>
                  <InputHeader label="Title" />
                  <TextInput
                    withAsterisk
                    placeholder="Title"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                  />
                </Stack>

                <Stack gap={2}>
                  <InputHeader label="Description" />
                  <TextInput
                    placeholder="Description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                  />
                </Stack>
              </Stack>

              <div className="modal__button-wrapper">
                <button
                  className="modal__button modal__button--create"
                  disabled={!projectTitle}
                  type="submit"
                >
                  Create Project
                </button>

                <button
                  className="modal__button modal__button--cancel"
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ProjectPage;
