import { UserAuth } from "@/contexts/authContext/AuthContext";
import { TaskStatus } from "@/features/Tasks/context/TaskContext";
import { UseTasks } from "@/features/Tasks/context/TaskContext";
import { db } from "@/firebase/firebase";
import { DatePickerInput } from "@mantine/dates";
import { doc, setDoc } from "firebase/firestore";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import {
  ProjectData,
  UseProjects,
} from "@/features/Projects/context/ProjectContext";
import "@/pages/Project Edit Page/ProjectEditPage.scss";
import ProjectTaskCard from "@/features/Projects/Project Task Card/ProjectTaskCard";
import "@/components/Kanban Column/KanbanColumn.scss";

const ProjectEditPage = () => {
  const { user } = UserAuth();
  const { id } = useParams<{ id: string }>();
  const { projects, fetchProjects } = UseProjects();
  const { tasks, fetchTasks, createTask } = UseTasks();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskLabel, setTaskLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [taskContent, setTaskContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>();
  const [projectName, setProjectName] = useState<string>("");
  const [taskDueDate, setTaskDueDate] = useState<string | null>(null);
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [initialProject, setInitialProject] = useState<ProjectData | null>(
    null
  );

  const [taskProjectAssignment, setTaskProjectAssignment] =
    useState<string>(projectName);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const currentProject = projects.find((project) => project.id === id);

  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name || "");
      setProjectDescription(currentProject.description || "");
      setTaskProjectAssignment(currentProject.id || "");
      setInitialProject(currentProject);
    }
  }, [currentProject]);

  const updateProjectInFirebase = useCallback(
    async (newName: string, newDescription: string) => {
      try {
        if (!id || !user) return;

        await setDoc(
          doc(db, "projects", id),
          {
            name: newName,
            description: newDescription,
            userId: user.uid,
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error updating project:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [id, user]
  );

  useEffect(() => {
    if (!initialProject) return;

    const hasChanged =
      (projectName.trim() !== "" && projectName !== initialProject.name) ||
      (projectDescription.trim() !== "" &&
        projectDescription !== initialProject.description);

    if (!hasChanged) return;

    setIsLoading(true);

    const saveTimeout = setTimeout(() => {
      updateProjectInFirebase(projectName, projectDescription);
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [
    projectName,
    projectDescription,
    initialProject,
    updateProjectInFirebase,
  ]);

  const getTasksByStatus = (status: TaskStatus) => {
    if (!currentProject) return [];
    return tasks.filter(
      (task) => currentProject.tasks.includes(task.id) && task.status === status
    );
  };

  const handlecreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    await createTask(
      taskTitle,
      taskContent,
      taskDueDate,
      taskLabel,
      taskStatus,
      taskProjectAssignment
    );

    fetchProjects();
    fetchTasks();

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
      <div className="project-edit-page">
        <div className="project-edit-page__header">
          <input
            className="project-edit-page__title"
            onChange={(e) => setProjectName(e.target.value)}
            value={projectName}
            type="text"
            placeholder="Project Name"
          />
          <TextareaAutosize
            className="project-edit-page__description"
            onChange={(e) => setProjectDescription(e.target.value)}
            value={projectDescription}
            placeholder="Description"
            minRows={1}
            maxRows={3}
            style={{ resize: "none" }}
          />
          {isLoading && <div className="loading-indicator">Saving...</div>}
        </div>

        <div className="project-edit-page__kanban">
          {(["Pending", "Ongoing", "Completed"] as TaskStatus[]).map(
            (status) => (
              <div
                key={status}
                className={`kanban-column kanban-column--${status}`}
              >
                <div className="kanban-column__header">
                  <h3 className="kanban-column__title">{status}</h3>

                  <span className="kanban-column__count">
                    {getTasksByStatus(status).length}
                  </span>
                </div>

                <button
                  className="kanban-column__add-task"
                  onClick={() => openModal(status)}
                  type="button"
                >
                  <Plus /> Add task
                </button>

                <div className="kanban-column__list">
                  {getTasksByStatus(status).map((task) => (
                    <ProjectTaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Create a new note"
        className={`modal ${isModalOpen ? "modal--open" : ""}`}
        overlayClassName="modal-overlay"
        appElement={document.getElementById("root") || undefined}
      >
        <p className="modal__title">Create a task</p>

        <form className="modal__form" onSubmit={handlecreateTask}>
          <div className="modal__info-wrapper">
            <div className="modal__input-group">
              <input
                className="modal__input"
                onChange={(e) => setTaskTitle(e.target.value)}
                value={taskTitle}
                type="text"
                placeholder="Title"
              />
            </div>

            <div className="modal__input-group">
              <textarea
                className="modal__textarea"
                onChange={(e) => setTaskContent(e.target.value)}
                value={taskContent}
                placeholder="Description"
              />
            </div>

            <div className="modal__input-group">
              <DatePickerInput
                placeholder="Pick date"
                value={taskDueDate}
                onChange={setTaskDueDate}
              />
            </div>
          </div>

          <div className="modal__button-wrapper">
            <button
              className="modal__button modal__button--create"
              disabled={!taskTitle}
              type="submit"
            >
              Create task
            </button>
            <button
              className="modal__button modal__button--cancel"
              onClick={() => setIsModalOpen(false)}
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

export default ProjectEditPage;
