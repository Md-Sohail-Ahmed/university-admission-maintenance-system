import { Navigate, Outlet } from "react-router-dom";
import { getLoggedInStudent } from "../services/api";

function ProtectedRoute() {
    return getLoggedInStudent() ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
