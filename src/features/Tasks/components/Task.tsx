import React from "react";
import { TaskProps } from "@/common/types";
// import { format } from "date-fns";
import "@/features/Tasks/styles/Task.scss";

const Task: React.FC<TaskProps> = ({ task, completionToggle, deleteTask }) => {
    return (
        <li className={`task ${task.completion ? "task--completed" : ""}`}>
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
                    <p className="task__content-text">{task.title}</p>
                </div>

                <div className="task__content-item">
                    <p className="task__content-text">{task.content}</p>
                </div>

            </div>
            <div className="task__info">

                {task.project && (
                    <div className="task__info-item">
                        <i className="ri-briefcase-line"></i>
                        <p className="task__info-text">gayyyy</p>
                    </div>
                )}

                {task.label && (
                    <div className="task__info-item">
                        <i className="ri-bookmark-line"></i>
                        <p className="task__info-text">{task.label}</p>
                    </div>
                )}
                {/* 
                {task.dueDate && (
                    <div className="task__info-item">
                        <i className="ri-time-line"></i>
                        <p className="task__info-text">{task.dueDate ? format(task.dueDate, "dd/MM/yyyy") : ""}</p>
                    </div>
                )} */}

            </div>
            <div className="task__actions">
                <button className="task__actions-btn" onClick={(event) => { event.stopPropagation(); deleteTask(task.id); }}>
                    <i className="ri-delete-bin-line"></i>
                </button>
            </div>
        </li>
    );
};

export default Task;