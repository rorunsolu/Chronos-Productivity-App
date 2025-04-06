import { useNavigate } from "react-router-dom";
import { TaskData } from "@/features/Tasks/context/TaskContext";
import { UseProjects } from "@/features/Projects/context/ProjectContext";
import { useEffect } from "react";
import { Check, Layers, Tag, Timer, Trash } from "lucide-react";
import { format } from "date-fns";
import "@/features/Tasks/Task List Card/TaskListCard.scss";
import InfoPill from "@/components/Info Pill/InfoPill";

const TaskListCard: React.FC<TaskListCardProps> = ({ task, deleteTask, completionToggle }) => {

    const navigate = useNavigate();
    const { projects, fetchProjects } = UseProjects();

    const projectName = projects.find(project => project.id === task.projectId)?.name;

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return (
        <li className="task-list-card" key={ task.id } onClick={ () => navigate(`/tasks/${task.id}`) } >

            <div className="task-list-card__left">
                <div
                    role="checkbox"
                    onClick={ (e) => { e.stopPropagation(); completionToggle(task); } }
                    className={ `task-list-card__checkbox ${task.completion ? "task-list-card__checkbox--checked" : ""}` }
                >
                    { task.completion && <span className="task-list-card__checkbox-icon"><Check /></span> }
                </div>

                <div className="task-list-card__content">
                    <p className="task-list-card__title">{ task.title }</p>
                    { task.content && <p className="task-list-card__description">{ task.content }</p> }
                </div>

            </div>

            <div className="task-list-card__information">

                { task.label &&
                    <InfoPill icon={ <Tag size={ 13 } /> } value={ task.label } />
                }

                { task.createdAt &&
                    <InfoPill icon={ <Timer size={ 13 } /> } value={ format(task.createdAt.toDate(), 'dd/MM/yyyy') } />
                }

                { projectName &&
                    <InfoPill icon={ <Layers size={ 13 } /> } value={ projectName } />
                }

            </div>

            <div className="task-list-card__actions">

                <button className="task-list-card__button" onClick={ (e) => { e.stopPropagation(); deleteTask(task.id); } }>
                    <Trash />
                </button>

            </div>

        </li>
    )
}

export default TaskListCard;


interface TaskListCardProps {
    task: TaskData;
    deleteTask: (id: string) => void;
    completionToggle: (task: TaskData) => void;
}