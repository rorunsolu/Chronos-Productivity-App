interface ErrorMsgProps {
  message?: string;
}

const ErrorMsg: React.FC<ErrorMsgProps> = ({ message }) => (
  <p className="text-center mt-2 text-red-500 text-sm">
    {message || "An unexpected error occurred. Please try again."}
  </p>
);

export default ErrorMsg;
