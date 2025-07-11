import { ReactNode } from "react";
import "@/components/Info Pill/InfoPill.scss";

const InfoPill: React.FC<InfoPillProps> = ({ icon, value, size = "md" }) => {
  return (
    <div className={`info-pill info-pill--${size} line-clamp-1`}>
      {icon}
      {value}
    </div>
  );
};

export default InfoPill;

interface InfoPillProps {
  icon: ReactNode;
  value: string;
  size?: "sm" | "md";
}
