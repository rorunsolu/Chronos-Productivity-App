import { UserAuth } from "@/contexts/authContext/AuthContext";
import { Avatar, Group, Stack } from "@mantine/core";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import React from "react";

import "@/components/Dash Activity Card/DashActivityCard.scss";

type DashActivityCardProps = {
  activity: {
    title: string;
    creation: Timestamp;
    type: "Project" | "Task" | "Note";
  };
};

const DashActivityCard: React.FC<DashActivityCardProps> = ({ activity }) => {
  const { user } = UserAuth();

  return (
    <div className="dash-activity-card">
      <Avatar
        size="30"
        radius="xl"
        src={user?.photoURL ? user.photoURL : "p.png"}
        alt="User Avatar"
        mr={10}
      />

      <Group align="center">
        <Stack gap={0}>
          <h3 className="dash-activity-card__title">{activity.title}</h3>

          <p className="dash-activity-card__date">
            Created a {activity.type.toLowerCase()}{" "}
            {activity.creation
              ? formatDistanceToNow(activity.creation.toDate(), {
                  addSuffix: true,
                })
              : "Unknown Date"}
          </p>
        </Stack>
      </Group>
    </div>
  );
};

export default DashActivityCard;
