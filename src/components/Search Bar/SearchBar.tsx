import { Search } from "lucide-react";
import "@/components/Search Bar/SearchBar.scss";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <form className="search-bar">
      <Search size={20} />
      <input
        className="search-bar__input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </form>
  );
};

export default SearchBar;
