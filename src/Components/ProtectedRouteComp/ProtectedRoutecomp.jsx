import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace state={{ message: "Login required" }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
