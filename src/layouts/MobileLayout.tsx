import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { grey } from "@mui/material/colors";
import {
  Alert,
  AlertTitle,
  Avatar,
  Backdrop,
  BottomNavigation,
  BottomNavigationAction,
  CircularProgress,
  Container,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";

import { useAppContext } from "../context/app.context";
import { useToken } from "../hooks/token";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: "#fff",
  color: theme.palette.primary.main,
}));

interface NavigationItem {
  label: string;
  icon: JSX.Element;
  path: string;
}

export default function MobileLayout() {
  const [value, setValue] = useState(0);
  const { appAlert, setAppAlert, isLoading, setIsLoading } = useAppContext();
  const { removeToken, getDecodeUserToken } = useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const user = getDecodeUserToken();

  const navigationItems: NavigationItem[] = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Attendance", icon: <AccessTimeIcon />, path: "/attendances" },
    { label: "Schedule", icon: <CalendarMonthIcon />, path: "/schedules" },
    { label: "Profile", icon: <PersonIcon />, path: "/profiles" },
  ];

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    removeToken();
    navigate("/");
    window.location.reload();
  };

  const handleNavigationChange = (newValue: number) => {
    setValue(newValue);
    navigate(navigationItems[newValue].path);
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const index = navigationItems.findIndex(
      (item) => item.path === currentPath
    );
    if (index !== -1) {
      setValue(index);
    }
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: grey[50],
      }}
    >
      <CssBaseline />

      {/* Top AppBar */}
      <AppBar position="fixed" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
              }}
            >
              ABSENSI
            </Typography>

            <Tooltip title="Settings">
              <Avatar
                onClick={handleOpenUserMenu}
                // alt={user?.name || "User"}
                src="/static/images/avatar/2.jpg"
                sx={{ cursor: "pointer", width: 32, height: 32 }}
              />
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          mt: 7, // Space for AppBar
          mb: 7, // Space for BottomNavigation
        }}
      >
        {isLoading ? (
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            }}
            open={isLoading}
            onClick={() => setIsLoading(false)}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <Outlet />
        )}
      </Box>

      {/* Bottom Navigation */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => handleNavigationChange(newValue)}
          sx={{
            "& .Mui-selected": {
              "& .MuiBottomNavigationAction-label": {
                fontSize: "0.75rem",
              },
            },
          }}
        >
          {navigationItems.map((item, index) => (
            <BottomNavigationAction
              key={index}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>

      {/* Alert Snackbar */}
      <Stack direction="row" justifyContent="flex-end" zIndex={1100}>
        <Snackbar
          open={appAlert.isDisplayAlert}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={5000}
          onClose={() => {
            setAppAlert({
              isDisplayAlert: false,
              message: "",
              alertType: undefined,
            });
          }}
        >
          <Alert severity={appAlert.alertType}>
            <AlertTitle>{appAlert?.alertType?.toUpperCase()}</AlertTitle>
            {appAlert.message}
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
}
