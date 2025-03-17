import { format } from "date-fns";
import { ProjectCardProps } from "@/features/Projects/context/ProjectContext";
import { useNavigate } from "react-router-dom";
import "@/features/Projects/Project Card/ProjectCard.scss";
import { Tag } from 'lucide-react';
import { History } from 'lucide-react';
import { OctagonAlert } from 'lucide-react';
import { CircleDashed } from 'lucide-react';

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const navigate = useNavigate();

    return (
        <li className="project-card" key={project.id} onClick={() => navigate(`/projects/${project.id}`)}>

            <div className="project-card__item">
                <p className="project-card__text">{project.name}</p>
            </div>

            <div className="project-card__item">
                <CircleDashed size={13} />
                <p className="project-card__text">{project.status ? project.status : "n/a"}</p>
            </div>

            <div className="project-card__item">
                <OctagonAlert size={13} />
                <p className="project-card__text">{project.priority ? project.priority : "n/a"}</p>
            </div>
            
            <div className="project-card__item">
                <Tag size={13} />
                <p className="project-card__text">{project.label ? project.label : "n/a"}</p>
            </div>

            <div className="project-card__item">
                <History size={13} />
                <p className="project-card__text">
                    {project.createdAt ? format(project.createdAt.toDate(), "dd/MM/yyyy") : "Unknown Date"}
                </p>
            </div>

            <div className="project-card__item w100">
                <p className="project-card__text">{project.tasks.length}</p>
                <span className="project-card__text">{project.tasks.length === 1 ? "task" : "tasks"}</span>
            </div>

        </li>
    );
};

export default ProjectCard;