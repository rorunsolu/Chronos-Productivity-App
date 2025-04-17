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
      {isNewestFirst ? <ArrowDownUp /> : <ArrowUpDown />}
    </button>
  );
};

export default SortToggleButton;
