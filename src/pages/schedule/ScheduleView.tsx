import { useEffect, useState } from "react";
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
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  Event as EventIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayCircle as InProgressIcon,
  Schedule as WaitingIcon,
  CheckCircle as DoneIcon,
} from "@mui/icons-material";
import { useHttp } from "../../hooks/http";
import { green, orange, blue, grey, red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/app.context";

interface ISchedule {
  scheduleId: number;
  scheduleName: string;
  scheduleStartDate: string;
  scheduleEndDate: string;
  scheduleStatus: string;
  store: {
    storeName: string;
    storeAddress: string;
  };
}

export default function ScheduleView() {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<ISchedule | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { handleGetTableDataRequest, handleDeleteRequest } = useHttp();
  const navigate = useNavigate();
  const { setAppAlert } = useAppContext();

  const getSchedules = async () => {
    setLoading(true);
    try {
      const result = await handleGetTableDataRequest({
        path: "/schedules",
        page: 0,
        size: 50,
        filter: {
          search: search || undefined,
          scheduleStatus: status === "all" ? undefined : status,
        },
      });
      if (result) {
        setSchedules(result.items);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSchedules();
  }, [status]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "inprogress":
        return {
          color: blue[500],
          bgcolor: blue[50],
          icon: <InProgressIcon sx={{ color: blue[500] }} />,
        };
      case "waiting":
        return {
          color: orange[500],
          bgcolor: orange[50],
          icon: <WaitingIcon sx={{ color: orange[500] }} />,
        };
      case "done":
        return {
          color: green[500],
          bgcolor: green[50],
          icon: <DoneIcon sx={{ color: green[500] }} />,
        };
      default:
        return {
          color: grey[500],
          bgcolor: grey[50],
          icon: <EventIcon sx={{ color: grey[500] }} />,
        };
    }
  };

  const handleSearch = () => {
    getSchedules();
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    schedule: ISchedule
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedSchedule(schedule);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSchedule(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (selectedSchedule) {
      navigate(`/schedule/edit/${selectedSchedule.scheduleId}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedSchedule) {
      try {
        await handleDeleteRequest({
          path: `/schedules/${selectedSchedule.scheduleId}`,
        });
        setAppAlert({
          isDisplayAlert: true,
          message: "Schedule deleted successfully",
          alertType: "success",
        });
        getSchedules();
      } catch (error) {
        setAppAlert({
          isDisplayAlert: true,
          message: "Failed to delete schedule",
          alertType: "error",
        });
      }
    }
    setDeleteDialogOpen(false);
    handleMenuClose();
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header with Search and Add Button */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Schedule List</Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/schedule/create")}
              >
                Add Schedule
              </Button>
            </Stack>
            <TextField
              fullWidth
              size="small"
              placeholder="Search schedule..."
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
                    label="In Progress"
                    color="primary"
                    variant={status === "inprogress" ? "filled" : "outlined"}
                  />
                }
                value="inprogress"
              />
              <Tab
                label={
                  <Chip
                    label="Waiting"
                    color="warning"
                    variant={status === "waiting" ? "filled" : "outlined"}
                  />
                }
                value="waiting"
              />
              <Tab
                label={
                  <Chip
                    label="Done"
                    color="success"
                    variant={status === "done" ? "filled" : "outlined"}
                  />
                }
                value="done"
              />
            </Tabs>
          </Stack>
        </CardContent>
      </Card>

      {/* Schedule List */}
      <Card>
        <List>
          {loading ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <CircularProgress />
            </Box>
          ) : schedules.length > 0 ? (
            schedules.map((schedule, index) => (
              <Box key={schedule.scheduleId}>
                <ListItem
                  sx={{
                    py: 2,
                    "&:hover": {
                      bgcolor: grey[50],
                    },
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: blue[50] }}>
                      <EventIcon sx={{ color: blue[500] }} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        {schedule.scheduleName}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={1} mt={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {schedule.store.storeName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(
                            schedule.scheduleStartDate
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            schedule.scheduleEndDate
                          ).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {schedule.store.storeAddress}
                        </Typography>
                      </Stack>
                    }
                  />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={schedule.scheduleStatus.toUpperCase()}
                      size="small"
                      sx={{
                        color: getStatusColor(schedule.scheduleStatus).color,
                        bgcolor: getStatusColor(schedule.scheduleStatus)
                          .bgcolor,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, schedule)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Stack>
                </ListItem>
                {index < schedules.length - 1 && <Divider />}
              </Box>
            ))
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">No schedules found</Typography>
            </Box>
          )}
        </List>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, color: blue[500] }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setDeleteDialogOpen(true);
          }}
          sx={{ color: red[500] }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Schedule</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this schedule? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
