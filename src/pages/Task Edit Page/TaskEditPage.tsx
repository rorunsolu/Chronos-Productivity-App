import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { TaskData } from "@/features/Tasks/context/TaskContext";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import "@/pages/Task Edit Page/TaskEditPage.scss";
import { NotepadText, Calendar, Tag } from 'lucide-react';
import Dropdown from "@/components/Dropdown/Dropdown";
import DateTimePickerCompo from "@/components/Date Time Picker Compo/DateTimePickerCompo";
import { TaskStatus } from "@/features/Tasks/context/TaskContext";
import { UseProjects } from "@/features/Projects/context/ProjectContext";

const TaskEditPage = () => {

    const { id } = useParams<{ id: string; }>();

    const [task, setTask] = useState<TaskData>();
    const [taskTitle, setTaskTitle] = useState("");
    const [taskContent, setTaskContent] = useState("");
    const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
    const [taskLabel, setTaskLabel] = useState("");
    const [TaskStatus, setTaskStatus] = useState<TaskStatus>("pending");
    const [taskProjectAssignment, setTaskProjectAssignment] = useState<string>("");

    const { projects, fetchProjects } = UseProjects();

    const [isLoading, setIsLoading] = useState(false);

    const projectOptions = projects.map(project => project.name);
    const labelOptions = ["Personal", "Work", "School"];
    const statusOptions = ["pending", "ongoing", "completed"];

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        //set laoding to true each time the page loads when the ID exists
        setIsLoading(true);

        const fetchTask = async () => {

            // if the ID doesn't exist end the function

            if (!id) {
                return;
            }

            // retrieve the task from firebase by accessign the tasks collection and selecting the task based on the ID inside the URL
            const task = doc(db, "tasks", id);
            // the taskSnapshot refers to an image or rather "snapshot" of the task at the time of the request
            const taskSnapshot = await getDoc(task);

            //if the task snapshot doesnt exisst then the function is stopped and loading is set to false

            if (!taskSnapshot.exists()) {
                console.log("Task does not exist");
                setIsLoading(false);
                return;
            }

            // now I will create the functionality of setting the values of the tasks variuos details/data
            // this will be used for displaying the currently stored data in the fields of the page

            const taskObjectdata = taskSnapshot.data();
            setTaskTitle(taskObjectdata.title);
            setTaskContent(taskObjectdata.content);
            setTaskProjectAssignment(taskObjectdata.projectId);
            setTaskStatus(taskObjectdata.status);
            setTaskDueDate(taskObjectdata.dueDate?.toDate() || null); // Convert Timestamp to Date
            setTaskLabel(taskObjectdata.label);
            setTask(taskObjectdata as TaskData);
        }

        fetchTask();

    }, [id]);

    const updateTaskInFirebase = useCallback(async (newTitle: string, newContent: string, newProjectAssignment?: string, newDueDate?: Date | null, newLabel?: string, newStatus?: TaskStatus) => {
        try {
            if (!id) {
                return;
            }

            const task = doc(db, "tasks", id);
            await setDoc(task, {
                title: newTitle,
                content: newContent,
                projectId: newProjectAssignment,
                label: newLabel,
                dueDate: newDueDate ? Timestamp.fromDate(newDueDate) : null,
                status: newStatus
            }, { merge: true });

        } catch (error) {
            console.error("Error updating task:", error);
        } finally {
            setIsLoading(false);
            console.log("Task updated successfully");
        }
    }, [id]);

    useEffect(() => {
        console.log("checking if task has changed, finna wait 1 second before updating in firebase");

        const hasChanged = (
            taskTitle !== task?.title ||
            taskContent !== task?.content ||
            taskProjectAssignment !== task?.projectId ||
            TaskStatus !== task?.status ||
            taskLabel !== task?.label ||
            (taskDueDate?.getTime() !== (task?.dueDate instanceof Timestamp ? task.dueDate.toDate().getTime() : task?.dueDate?.getTime()))
        );

        if (!hasChanged) return;

        setIsLoading(true);

        const getTaskData = setTimeout(() => {
            console.log("updating task in firebase");
            updateTaskInFirebase(taskTitle, taskContent, taskProjectAssignment, taskDueDate, taskLabel, TaskStatus);
        }, 2000);

        return () => clearTimeout(getTaskData);
    }, [taskTitle, taskContent, taskProjectAssignment, taskDueDate, taskLabel, TaskStatus, task?.title, task?.content, task?.projectId, task?.dueDate, task?.label, task?.status, updateTaskInFirebase]);

    return (
        <div className="flex w-full h-full justify-center items-center mt-16">
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

                        <DateTimePickerCompo
                            value={ taskDueDate }
                            onChange={ (date) => setTaskDueDate(date) }
                        />
                    </div>

                    <div className="task-edit-page__form-group">
                        <div className="task-edit-page__form-header">
                            <NotepadText size={ 20 } />
                            <label className="task-edit-page__form-label">Status</label>
                        </div>
                        <Dropdown
                            options={ statusOptions }
                            value={ TaskStatus }
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
                            options={ projectOptions }
                            value={ taskProjectAssignment }
                            onChange={ setTaskProjectAssignment }
                            placeholder="Select a project"
                        />
                    </div>

                </form>

            </div>
        </div>
    );
}

export default TaskEditPage;
