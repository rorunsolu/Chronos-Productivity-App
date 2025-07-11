import "@/components/Buttons/ButtonReg.scss";

interface ButtonRegProps {
  label?: string;
  onClick?: () => void;
  type?: "primary" | "secondary";
  formSubmit?: boolean;
  icon?: React.ReactNode;
}

const ButtonReg: React.FC<ButtonRegProps> = ({
  label,
  onClick,
  type = "primary",
  formSubmit = false,
  icon,
}) => {
  return (
    <button
      type={formSubmit ? "submit" : "button"}
      className={`button-reg button-reg--${type}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
};

export default ButtonReg;
