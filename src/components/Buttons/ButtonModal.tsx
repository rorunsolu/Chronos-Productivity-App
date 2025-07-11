import "@/components/Buttons/ButtonModal.scss";

interface ButtonModalProps {
  disabledCondition?: string | null;
  type: "submit" | "button";
  onClick?: () => void;
}

const ButtonModal: React.FC<ButtonModalProps> = ({
  disabledCondition,
  type,
  onClick,
}) => {
  return (
    <button
      className={`button-modal ${
        type === "submit" ? "button-modal--create" : "button-modal--cancel"
      }`}
      disabled={disabledCondition !== undefined && !disabledCondition}
      type={type}
      onClick={onClick}
    >
      {type === "submit" ? "Create" : "Cancel"}
    </button>
  );
};

export default ButtonModal;
