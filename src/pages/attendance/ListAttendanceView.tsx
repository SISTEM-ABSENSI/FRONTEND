import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Store as StoreIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useHttp } from "../../hooks/http";
import { green, orange, blue, grey } from "@mui/material/colors";
import { convertTime } from "../../utilities/convertTime";

interface IAttendance {
  scheduleId: number;
  scheduleName: string;
  scheduleEndDate: string;
  scheduleStartDate: string;
  scheduleStatus: string;
  store: {
    storeName: string;
    storeAddress: string;
  };
}

export default function ListAttendanceView() {
  const [attendances, setAttendances] = useState<IAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const navigate = useNavigate();
  const { handleGetTableDataRequest } = useHttp();

  const getAttendances = async () => {
    setLoading(true);
    try {
      const result = await handleGetTableDataRequest({
        path: "/schedules",
        page: 0,
        size: 50,
        filter: {
          search: search || "",
          scheduleStatus: status === "all" ? "all" : status,
        },
      });

      if (result && Array.isArray(result?.items)) {
        setAttendances(result.items);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendances();
  }, [status]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "checkin":
        return {
          color: green[500],
          bgcolor: green[50],
          icon: <CheckCircleIcon sx={{ color: green[500] }} />,
        };
      case "checkout":
        return {
          color: orange[500],
          bgcolor: orange[50],
          icon: <CancelIcon sx={{ color: orange[500] }} />,
        };
      case "waiting":
        return {
          color: blue[500],
          bgcolor: blue[50],
          icon: <ScheduleIcon sx={{ color: blue[500] }} />,
        };
      default:
        return {
          color: grey[500],
          bgcolor: grey[50],
          icon: <AccessTimeIcon sx={{ color: grey[500] }} />,
        };
    }
  };

  const handleSearch = () => {
    getAttendances();
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header with Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Attendance List</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search store or schedule..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSearch}
                      sx={{ minWidth: 100 }}
                    >
                      Search
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <Tabs
              value={status}
              onChange={(_, newValue) => setStatus(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                label={
                  <Chip
                    label="All"
                    variant={status === "all" ? "filled" : "outlined"}
                  />
                }
                value="all"
              />
              <Tab
                label={
                  <Chip
                    label="Waiting"
                    color="primary"
                    variant={status === "waiting" ? "filled" : "outlined"}
                  />
                }
                value="waiting"
              />
              <Tab
                label={
                  <Chip
                    label="Check In"
                    color="success"
                    variant={status === "checkin" ? "filled" : "outlined"}
                  />
                }
                value="checkin"
              />
              <Tab
                label={
                  <Chip
                    label="Check Out"
                    color="warning"
                    variant={status === "checkout" ? "filled" : "outlined"}
                  />
                }
                value="checkout"
              />
            </Tabs>
          </Stack>
        </CardContent>
      </Card>

      {/* Attendance List */}
      <Card>
        <List>
          {loading ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <CircularProgress />
            </Box>
          ) : attendances.length > 0 ? (
            attendances.map((attendance, index) => (
              <Box key={attendance.scheduleId}>
                <ListItem
                  disabled={attendance.scheduleStatus === "checkout"}
                  onClick={() => {
                    if (attendance.scheduleStatus !== "checkout") {
                      navigate(`/attendances/detail/${attendance.scheduleId}`, {
                        state: {
                          store: attendance.store,
                          attendance: attendance,
                        },
                      });
                    }
                  }}
                  sx={{
                    py: 2,
                    "&:hover": {
                      bgcolor:
                        attendance.scheduleStatus === "checkout"
                          ? "inherit"
                          : grey[50],
                    },
                    cursor:
                      attendance.scheduleStatus === "checkout"
                        ? "default"
                        : "pointer",
                    opacity: attendance.scheduleStatus === "checkout" ? 0.5 : 1,
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: blue[50] }}>
                      <StoreIcon sx={{ color: blue[500] }} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        {attendance.store.storeName}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={1} mt={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {attendance.scheduleName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Start:
                          {convertTime(attendance.scheduleStartDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          End:
                          {convertTime(attendance.scheduleEndDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {attendance.store.storeAddress}
                        </Typography>
                      </Stack>
                    }
                  />
                  <Stack alignItems="center" spacing={1}>
                    {getStatusColor(attendance.scheduleStatus).icon}
                    <Chip
                      label={attendance.scheduleStatus.toUpperCase()}
                      size="small"
                      sx={{
                        color: getStatusColor(attendance.scheduleStatus).color,
                        bgcolor: getStatusColor(attendance.scheduleStatus)
                          .bgcolor,
                      }}
                    />
                  </Stack>
                </ListItem>
                {index < attendances.length - 1 && <Divider />}
              </Box>
            ))
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                No attendance records found
              </Typography>
            </Box>
          )}
        </List>
      </Card>
    </Box>
  );
}
