import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Stack,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  CalendarMonth as CalendarMonthIcon,
  ArrowForward as ArrowForwardIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { useHttp } from "../../hooks/http";
import { blue, green, orange } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { IUserModel } from "../../models/userModel";

interface IScheduleModel {
  scheduleId: number;
  scheduleName: string;
  scheduleEndDate: string;
  scheduleStatus: string;
  store: {
    storeName: string;
  };
}

export default function HomeView() {
  const [schedules, setSchedules] = useState<IScheduleModel[]>([]);
  const [user, setUser] = useState<IUserModel | null>(null);
  const { handleGetTableDataRequest, handleGetRequest } = useHttp();

  const theme = useTheme();
  const navigate = useNavigate();

  const getSchedules = async () => {
    try {
      const result = await handleGetTableDataRequest({
        path: "/schedules",
        page: 0,
        size: 5,
        filter: { scheduleStatusNot: "checkout" },
      });
      if (result && Array.isArray(result?.items)) {
        setSchedules(result.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMyProfile = async () => {
    try {
      const result = await handleGetRequest({ path: "/my-profile" });
      setUser(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyProfile();
    getSchedules();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "checkin":
        return green[500];
      case "checkout":
        return orange[500];
      case "waiting":
        return blue[500];
      default:
        return theme.palette.text.secondary;
    }
  };

  const quickActions = [
    {
      title: "Check Attendance",
      icon: <AccessTimeIcon />,
      color: blue[100],
      iconColor: blue[500],
      path: "/attendances",
    },
    {
      title: "View Schedule",
      icon: <CalendarMonthIcon />,
      color: green[100],
      iconColor: green[500],
      path: "/schedules",
    },
    {
      title: "Attendance History",
      icon: <HistoryIcon />,
      color: orange[100],
      iconColor: orange[500],
      path: "/attendances/histories",
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* Header Section */}
      <Card sx={{ mb: 3, bgcolor: blue[50] }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{ width: 60, height: 60 }}
              src="https://vasundharaodisha.org/upload/84552no-user.jpg"
            />
            <Box>
              <Typography variant="h6">Welcome back,</Typography>
              <Typography variant="h5" fontWeight="bold">
                {user?.userName || "User"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.userRole || "Loading..."}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper
              sx={{
                p: 2,
                bgcolor: action.color,
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => navigate(action.path)}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "white" }}>
                  <Box sx={{ color: action.iconColor }}>{action.icon}</Box>
                </Avatar>
                <Typography variant="subtitle1" fontWeight="medium">
                  {action.title}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Schedules */}
      <Card>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Recent Schedules</Typography>
            <IconButton onClick={() => navigate("/attendances")}>
              <ArrowForwardIcon />
            </IconButton>
          </Stack>
          <Divider />
          <List>
            {schedules.length > 0 ? (
              schedules.map((schedule, index) => (
                <ListItem
                  key={schedule.scheduleId}
                  divider={index !== schedules.length - 1}
                >
                  <ListItemIcon>
                    <AccessTimeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={schedule.store.storeName}
                    secondary={`${schedule.scheduleName} - ${new Date(
                      schedule.scheduleEndDate
                    ).toLocaleDateString()}`}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: getStatusColor(schedule.scheduleStatus) }}
                  >
                    {schedule.scheduleStatus.toUpperCase()}
                  </Typography>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText
                  primary="No schedules available"
                  secondary="Check back later for updates"
                  sx={{ textAlign: "center" }}
                />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
