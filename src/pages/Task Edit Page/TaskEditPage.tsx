import Dropdown from "@/components/Dropdown/Dropdown";
import { UseProjects } from "@/features/Projects/context/ProjectContext";
import { TaskData } from "@/features/Tasks/context/TaskContext";
import { TaskStatus } from "@/features/Tasks/context/TaskContext";
import { db } from "@/firebase/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { Calendar, NotepadText, Tag } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "@/pages/Task Edit Page/TaskEditPage.scss";
import DateTimePickerCompo from "@/components/Date Time Picker Compo/DateTimePickerCompo";

const TaskEditPage = () => {

    const { id } = useParams<{ id: string; }>();

    const [task, setTask] = useState<TaskData>();
    const [taskTitle, setTaskTitle] = useState("");
    const [taskContent, setTaskContent] = useState("");
    const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
    const [taskLabel, setTaskLabel] = useState("");
    const [taskStatus, setTaskStatus] = useState<TaskStatus>("pending");
    const [taskProjectAssignment, setTaskProjectAssignment] = useState<string>("");

    const { projects, fetchProjects, addTaskToProject, removeTaskFromProject, updateProject } = UseProjects();

    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const projectOptions = useMemo(
        () => projects.map((project) => ({ value: project.id, label: project.name })),
        [projects]
    );

    const labelOptions = ["Personal", "Work", "School"];
    const statusOptions = ["pending", "ongoing", "completed"];

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {

        if (isInitialLoad) {
            setIsInitialLoad(false);
            return;
        }

        const fetchTask = async () => {

            if (!id) {
                return;
            }

            const task = doc(db, "tasks", id);
            const taskSnapshot = await getDoc(task);

            if (!taskSnapshot.exists()) {
                console.log("Task does not exist");
                setIsLoading(false);
                return;
            }

            const taskObjectdata = taskSnapshot.data();
            setTaskTitle(taskObjectdata.title);
            setTaskContent(taskObjectdata.content);
            setTaskProjectAssignment(taskObjectdata.projectId);
            setTaskStatus(taskObjectdata.status);
            setTaskDueDate(taskObjectdata.dueDate?.toDate() || null);
            setTaskLabel(taskObjectdata.label);
            setTask(taskObjectdata as TaskData);

            setIsLoading(false);
        };

        fetchTask();

    }, [id, isInitialLoad]);

    const updateTaskFields = useCallback(
        async (newTitle: string, newContent?: string, newDueDate?: Date | null, newLabel?: string, newStatus?: TaskStatus) => {

            if (!id) return;

            const taskRef = doc(db, "tasks", id);

            await setDoc(
                taskRef,
                {
                    title: newTitle,
                    content: newContent || "",
                    label: newLabel || "",
                    dueDate: newDueDate ? Timestamp.fromDate(newDueDate) : null,
                    status: newStatus || "pending",
                },
                { merge: true }
            );
        },
        [id]
    );

    const handleProjectChange = useCallback(
        async (newProjectId: string) => {

            if (!id) return;

            const oldProjectId = task?.projectId;

            if (oldProjectId === newProjectId) return;

            if (oldProjectId) {
                removeTaskFromProject(oldProjectId, id);
                setTask(prev => prev ? { ...prev, projectId: "" } : prev);
            }

            if (newProjectId) {
                addTaskToProject(newProjectId, id);
                setTask(prev => prev ? { ...prev, projectId: newProjectId } : prev);

                const project = projects.find(project => project.id === newProjectId);
                if (project) {
                    updateProject(newProjectId, { updatedAt: Timestamp.fromDate(new Date()) });
                }
            }
        },
        [id, task?.projectId, addTaskToProject, removeTaskFromProject, projects, updateProject]
    );

    useEffect(() => {

        console.log("checking if task has changed");

        const hasFieldChanged = (
            taskTitle !== task?.title ||
            taskContent !== task?.content ||
            taskStatus !== task?.status ||
            taskLabel !== task?.label ||
            (taskDueDate?.getTime() !== (task?.dueDate instanceof Timestamp ? task.dueDate.toDate().getTime() : task?.dueDate?.getTime()))
        );

        if (!hasFieldChanged) return;

        const timeout = setTimeout(() => {
            console.log("updating task in firebase");
            updateTaskFields(taskTitle, taskContent, taskDueDate, taskLabel, taskStatus);
        }, 1000);

        return () => clearTimeout(timeout);

    }, [taskTitle, taskContent, taskDueDate, taskLabel, taskStatus, updateTaskFields, task]);

    useEffect(() => {
        if (taskProjectAssignment === task?.projectId) return;

        const timeout = setTimeout(() => {
            handleProjectChange(taskProjectAssignment);
            console.log("updating project assignment in firebase");
        }, 1000);

        return () => clearTimeout(timeout);
    }, [taskProjectAssignment, task?.projectId]); // IGNORE THIS ERROR

    return (
        <div className="page-wrapper">
            <div className="task-edit-page">

                { isLoading && <p>Saving...</p> }

                <header className="task-edit-page__header">
                    <input className="task-edit-page__header-title"
                        onChange={ (e) => setTaskTitle(e.target.value) }
                        value={ taskTitle } type="text" placeholder="Title" />
                </header>

                <form className="task-edit-page__form">

                    <div className="task-edit-page__form-group">
                        <div className="task-edit-page__form-header">
                            <Tag size={ 20 } />
                            <label className="task-edit-page__form-label">Label</label>
                        </div>
                        <Dropdown
                            options={ labelOptions }
                            value={ taskLabel }
                            onChange={ setTaskLabel }
                            placeholder="Select a label"
                        />
                    </div>

                    <div className="task-edit-page__form-group">
                        <div className="task-edit-page__form-header">
                            <NotepadText size={ 20 } />
                            <label className="task-edit-page__form-label">Description</label>
                        </div>
                        <textarea className="task-edit-page__form-textarea"
                            onChange={ (e) => setTaskContent(e.target.value) }
                            value={ taskContent }
                            placeholder="Description" />
                    </div>

                    <div className="task-edit-page__form-group">
                        <div className="task-edit-page__form-header">
                            <Calendar size={ 20 } />
                            <label className="task-edit-page__form-label">Due Date</label>
                        </div>
                        {/* Do i even need this? */ }
                        <div className="relative">
                            <DateTimePickerCompo
                                value={ taskDueDate }
                                onChange={ (date) => setTaskDueDate(date) }
                            />
                        </div>
                    </div>



                    <div className="task-edit-page__form-group">
                        <div className="task-edit-page__form-header">
                            <NotepadText size={ 20 } />
                            <label className="task-edit-page__form-label">Status</label>
                        </div>
                        <Dropdown
                            options={ statusOptions }
                            value={ taskStatus }
                            onChange={ (value: string) => setTaskStatus(value as TaskStatus) }
                            placeholder="Select a status"
                        />
                    </div>


                    <div className="task-edit-page__form-group">
                        <div className="task-edit-page__form-header">
                            <NotepadText size={ 20 } />
                            <label className="task-edit-page__form-label">Assigned project</label>
                        </div>
                        <Dropdown
                            placeholder="Select a project"
                            options={ projectOptions.map(opt => opt.label) }
                            value={ projectOptions.find(opt => opt.value === taskProjectAssignment)?.label || "" }
                            onChange={ (value: string) => {
                                // Match by LABEL (display name), not ID
                                const selectedProject = projects.find(project => project.name === value);
                                setTaskProjectAssignment(selectedProject?.id || "");
                            } }
                        />
                    </div>

                </form>

            </div>
        </div>
    );
};

export default TaskEditPage;