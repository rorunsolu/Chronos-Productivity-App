import { useState, useRef, useEffect } from "react";
import "@/components/Dropdown/Dropdown.scss";

interface DropdownProps {
        value: string;
        onChange: (value: string ) => void;
        options: string[];
        placeholder: string;
}
const Dropdown: React.FC<DropdownProps> = ({ value, onChange, options, placeholder }) => {

        const [isOpen, setIsOpen] = useState(false);
        //const options = ["Low", "Medium", "High"];

        // referncing the dropdown div so that it can be used to close the dropdown when the user clicks outside of it
        const dropdownRef = useRef<HTMLDivElement>(null);

        // prev is the previous state of the isOpen state and !prev is the opposite of the previous state
        const toggleDropdown = () => {
                setIsOpen((prev) => !prev);
        }

        // this passes the selected option (that the user clciked on) to the onChnage function located in the parent component (ProjectEditingPage.tsx)
        const handleOptionSelection = (option: string) => {
                onChange(option);
                setIsOpen(false);
        }

        useEffect(() => {
                // if the user clicks outside of the dropdown, the dropdown will close
                const handleOutsideClick = (event: MouseEvent) => {
                        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                                setIsOpen(false);
                        }
                };

                document.addEventListener("mousedown", handleOutsideClick);
                return () => document.removeEventListener("mousedown", handleOutsideClick);
        }, []);

        return (
                <div className="dropdown" ref={dropdownRef}>

                        <div className="dropdown__selection" onClick={toggleDropdown}>
                                {value || placeholder}
                        </div>

                        {isOpen && (
                                <div className="dropdown__options">
                                        {options.map((option) => (
                                                <div
                                                        className={`dropdown__option ${value === option ? "selected-option" : ""}`}
                                                        key={option}
                                                        onClick={() => handleOptionSelection(option)}
                                                >
                                                        {option}
                                                </div>
                                        ))}
                                </div>
                        )}

                </div>
        )
}

export default Dropdown;
