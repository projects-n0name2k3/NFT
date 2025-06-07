import useUserStore from "@/store/user-store";

import { Navigate } from "react-router";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  isOranizer?: boolean;
}

const ProtectedRoute = ({
  isAuthenticated,
  children,
  isOranizer,
}: ProtectedRouteProps) => {
  const { user } = useUserStore();

  // Redirect to login if not authenticated
  if (!isOranizer) {
    if (!isAuthenticated || !user) {
      const currentUrl = window.location.pathname;
      return (
        currentUrl !== "/signin" && (
          <Navigate
            to={`/signin?referrer=${encodeURIComponent(
              window.location.pathname
            )}`}
            replace
          />
        )
      );
    }
  }

  if (isOranizer) {
    if (user && user.role !== "organizer") {
      return <Navigate to="/forbidden" replace />;
    }
    if (!isAuthenticated || !user) {
      return <Navigate to="/signin" />;
    }
  }

  return children;
};

export default ProtectedRoute;
