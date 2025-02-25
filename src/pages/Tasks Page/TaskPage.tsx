import Modal from "react-modal";
import React, { useCallback, useEffect, useState } from "react";
import TaskPageSection from "../../features/Tasks/components/TaskPageSection";
import { taskData, UseTasks } from "../../features/Tasks/context/TaskContext";
import "./TaskPage.scss";
import "../../App.css";
import "../../features/Tasks/styles/Task.scss";

const TaskPage = () => {

    const { tasks, fetchTasks, createTask, deleteTask, toggleTaskCompletion } = UseTasks();
    const [taskTitle, setTaskTitle] = useState("");
    const [taskContent, setTaskContent] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handlecreateTask = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createTask(taskTitle, taskContent);
        setTaskTitle("");
        setTaskContent("");
    };

    const completionToggle = (task: taskData) => {
        toggleTaskCompletion(task.id);
    };

    return (

        <div className="section">

            <div className="taskpage">

                <div className="taskpage__header">

                    <h1 className="taskpage__title">Tasks</h1>

                </div>

                <div className="taskpage__inputs">

                    <form className="taskpage__form" onSubmit={handlecreateTask}>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <input className="taskpage__form-input" value={title} onChange={(event) => setTitle(event.target.value)} type="text" placeholder="Add task" /> */}
                    </form>

                    <form className="taskpage__form">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <input className="taskpage__form-input" type="text" placeholder="Search tasks" />
                    </form>

                    <button className="taskpage__filter-button" onClick={() => console.log("Filter button clicked")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                        </svg>
                    </button>

                    <button className="taskpage__filter-button" type="submit" onClick={openModal}>
                        Create Task
                    </button>

                </div>

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Create a new task"
                    className="modal"
                    overlayClassName="modal-overlay">

                    <p className="modal__title">Create a task</p>

                    <form className="modal__form" onSubmit={handlecreateTask}>

                        <input
                            className="modal__input"
                            onChange={(e) => setTaskTitle(e.target.value)}
                            value={taskTitle}
                            type="text"
                            placeholder="Title"
                        />

                        <textarea
                            className="modal__textarea"
                            onChange={(e) => setTaskContent(e.target.value)}
                            value={taskContent}
                            placeholder="Content"
                        />

                        <button className="modal__button" disabled={!taskTitle || !taskContent} type="submit">
                            Create Task
                        </button>

                        <button
                            className="modal__button"
                            onClick={() => setIsModalOpen(false)}
                            type="button"
                        >
                            Cancel
                        </button>

                    </form>



                </Modal>

                <div className="taskpage__content">
                    <TaskPageSection title="Todo" tasks={tasks} completionToggle={completionToggle} deleteTask={deleteTask} />
                    <TaskPageSection title="Doing" tasks={tasks} completionToggle={completionToggle} deleteTask={deleteTask} />
                    <TaskPageSection title="Done" tasks={tasks} completionToggle={completionToggle} deleteTask={deleteTask} />
                </div>

            </div>

        </div >

    );
};

export default TaskPage;