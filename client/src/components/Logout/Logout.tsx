import { Button } from "@mui/material";
import { useAppDispatch } from "../../redux/hook";
import { logout } from "../../redux/auth/authSlice";

export default function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Button variant="outlined" color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  );
}