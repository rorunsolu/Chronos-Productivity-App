import { Plus } from "lucide-react";
import "@/components/Add Button/AddButton.scss";

interface AddButtonProps {
  onClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <button className="add-button" type="button" onClick={onClick}>
      <Plus />
    </button>
  );
};

export default AddButton;
