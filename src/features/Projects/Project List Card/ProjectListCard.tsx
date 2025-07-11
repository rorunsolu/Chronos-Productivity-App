import ButtonReg from "@/components/Buttons/ButtonReg";
import { ProjectData } from "@/features/Projects/context/ProjectContext";
import { UseTasks } from "@/features/Tasks/context/TaskContext";
import { Progress } from "@mantine/core";
import { formatDistanceToNow } from "date-fns";
import { Clock, Tag } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuToggle from "@/components/Menu Toggle/MenuToggle";
import "@/features/Projects/Project List Card/ProjectListCard.scss";
import InfoPill from "@/components/Info Pill/InfoPill";

const ProjectListCard: React.FC<ProjectListCardProps> = ({
  project,
  deleteProject,
}) => {
  const navigate = useNavigate();

  const { tasks, fetchTasks } = UseTasks();

  const projectTasks = tasks.filter((task) => project.tasks.includes(task.id));
  const completedTasks = projectTasks.filter(
    (task) => task.status === "Completed"
  );
  const progressPercentage =
    projectTasks.length > 0
      ? Math.round((completedTasks.length / projectTasks.length) * 100)
      : 0;

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  return (
    <li className="project-list-card">
      <div className="project-list-card__header">
        <div className="project-list-card__header-items">
          {project.label && (
            <InfoPill icon={<Tag size={13} />} value={project.label} />
          )}
          {project.createdAt && (
            <InfoPill
              size="sm"
              icon={<Clock size={13} />}
              value={formatDistanceToNow(project.createdAt.toDate()) + " ago"}
            />
          )}
        </div>

        <MenuToggle onDelete={() => deleteProject(project.id)} />
      </div>

      <h3 className="project-list-card__title">{project.name}</h3>

      <div className="project-list-card__info">
        <div className="project-list-card__progress">
          <Progress value={progressPercentage} />
          <div className="project-list-card__progress-text">
            {progressPercentage}% Complete
            <span className="project-list-card__progress-count">
              ({completedTasks.length}/{projectTasks.length} tasks)
            </span>
          </div>
        </div>
      </div>

      <ButtonReg
        label="View Project"
        type="secondary"
        onClick={() => navigate(`/projects/${project.id}`)}
      />
    </li>
  );
};

export default ProjectListCard;

interface ProjectListCardProps {
  project: ProjectData;
  deleteProject: (id: string) => void;
}
