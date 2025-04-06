import { UseProjects } from "@/features/Projects/context/ProjectContext";
import { useEffect } from "react";
import DashSubHeader from "@/components/Dash Sub Header/DashSubHeader";
import DashProjectCard from "@/features/Projects/Dash Project Card/DashProjectCard";
import "@/features/Projects/Dash Project Block/DashProjectBlock.scss";

const DashProjectBlock = () => {

    const { projects, fetchProjects } = UseProjects();

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return (
        <div className="dash-project-block">

            <div className="dash-project-block__top">
                <DashSubHeader title="Projects" count={ projects.length } />
            </div>

            <div className="dash-project-block__bottom">
                <ul className="dash-project-block__list">
                    { projects.map((project) => (
                        <DashProjectCard project={ project } key={ project.id } />
                    )) }
                </ul>

            </div>

        </div>
    );
};

export default DashProjectBlock;
