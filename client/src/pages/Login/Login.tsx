import { useEffect } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { loginThunk, clearError } from "../../redux/auth/authSlice";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schema/login";
import type { z } from "zod";

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token, loading, error } = useAppSelector(s => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginForm) => {
    dispatch(clearError());
    dispatch(loginThunk(data));
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box className="login-container">
        <Paper elevation={6} className="login-card">

          <Typography variant="h4" className="login-title">
            Login
          </Typography>

          <Typography className="login-label">Email address</Typography>
          <TextField
            fullWidth
            autoFocus
            size="small"
            {...register("username")}
            onChange={(e) => {
              register("username").onChange(e);
              if (error) dispatch(clearError());
            }}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <Typography className="login-label">Password</Typography>
          <TextField
            fullWidth
            type="password"
            size="small"
            {...register("password")}
            onChange={(e) => {
              register("password").onChange(e);
              if (error) dispatch(clearError());
            }}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {error && <div className="login-error">{error}</div>}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? "Loading..." : "Login"}
          </Button>

          <Typography className="login-register">
            Need an account?
            <span onClick={() => alert("Register coming soon 🙂")}>
              Register
            </span>
          </Typography>

        </Paper>
      </Box>
    </form>
  );
}