import { formatDistanceToNow } from "date-fns";
import { TaskCardProps } from "@/features/Tasks/context/TaskContext";
import { useNavigate } from "react-router-dom";
import "@/features/Tasks/Task Card/TaskCard.scss";

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const navigate = useNavigate();

    return (
        <li className="task-card" key={ task.id } onClick={ () => navigate(`/tasks/${task.id}`) }>

            <div className="task-card__item">
                <p className="task-card__text">{ task.title }</p>
            </div>

            <div className="task-card__item">
                <p className="task-card__date">
                    { task.createdAt ? `created ${formatDistanceToNow(task.createdAt.toDate())} ago..` : "Unknown Date" }
                </p>
            </div>

        </li>
    );
};

export default TaskCard;