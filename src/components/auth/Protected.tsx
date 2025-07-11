import { UserAuth } from "@/contexts/authContext/AuthContext";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const Protected: React.FC<ProtectedProps> = ({
  children,
  allowGuest = false,
}) => {
  const { user } = UserAuth();

  const hasAccess = user && (allowGuest || !user.isAnonymous);

  if (!hasAccess) {
    return <Navigate to="/" />;
  }

  return children;
};

export default Protected;

interface ProtectedProps {
  children: ReactNode;
  allowGuest?: boolean;
}
