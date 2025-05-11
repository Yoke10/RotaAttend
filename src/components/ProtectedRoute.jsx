// @ts-nocheck
import { Navigate } from "react-router-dom";
import { useFirebase } from "../lib/context";

function ProtectedRoute({ children }) {
  const { user } = useFirebase();

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}

export default ProtectedRoute;
