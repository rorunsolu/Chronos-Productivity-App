import { ReactNode } from "react";
import "@/components/Info Pill/InfoPill.scss";

const InfoPill: React.FC<InfoPillProps> = ({ icon, value }) => {
  return (
    <div className="info-pill line-clamp-1">
      {icon}
      {value}
    </div>
  );
};

export default InfoPill;

interface InfoPillProps {
  icon: ReactNode;
  value: string;
}
