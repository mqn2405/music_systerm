import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import AlbumIcon from "@mui/icons-material/Album";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import LanguageIcon from "@mui/icons-material/Language";
import BugReportIcon from "@mui/icons-material/BugReport";
import PersonOffIcon from "@mui/icons-material/PersonOff";

import { useLocation } from "react-router-dom";
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

export function AdminLayout(props) {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const pathName = useLocation().pathname;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              TRANG QUẢN TRỊ
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            <React.Fragment>
              <ListItemButton
                onClick={() => navigate("/admin")}
                sx={pathName === "/admin" ? { background: "#b0b0b0" } : {}}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/category")}
                sx={
                  pathName === "/admin/category"
                    ? { background: "#b0b0b0" }
                    : {}
                }
              >
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Thể loại" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/country")}
                sx={
                  pathName === "/admin/country" ? { background: "#b0b0b0" } : {}
                }
              >
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText primary="Quốc gia" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/album")}
                sx={
                  pathName === "/admin/album" ? { background: "#b0b0b0" } : {}
                }
              >
                <ListItemIcon>
                  <AlbumIcon />
                </ListItemIcon>
                <ListItemText primary="Album" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/singer")}
                sx={
                  pathName === "/admin/singer" ? { background: "#b0b0b0" } : {}
                }
              >
                <ListItemIcon>
                  <InterpreterModeIcon />
                </ListItemIcon>
                <ListItemText primary="Ca sĩ" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/music")}
                sx={
                  pathName === "/admin/music" ? { background: "#b0b0b0" } : {}
                }
              >
                <ListItemIcon>
                  <LibraryMusicIcon />
                </ListItemIcon>
                <ListItemText primary="Bài hát" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/song-report")}
                sx={
                  pathName === "/admin/song-report"
                    ? { background: "#b0b0b0" }
                    : {}
                }
              >
                <ListItemIcon>
                  <BugReportIcon />
                </ListItemIcon>
                <ListItemText primary="Báo cáo bài hát" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/user-report")}
                sx={
                  pathName === "/admin/user-report"
                    ? { background: "#b0b0b0" }
                    : {}
                }
              >
                <ListItemIcon>
                  <PersonOffIcon />
                </ListItemIcon>
                <ListItemText primary="Báo cáo tài khoản" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/admin-account")}
                sx={
                  pathName === "/admin/admin-account"
                    ? { background: "#b0b0b0" }
                    : {}
                }
              >
                <ListItemIcon>
                  <ManageAccountsIcon />
                </ListItemIcon>
                <ListItemText primary="Tài khoản nhân viên" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/user-account")}
                sx={
                  pathName === "/admin/user-account"
                    ? { background: "#b0b0b0" }
                    : {}
                }
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Tài khoản khách hàng" />
              </ListItemButton>
            </React.Fragment>
          </List>
          <Divider />
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {props.children}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
