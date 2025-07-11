import { Group } from "@mantine/core";
import React from "react";

interface InputHeaderProps {
  label: string;
  icon?: React.ReactNode | string;
}

const InputHeader: React.FC<InputHeaderProps> = ({ label, icon }) => {
  return (
    <Group mb={5} gap={4} className="relative">
      {icon && (
        <svg
          className="relative w-4 h-4
      top-[0.5px] 
      text-[#535862]
      "
        >
          {icon}
        </svg>
      )}

      <label className="text-[14px] font-normal leading-5 text-[#535862]">
        {label}
      </label>
    </Group>
  );
};

export default InputHeader;
