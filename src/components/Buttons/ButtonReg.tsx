import "@/components/Buttons/ButtonReg.scss";

interface ButtonRegProps {
  label: string;
  onClick?: () => void;
  type?: "primary" | "secondary";
  formSubmit?: boolean;
}

const ButtonReg: React.FC<ButtonRegProps> = ({
  label,
  onClick,
  type = "primary",
  formSubmit = false,
}) => {
  return (
    // Set the button type based on the formSubmit prop
    <button
      type={formSubmit ? "submit" : "button"}
      className={`button-reg button-reg--${type}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ButtonReg;
