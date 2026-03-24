import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hook";

export default function ProtectedRoute({ children, role }: any) {
  const { user, token } = useAppSelector(state => state.auth);

  if (!token || !user) return <Navigate to="/login" replace />;

  if (role && user.role !== role)
    return <Navigate to="/" replace />;

  return children;
}