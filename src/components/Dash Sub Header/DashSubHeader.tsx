import "@/components/Dash Sub Header/DashSubHeader.scss";
import { useNavigate } from "react-router-dom";

const DashSubHeader: React.FC<DashSubHeaderProps> = ({ title, count }) => {
    const navigate = useNavigate();
    return (
        <div className="dash-sub-header">

            <h2 className="dash-sub-header__title" onClick={ () => navigate(`/${title.toLowerCase()}`) }>
                { title }
            </h2>

            { count !== undefined && count >= 0 && <span className="dash-sub-header__count">{ count }</span> }

        </div>
    );
};

export default DashSubHeader;

interface DashSubHeaderProps {
    title: string;
    count?: number;
}
