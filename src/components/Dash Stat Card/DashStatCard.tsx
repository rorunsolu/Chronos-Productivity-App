import { ReactNode } from "react";
import "@/components/Dash Stat Card/DashStatCard.scss";

const DashStatCard: React.FC<DashStatCardProps> = ({ card }) => {
    return (
        <div className="dash-stat-card">
            <div className="dash-stat-card__icon">{ card.icon }</div>
            <div>
                <p className="dash-stat-card__title">{ card.title }</p>
                <p className="dash-stat-card__value">{ card.value }</p>
            </div>
        </div>
    );
};

export default DashStatCard;

interface DashStatCardProps {
    card: {
        icon: ReactNode;
        title: string;
        value: number;
    };
}