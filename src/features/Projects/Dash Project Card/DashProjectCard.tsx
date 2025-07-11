import { ProjectData } from "@/features/Projects/context/ProjectContext";
import { Tag, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "@/features/Projects/Dash Project Card/DashProjectCard.scss";

interface DashProjectCardProps {
  project: ProjectData;
}

const DashProjectCard: React.FC<DashProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  return (
    <li
      className="dash-project-card"
      key={project.id}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className="dash-project-card__item">
        <p className="dash-project-card__text">{project.name}</p>
      </div>

      <div className="dash-project-card__details">
        <div className="dash-project-card__item">
          <TrendingUp size={13} />
          <p className="dash-project-card__text">
            {project.status ? project.status : "n/a"}
          </p>
        </div>
        {project.label && (
          <div className="dash-project-card__item">
            <Tag size={13} />
            <p className="dash-project-card__text">
              {project.label ? project.label : "n/a"}
            </p>
          </div>
        )}

        <div className="dash-project-card__item">
          <p className="dash-project-card__text">{project.tasks.length}</p>
          <span className="dash-project-card__text">
            {project.tasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>
      </div>
    </li>
  );
};

export default DashProjectCard;
