import { Navigate } from "react-router-dom";
import { UserAuth } from "@/contexts/authContext/AuthContext";
import { ReactNode } from "react";

const Protected: React.FC<ProtectedProps> = ({
  children,
  allowGuest = false,
}) => {
  const { user } = UserAuth();

  // if (!user) {
  //     return <Navigate to="/" />;
  // }

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
