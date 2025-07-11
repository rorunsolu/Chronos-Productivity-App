import { ArrowDownUp, ArrowUpDown } from "lucide-react";
import "@/components/Sort Toggle Button/SortToggleButton.scss";

interface SortToggleButtonProps {
  isNewestFirst: boolean;
  onToggle: () => void;
}

const SortToggleButton: React.FC<SortToggleButtonProps> = ({
  isNewestFirst,
  onToggle,
}) => {
  return (
    <button className="sort-toggle-button" type="button" onClick={onToggle}>
      {isNewestFirst ? <ArrowDownUp size={20} /> : <ArrowUpDown size={20} />}
    </button>
  );
};

export default SortToggleButton;
