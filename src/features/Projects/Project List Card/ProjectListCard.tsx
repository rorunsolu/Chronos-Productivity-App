import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ProjectData } from "@/features/Projects/context/ProjectContext";
import "@/features/Projects/Project List Card/ProjectListCard.scss";
import { Clock, Tag, ClipboardList, Trash } from 'lucide-react';
import { UseTasks } from "@/features/Tasks/context/TaskContext";
import InfoPill from "@/components/Info Pill/InfoPill";

const ProjectListCard: React.FC<ProjectListCardProps> = ({ project, deleteProject }) => {

    const navigate = useNavigate();

    const { tasks, fetchTasks } = UseTasks();

    const projectTasks = tasks.filter(task => project.tasks.includes(task.id));
    const completedTasks = projectTasks.filter(task => task.status === "completed");
    const progressPercentage = projectTasks.length > 0
        ? Math.round((completedTasks.length / projectTasks.length) * 100)
        : 0;

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <li className="project-list-card">

            <div className="project-list-card__header">

                <div className="project-list-card__header-items">
                    { project.label && (
                        <InfoPill icon={ <Tag size={ 13 } /> } value={ project.label } />
                    ) }
                    { project.createdAt && (
                        <InfoPill icon={ <Clock size={ 13 } /> } value={ formatDistanceToNow(project.createdAt.toDate()) + " ago" } />
                    ) }

                </div>

                <button
                    className="project-list-card__delete-btn"
                    onClick={ (e) => { e.stopPropagation(); deleteProject(project.id); } }>
                    <Trash />
                </button>

            </div>


            <h3 className="project-list-card__title">{ project.name }</h3>

            <div className="project-list-card__info">

                { project.tasks && (
                    <div className="project-list-card__details">
                        <span className="project-list-card__icon"><ClipboardList size={ 13 } /></span>
                        <span className="project-list-card__value">Tasks: &#8203;{ project.tasks.length }</span>
                    </div>
                ) }

                { project.updatedAt && (
                    <div className="project-list-card__details">
                        <span className="project-list-card__icon"><Clock size={ 13 } /></span>
                        <span className="project-list-card__value">
                            Updated: { project.updatedAt ? `${formatDistanceToNow(project.updatedAt.toDate())} ago..` : "Unknown Date" }
                        </span>
                    </div>
                ) }

                <div className="project-list-card__progress">
                    <div className="progress-bar">
                        <div
                            className="progress-bar__fill"
                            style={ { width: `${progressPercentage}%` } }
                        ></div>
                    </div>
                    <div className="project-list-card__progress-text">
                        { progressPercentage }% Complete
                        <span className="project-list-card__progress-count">
                            ({ completedTasks.length }/{ projectTasks.length } tasks)
                        </span>
                    </div>
                </div>

            </div>

            <button className="project-list-card__button" onClick={ () => navigate(`/projects/${project.id}`) }>View Project</button>

        </li>
    );
};

export default ProjectListCard;

interface ProjectListCardProps {
    project: ProjectData;
    deleteProject: (id: string) => void;
}