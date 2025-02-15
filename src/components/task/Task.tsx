import "./Task.scss";

const Task = ({ task, completionToggle, deleteTask }) => {
    return (
        <li className={`task ${task.completion ? "task--completed" : ""}`}>
            <div className="task__content">
                <input
                    onChange={() => completionToggle(task)}
                    className="task__checkbox"
                    type="checkbox"
                    checked={task.completion}
                />
                <p onClick={() => completionToggle(task)} className="task__text">{task.title}</p>
            </div>
            <div className="task__actions">
                <button onClick={() => deleteTask(task)} className="task__delete-btn">
                    <img src="/trash-01.svg" alt="Delete Icon" />
                </button>
            </div>
        </li>
    );
};

export default Task;
