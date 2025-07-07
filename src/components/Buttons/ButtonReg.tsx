import "@/components/Buttons/ButtonReg.scss";

interface ButtonRegProps {
  label: string;
  onClick?: () => void;
  type?: "primary" | "secondary";
}

const ButtonReg: React.FC<ButtonRegProps> = ({
  label,
  onClick,
  type = "primary",
}) => {
  return (
    <button className={`button-reg button-reg--${type}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default ButtonReg;
