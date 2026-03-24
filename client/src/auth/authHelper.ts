import { store } from "../redux/store";
import { logout } from "../redux/auth/authSlice";

export const performLogout = () => {
  localStorage.removeItem("token");
  store.dispatch(logout());
};