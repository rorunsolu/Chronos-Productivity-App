import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import "@/features/Tasks/Task Card/DashTaskCard.scss";
import { TaskData } from "@/features/Tasks/context/TaskContext";

const DashTaskCard: React.FC<DashTaskCardProps> = ({ task }) => {
    const navigate = useNavigate();

    return (
        <li className="dash-task-card" key={ task.id } onClick={ () => navigate(`/tasks/${task.id}`) }>

            <div className="dash-task-card__item">
                <p className="dash-task-card__text line-clamp-1">{ task.title }</p>
            </div>

            <div className="dash-task-card__item">
                <p className="dash-task-card__date">
                    { task.createdAt ? `created ${formatDistanceToNow(task.createdAt.toDate())} ago..` : "Unknown Date" }
                </p>
            </div>

        </li>
    );
};

export default DashTaskCard;

interface DashTaskCardProps {
    task: TaskData;
}