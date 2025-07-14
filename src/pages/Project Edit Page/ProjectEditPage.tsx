import ButtonModal from "@/components/Buttons/ButtonModal";
import ButtonReg from "@/components/Buttons/ButtonReg";
import { UserAuth } from "@/contexts/authContext/AuthContext";
import { TaskStatus } from "@/features/Tasks/context/TaskContext";
import { UseTasks } from "@/features/Tasks/context/TaskContext";
import { db } from "@/firebase/firebase";
import { Divider, Select, Stack, Textarea, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { doc, setDoc } from "firebase/firestore";
import { NotepadText, Plus, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import { useParams } from "react-router-dom";
import InputHeader from "@/components/Input Header/InputHeader";
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
  const [projectStatus, setProjectStatus] = useState<string | null>("Pending");
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
      setProjectStatus(currentProject.status || "Pending");
      setTaskProjectAssignment(currentProject.id || "");
      setInitialProject(currentProject);
    }
  }, [currentProject]);

  const updateProjectInFirebase = useCallback(
    async (
      newName: string,
      newDescription: string,
      newStatus?: string | null
    ) => {
      try {
        if (!id || !user) return;

        await setDoc(
          doc(db, "projects", id),
          {
            name: newName,
            description: newDescription,
            status: newStatus,
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
        projectDescription !== initialProject.description) ||
      projectStatus !== initialProject.status;

    if (!hasChanged) return;

    setIsLoading(true);

    const saveTimeout = setTimeout(() => {
      updateProjectInFirebase(projectName, projectDescription, projectStatus);
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [
    projectName,
    projectDescription,
    projectStatus,
    initialProject,
    updateProjectInFirebase,
  ]);

  const getTasksByStatus = (status: TaskStatus) => {
    if (!currentProject) return [];
    return tasks.filter(
      (task) => currentProject.tasks.includes(task.id) && task.status === status
    );
  };

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
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
          <TextInput
            variant="unstyled"
            size="xl"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <Stack gap="xs" mt="sm">
            <Stack gap={2}>
              <InputHeader
                label="Description"
                icon={<NotepadText size={16} />}
              />
              <Textarea
                value={projectDescription}
                placeholder="Description"
                onChange={(e) => setProjectDescription(e.target.value)}
                minRows={1}
                maxRows={3}
              />
            </Stack>

            <Stack gap={2} w="fit-content">
              <InputHeader label="Status" icon={<TrendingUp size={16} />} />
              <Select
                placeholder="Select status"
                data={["Pending", "Ongoing", "Completed"]}
                defaultValue={"Pending"}
                value={projectStatus}
                onChange={(value: string | null) => {
                  setProjectStatus(value);
                }}
                checkIconPosition="right"
              />
            </Stack>
          </Stack>

          {isLoading && <div className="loading-indicator">Saving...</div>}
        </div>

        <Divider my="xl" />

        <div className="project-edit-page__kanban">
          {(["Pending", "Ongoing", "Completed"] as TaskStatus[]).map(
            (status) => (
              <div
                key={status}
                className={`kanban-column kanban-column--${status}`}
              >
                <Stack
                  gap={0}
                  className="
                  flex
                  justify-between
                  items-center
                  border
                  rounded-lg
                  mb-5
                  px-[14px]
                  py-[10px]
                  shadow
                  "
                  style={{
                    border: "var(--primary-border)",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  <div className="kanban-column__header">
                    <h3 className="kanban-column__title">{status}</h3>
                    <span className="kanban-column__count">
                      {getTasksByStatus(status).length}
                    </span>
                  </div>
                  <ButtonReg
                    type="secondary"
                    onClick={() => openModal(status)}
                    icon={<Plus />}
                  />
                </Stack>

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

        <form className="modal__form" onSubmit={handleCreateTask}>
          <div className="modal__info-wrapper">
            <Stack gap="sm">
              <Stack gap={2}>
                <InputHeader label="Title" />
                <TextInput
                  withAsterisk
                  placeholder="Title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </Stack>

              <Stack gap={2}>
                <InputHeader label="Description" />
                <Textarea
                  placeholder="Description"
                  value={taskContent}
                  onChange={(e) => setTaskContent(e.target.value)}
                  minRows={2}
                />
              </Stack>

              <Stack gap={2}>
                <InputHeader label="Due Date" />
                <DatePickerInput
                  placeholder="Pick date"
                  value={taskDueDate}
                  onChange={setTaskDueDate}
                />
              </Stack>
            </Stack>

            <div className="modal__button-wrapper">
              <ButtonModal disabledCondition={taskTitle} type="submit" />
              <ButtonModal
                type="button"
                onClick={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectEditPage;
