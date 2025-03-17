import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ProjectData } from "@/features/Projects/context/ProjectContext";
import "@/features/Projects/Project List Card/ProjectListCard.scss";
import { Clock, Tag, TrendingUp } from 'lucide-react';

// Todo: Add a due date to the project data and display it in the ProjectListCard component

const ProjectListCard: React.FC<ProjectListCardProps> = ({ project }) => {

    const navigate = useNavigate();

    return (
        <li className="project-list-card">

            <div className="project-list-card__header">

                { project.label ? (
                    <div className="project-list-card__header-item">
                        <span className="project-list__header-icon"><Tag size={ 13 } /></span>
                        <span className="project-list-card__header-value">{ project.label }</span>
                    </div>
                ) : (
                    <div className="project-list-card__header-item">
                        <span className="project-list__header-icon"><Tag size={ 13 } /></span>
                        <span className="project-list-card__header-value">n/a</span>
                    </div>
                ) }

                { project.priority ? (
                    <div className="project-list-card__header-item">
                        <span className="project-list__header-icon"> <TrendingUp size={ 13 } /></span>
                        <span className="project-list-card__header-value">{ project.priority }</span>
                    </div>
                ) : (
                    <div className="project-list-card__header-item">
                        <span className="project-list__header-icon"><TrendingUp size={ 13 } /></span>
                        <span className="project-list-card__header-value">n/a</span>
                    </div>
                ) }

            </div>

            <h3 className="project-list-card__title">{ project.name }</h3>

            <div className="project-list-card__info">

                { project.updatedAt && (
                    <div className="project-list-card__details">
                        <span className="project-list-card__icon"><Clock size={ 13 } /></span>
                        <span className="project-list-card__value">
                            Last updated: { project.updatedAt ? `${formatDistanceToNow(project.updatedAt.toDate())} ago..` : "Unknown Date" }
                        </span>
                    </div>
                ) }

            </div>

            <button className="project-list-card__button" onClick={ () => navigate(`/projects/${project.id}`) }>View Project</button>

        </li>
    )
}

export default ProjectListCard;

interface ProjectListCardProps {
    project: ProjectData;
}