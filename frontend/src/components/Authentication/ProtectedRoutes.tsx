import { Navigate, Outlet } from "react-router-dom";
import { useFirebaseAuth } from "../../contexts/FirebaseAuth.context";

export function ProtectedRoutes() {
  const { currentUser, isLoading } = useFirebaseAuth();

  if (isLoading) {
    // TODO: Add a loading spinner
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }
  return <Outlet />;
}
