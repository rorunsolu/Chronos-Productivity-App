import { Plus } from "lucide-react";
import "@/components/Add Button/AddButton.scss";

interface AddButtonProps {
  onClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <button className="add-button" type="button" onClick={onClick}>
      <Plus size={20} />
    </button>
  );
};

export default AddButton;
