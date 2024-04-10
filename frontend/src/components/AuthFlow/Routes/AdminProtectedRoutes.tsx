import { Navigate, Outlet } from "react-router-dom";
import { useFirebaseAuth } from "../../../contexts/FirebaseAuth.context";

export function AdminProtectedRoute() {
  const { currentUser, isLoading, isAdmin } = useFirebaseAuth();

  if (isLoading) {
    // TODO: Add a loading spinner
    return <div>Loading...</div>;
  }

  // Redirect non admin users to dashboard
  if (!currentUser || !isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
}
