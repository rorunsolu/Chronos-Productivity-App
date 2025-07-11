import "@/App.css";
import { Menu } from "@mantine/core";
import { EllipsisVertical, Trash } from "lucide-react";

interface MenuToggleProps {
  onDelete: () => void;
}

const MenuToggle: React.FC<MenuToggleProps> = ({ onDelete }) => {
  return (
    <Menu width={150} shadow="sm" radius="8">
      <Menu.Target>
        <button
          className="menu-toggle-button"
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisVertical size={16} />
        </button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          leftSection={<Trash size={16} />}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default MenuToggle;
