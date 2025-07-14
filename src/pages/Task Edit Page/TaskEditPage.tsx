import { UserAuth } from "@/contexts/authContext/AuthContext";
import { UseProjects } from "@/features/Projects/context/ProjectContext";
import { TaskData, TaskStatus } from "@/features/Tasks/context/TaskContext";
import { db } from "@/firebase/firebase";
import { DatePickerInput } from "@mantine/dates";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Calendar, Layers, NotepadText, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Notification,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import "@/pages/Task Edit Page/TaskEditPage.scss";
import InputHeader from "@/components/Input Header/InputHeader";

const TaskEditPage = () => {
  const { user } = UserAuth();
  const { id } = useParams<{ id: string }>();
  const { projects, fetchProjects, addTaskToProject, removeTaskFromProject } =
    UseProjects();

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [task, setTask] = useState<TaskData>();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskContent, setTaskContent] = useState("");
  const [taskLabel, setTaskLabel] = useState("");
  const [taskDueDate, setTaskDueDate] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("Pending");
  const [taskProjectAssignment, setTaskProjectAssignment] =
    useState<string>("");

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    const fetchTask = async () => {
      try {
        if (!id || !user) {
          setIsLoading(false);
          return;
        }

        const taskRef = doc(db, "tasks", id);
        const taskSnapshot = await getDoc(taskRef);

        if (!taskSnapshot.exists()) {
          setIsLoading(false);
          throw new Error("Task does not exist");
        }

        const taskdata = taskSnapshot.data();
        if (taskdata.userId !== user.uid) {
          setIsLoading(false);
          throw new Error("Unauthorized access attempt");
        }

        const taskObjectdata = taskSnapshot.data();
        setTaskTitle(taskObjectdata.title);
        setTaskContent(taskObjectdata.content);
        setTaskProjectAssignment(taskObjectdata.projectId);
        setTaskStatus(taskObjectdata.status);
        setTaskDueDate(taskObjectdata.dueDate || null);
        setTaskLabel(taskObjectdata.label);
        setTask(taskObjectdata as TaskData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [id, user, isInitialLoad]);

  const statusOptions = ["Pending", "Ongoing", "Completed"] as TaskStatus[];

  const projectOptions = useMemo(
    () =>
      projects.map((project) => ({ value: project.id, label: project.name })),
    [projects]
  );

  const updateTaskFields = useCallback(
    async (
      newTitle: string,
      newContent?: string,
      newDueDate?: string | null,
      newLabel?: string,
      newStatus?: TaskStatus
    ) => {
      if (!id || !user) return;

      try {
        await setDoc(
          doc(db, "tasks", id),
          {
            title: newTitle,
            content: newContent || "",
            label: newLabel || "",
            dueDate: newDueDate || "",
            status: newStatus || "pending",
          },
          { merge: true }
        );
      } finally {
        setIsLoading(false);
      }
    },
    [id, user]
  );

  const handleProjectChange = useCallback(
    async (newProjectId: string) => {
      try {
        if (!id || !user) {
          throw new Error("User is not authenticated or task ID is missing");
        }

        if (task?.projectId) {
          removeTaskFromProject(task.projectId, id);
        }

        await setDoc(
          doc(db, "tasks", id),
          {
            projectId: newProjectId || null,
            userId: user.uid,
          },
          { merge: true }
        );

        addTaskToProject(newProjectId || "", id);

        setTask((prev) => (prev ? { ...prev, projectId: newProjectId } : prev));
      } catch (error) {
        setTaskProjectAssignment(task?.projectId || "");
        throw new Error(`Error changing project: ${error}`);
      }
    },
    [id, user, task, removeTaskFromProject, addTaskToProject]
  );

  useEffect(() => {
    const hasFieldChanged =
      taskTitle !== task?.title ||
      taskContent !== task?.content ||
      taskStatus !== task?.status ||
      taskLabel !== task?.label ||
      taskDueDate !== task?.dueDate;

    if (!hasFieldChanged) return;

    setIsLoading(true);

    const timeout = setTimeout(() => {
      updateTaskFields(
        taskTitle,
        taskContent,
        taskDueDate,
        taskLabel,
        taskStatus
      );
    }, 1000);

    return () => clearTimeout(timeout);
  }, [
    taskTitle,
    taskContent,
    taskDueDate,
    taskLabel,
    taskStatus,
    updateTaskFields,
    task,
  ]);

  useEffect(() => {
    if (taskProjectAssignment === task?.projectId) return;

    const timeout = setTimeout(() => {
      handleProjectChange(taskProjectAssignment);
    }, 1000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [taskProjectAssignment, task?.projectId]);

  return (
    <div className="page-wrapper">
      <div className="task-edit-page">
        <header className="task-edit-page__header">
          <TextInput
            placeholder="Title"
            variant="unstyled"
            size="xl"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </header>

        <Stack gap={16}>
          <Stack gap={2}>
            <InputHeader label="Description" icon={<NotepadText size={16} />} />
            <Textarea
              size="sm"
              autosize
              minRows={2}
              maxRows={8}
              variant="default"
              placeholder="Description"
              value={taskContent}
              onChange={(e) => setTaskContent(e.target.value)}
            />
          </Stack>

          <Stack gap={2} w="fit-content">
            <InputHeader label="Project" icon={<Layers size={16} />} />
            <Select
              placeholder="Select a project"
              data={projectOptions}
              checkIconPosition="right"
              value={taskProjectAssignment || ""}
              clearable
              onChange={(value) => {
                // Match by VALUE (ID), not LABEL
                const selectedProject = projects.find(
                  (project) => project.id === value
                );
                setTaskProjectAssignment(selectedProject?.id || "");
              }}
            />
          </Stack>

          {taskProjectAssignment && (
            <Stack gap={2} w="fit-content">
              <InputHeader label="Status" icon={<TrendingUp size={16} />} />
              <Select
                data={statusOptions}
                checkIconPosition="right"
                value={taskStatus}
                onChange={(value) => setTaskStatus(value as TaskStatus)}
              />
            </Stack>
          )}

          <Stack gap={2} w="fit-content">
            <InputHeader label="Due Date" icon={<Calendar size={16} />} />
            <DatePickerInput
              placeholder="Pick date"
              value={taskDueDate}
              onChange={setTaskDueDate}
              clearable
            />
          </Stack>

          <div className="h-5">
            {isLoading && (
              <Notification
                loading
                withBorder
                color="teal"
                radius="8"
                title="Saving..."
                closeButtonProps={{ "aria-label": "Hide notification" }}
              ></Notification>
            )}
          </div>
        </Stack>
      </div>
    </div>
  );
};

export default TaskEditPage;
