import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import TicketsPage from "./pages/Tickets/Tickets";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAppSelector } from "./redux/hook";

export default function App() {
  const token = useAppSelector(s => s.auth.token);

  return (
    <Routes>

      <Route
        path="/login"
        element={
          token ? <Navigate to="/" replace /> : <Login />
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TicketsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}