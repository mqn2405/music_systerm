import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-hot-toast";
import { adminLogin } from "../../../services/admin";
import { USER_KEY } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (!email?.trim()?.length || !password?.trim()?.length) {
      return toast.error("Email or Password can not blank");
    }

    const loginResult = await adminLogin(email, password);
    if (loginResult?.data?.success) {
      const { payload } = loginResult?.data;
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          email: payload?.email,
          role: payload?.role,
          name: payload?.name,
          _id: payload?._id,
        })
      );
      toast.success(
        "Đăng nhập tài khoản thành công, bạn sẽ chuyển sang trang dashboard trong 2 giây"
      );
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } else {
      return toast.error(loginResult?.data?.error || "Đăng nhập thất bại");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Trang quản trị
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              type={"email"}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng nhập
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
