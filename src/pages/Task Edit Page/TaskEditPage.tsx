import { UserAuth } from "@/contexts/authContext/AuthContext";
import { UseProjects } from "@/features/Projects/context/ProjectContext";
import { TaskData, TaskStatus } from "@/features/Tasks/context/TaskContext";
import { db } from "@/firebase/firebase";
import { Select, Stack, Textarea, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { Calendar, Layers, NotepadText, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "@/pages/Task Edit Page/TaskEditPage.scss";
import InputHeader from "@/components/Input Header/InputHeader";

const TaskEditPage = () => {
  const { user } = UserAuth();
  const { id } = useParams<{ id: string }>();
  const {
    projects,
    fetchProjects,
    addTaskToProject,
    removeTaskFromProject,
    updateProject,
  } = UseProjects();

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
      if (!id || !user) {
        setIsLoading(false);
        return;
      }

      const taskRef = doc(db, "tasks", id);
      const taskSnapshot = await getDoc(taskRef);

      if (!taskSnapshot.exists()) {
        console.log("Task does not exist");
        alert("This task could not be found");
        setIsLoading(false);
        return;
      }

      const taskdata = taskSnapshot.data();
      if (taskdata.userId !== user.uid) {
        console.log("Unauthorized access attempt");
        alert("You don't have permission to access this task");
        setIsLoading(false);
        return;
      }

      const taskObjectdata = taskSnapshot.data();
      setTaskTitle(taskObjectdata.title);
      setTaskContent(taskObjectdata.content);
      setTaskProjectAssignment(taskObjectdata.projectId);
      setTaskStatus(taskObjectdata.status);
      setTaskDueDate(taskObjectdata.dueDate || null);
      setTaskLabel(taskObjectdata.label);
      setTask(taskObjectdata as TaskData);

      setIsLoading(false);
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

      await setDoc(
        doc(db, "tasks", id),
        {
          title: newTitle,
          content: newContent || "",
          label: newLabel || "",
          dueDate: newDueDate || "",
          status: newStatus || "pending",
          userId: user.uid,
        },
        { merge: true }
      );
    },
    [id, user]
  );

  const handleProjectChange = useCallback(
    async (newProjectId: string) => {
      if (!id || !user) return;

      const oldProjectID = task?.projectId;
      if (oldProjectID === newProjectId) return;

      const oldProject = projects.find(
        (project) => project.id === task?.projectId
      );
      const newProject = projects.find(
        (project) => project.id === newProjectId
      );

      if (oldProject && oldProject.userId !== user.uid) {
        alert("You don't own the current project");
        return;
      }

      if (newProject && newProject.userId !== user.uid) {
        alert("You don't own the selected project");
        return;
      }

      if (oldProjectID) {
        removeTaskFromProject(oldProjectID, id);
        setTask((prev) => (prev ? { ...prev, projectId: "" } : prev));
      }

      if (newProjectId) {
        addTaskToProject(newProjectId, id);
        setTask((prev) => (prev ? { ...prev, projectId: newProjectId } : prev));

        const project = projects.find((project) => project.id === newProjectId);
        if (project) {
          updateProject(newProjectId, {
            updatedAt: Timestamp.fromDate(new Date()),
          });
        }
      }
    },
    [
      id,
      user,
      projects,
      task?.projectId,
      addTaskToProject,
      removeTaskFromProject,
      updateProject,
    ]
  );

  useEffect(() => {
    console.log("checking for changes");

    const hasFieldChanged =
      taskTitle !== task?.title ||
      taskContent !== task?.content ||
      taskStatus !== task?.status ||
      taskLabel !== task?.label ||
      taskDueDate !== task?.dueDate;

    if (!hasFieldChanged) return;

    const timeout = setTimeout(() => {
      console.log("updating task in firebase");
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
      console.log("updating task's project in FB");
    }, 1000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [taskProjectAssignment, task?.projectId]);

  return (
    <div className="page-wrapper">
      <div className="task-edit-page">
        {isLoading && <p>Saving...</p>}

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
        </Stack>
      </div>
    </div>
  );
};

export default TaskEditPage;
