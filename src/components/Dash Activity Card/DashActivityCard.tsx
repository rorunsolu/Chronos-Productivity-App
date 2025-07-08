import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import React from "react";
import InfoPill from "@/components/Info Pill/InfoPill";

import "@/components/Dash Activity Card/DashActivityCard.scss";

type DashActivityCardProps = {
  activity: {
    title: string;
    creation: Timestamp;
    type: "Project" | "Task" | "Note";
  };
};

const DashActivityCard: React.FC<DashActivityCardProps> = ({ activity }) => {
  return (
    <div className="dash-activity-card">
      <InfoPill
        icon={<div className="dash-activity-card__dot "></div>}
        value={activity.type}
      />
      <h3 className="dash-activity-card__title">{activity.title}</h3>

      <p className="dash-activity-card__date">
        {activity.creation
          ? formatDistanceToNow(activity.creation.toDate(), { addSuffix: true })
          : "Unknown Date"}
      </p>
    </div>
  );
};

export default DashActivityCard;
