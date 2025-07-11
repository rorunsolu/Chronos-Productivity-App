import { TaskData } from "@/features/Tasks/context/TaskContext";
import { CalendarClock, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "@/features/Projects/Project Task Card/ProjectTaskCard.scss";
import InfoPill from "@/components/Info Pill/InfoPill";

const ProjectTaskCard: React.FC<ProjectTaskCardProps> = ({ task }) => {
  const navigate = useNavigate();

  return (
    <div
      key={task.id}
      className="project-task-card"
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      <h4 className="project-task-card__title">{task.title}</h4>

      {task.content && (
        <p className="project-task-card__description">{task.content}</p>
      )}

      {task.label ||
        (task.dueDate && (
          <div className="project-task-card__meta">
            {task.label && (
              <InfoPill icon={<Tag size={13} />} value={task.label} />
            )}

            {task.dueDate && (
              <InfoPill
                icon={<CalendarClock size={13} />}
                value={task.dueDate}
              />
            )}
          </div>
        ))}
    </div>
  );
};

export default ProjectTaskCard;

interface ProjectTaskCardProps {
  task: TaskData;
}
