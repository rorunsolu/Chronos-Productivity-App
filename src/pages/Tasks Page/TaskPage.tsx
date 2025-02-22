import React, { useEffect, useState } from 'react';
//import { format } from 'date-fns';
import { taskData, UseTasks } from "../../features/Tasks/context/TaskContext";
import './TaskPage.scss';
import '../../App.css';
import '../../features/Tasks/styles/Task.scss';

const TaskPage = () => {

    const { tasks, fetchTasks, createTask, deleteTask, toggleTaskCompletion } = UseTasks();
    const [title, setTitle] = useState("");

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handlecreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Creating task...");
        createTask(title);
        setTitle("");
    };

    const completionToggle = async (task: taskData) => {
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <input className="taskpage__form-input" value={title} onChange={(event) => setTitle(event.target.value)} type="text" placeholder="Add task" />
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

                </div>

                <div className="taskpage__content">

                    <ul className="taskpage__task-list">

                        {tasks.map((task) => (
                            <li key={task.id} className={`task ${task.completion ? "task--completed" : ""}`}>

                                <div className="task__content">

                                    <div className="task__content-item">
                                        <input
                                            onChange={() => completionToggle(task)}
                                            className="task__checkbox"
                                            type="checkbox"
                                            checked={task.completion}
                                        />
                                    </div>

                                    <div className="task__content-item">
                                        <p onClick={() => completionToggle(task)} className="task__content-text">{task.title}</p>
                                    </div>

                                </div>

                                <div className="task__info">

                                    <div className="task__info-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                        </svg>

                                        <p className="task__info-text">Project</p>
                                    </div>

                                    {task.label ? (
                                        <div className="task__info-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                            </svg>

                                            <p className="task__info-text">{task.label}</p>
                                        </div>
                                    ) : null}

                                    <div className="task__info-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <p className="task__info-text">Due Date</p>
                                    </div>

                                </div>

                                <div className="task__actions">

                                    <button className="task__actions-btn" onClick={(event) => { event.stopPropagation(); deleteTask(task.id); }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>

                                    </button>

                                </div>

                            </li>
                        ))}

                    </ul>

                </div>

            </div>

        </div >

    );
};

export default TaskPage;

